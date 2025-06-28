import { io } from "socket.io-client";

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io("http://localhost:3000", {
      auth: {
        token: token
      },
      transports: ["websocket", "polling"]
    });

    this.socket.on("connect", () => {
      console.log("Connected to server");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinAuction(auctionId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("joinAuction", auctionId);
    }
  }

  leaveAuction(auctionId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("leaveAuction", auctionId);
    }
  }

  placeBid(auctionId, amount) {
    if (this.socket && this.isConnected) {
      this.socket.emit("placeBid", { auctionId, amount });
    }
  }

  sendMessage(receiverId, content, auctionId = null) {
    if (this.socket && this.isConnected) {
      this.socket.emit("sendMessage", { receiverId, content, auctionId });
    }
  }

  onNewBid(callback) {
    if (this.socket) {
      this.socket.on("newBid", callback);
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("newMessage", callback);
    }
  }

  onAuctionEnded(callback) {
    if (this.socket) {
      this.socket.on("auctionEnded", callback);
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on("notification", callback);
    }
  }

  offAllListeners() {
    if (this.socket) {
      this.socket.off("newBid");
      this.socket.off("newMessage");
      this.socket.off("auctionEnded");
      this.socket.off("notification");
    }
  }
}

export const socketClient = new SocketClient();