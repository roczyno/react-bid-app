import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./chat.scss";
import { userRequest } from "../../requestMethods";
import { useSelector } from "react-redux";
import moment from "moment";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const Chat = () => {
  const [chat, setChat] = useState(true);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");
  const id = parseInt(userId);
  const user = useSelector((state) => state.user.currentUser);
  const reqUser = user.user || null;

  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const createChat = async () => {
      try {
        await userRequest.post(`/chat/create/${id}`);
        console.log("Chat created for user with ID:", id);
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    };
    createChat();
  }, [id]);

  useEffect(() => {
    const getUsersChat = async () => {
      try {
        const res = await userRequest.get("/chat/user");
        setChats(res.data.content);
      } catch (error) {
        console.error("Error fetching user's chats:", error);
      }
    };
    getUsersChat();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      connectWebSocket();
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    const socket = new SockJS(
      "https://springboot-bidding-app-api.onrender.com/api/v1/ws"
    );
    const stompClientInstance = Stomp.over(socket);

    stompClientInstance.connect(
      {},
      (frame) => {
        console.log("Connected to WebSocket:", frame);

        stompClientInstance.subscribe(
          `/topic/chat${selectedChat.id}`,
          (message) => {
            showMessage(JSON.parse(message.body));
          }
        );

        setStompClient(stompClientInstance);
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );
  };

  const showMessage = (message) => {
    console.log("Received message:", message);
    setMessages((prevMessages) => [
      ...(Array.isArray(prevMessages) ? prevMessages : []),
      message,
    ]);
  };

  const getChatMessages = async (chatId) => {
    try {
      const res = await userRequest.get(`/message/chat/${chatId}`);
      setMessages(res.data);
      console.log("Messages for chat ID", chatId, ":", res.data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    getChatMessages(chat.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const recipientId =
      reqUser.id === selectedChat.users[0].id
        ? selectedChat.users[1].id
        : selectedChat.users[0].id;

    try {
      await userRequest.post("/message", {
        chatId: selectedChat.id,
        userId: recipientId,
        content: newMessage,
      });

      console.log("Sending message:", newMessage);

      if (stompClient) {
        stompClient.send(
          "/app/chat.sendMessage",
          {},
          JSON.stringify({
            chatId: selectedChat.id,
            content: newMessage,
            userId: reqUser.id,
          })
        );
      } else {
        console.error("Stomp client is not connected.");
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat">
      <div className="wrapper">
        <div className="messages">
          <h1>Messages</h1>
          {chats.map((data) => (
            <div
              className="message"
              key={data.id}
              onClick={() => handleChatSelect(data)}
            >
              <img
                src={
                  reqUser.id === data.users[0].id
                    ? data.users[1].profilePic
                    : data.users[0].profilePic
                }
                alt=""
              />
              <span>
                {reqUser.id === data.users[0].id
                  ? data.users[1].firstName
                  : data.users[0].firstName}
              </span>
              <p>gsghskghjgskgnslnsg...</p>
            </div>
          ))}
        </div>

        {chat && selectedChat && (
          <>
            <div className="chatBox">
              <div className="top">
                <div className="user">
                  <img
                    src={
                      reqUser.id === selectedChat.users[0].id
                        ? selectedChat.users[1].profilePic
                        : selectedChat.users[0].profilePic
                    }
                    alt=""
                  />
                  {reqUser.id === selectedChat.users[0].id
                    ? selectedChat.users[1].firstName
                    : selectedChat.users[0].firstName}
                </div>
                <div className="close" onClick={() => setChat(null)}>
                  X
                </div>
              </div>
              <div className="center">
                {messages?.map((message) => (
                  <div
                    className={`chatMessage ${
                      message.userId === reqUser?.id ? "own" : ""
                    }`}
                    key={message.id}
                  >
                    <p>{message.content}</p>
                    <span>{moment(message.createdAt).fromNow()}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="bottom">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                ></textarea>
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
