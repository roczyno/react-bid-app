/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import "./bidHistory.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { userRequest } from "../../requestMethods";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid lightgray",
  boxShadow: 24,
  p: 4,
};

const BidHistory = ({ data }) => {
  const [openBuyNow, setOpenBuyNow] = useState(false);
  const [openPlaceBid, setOpenPlaceBid] = useState(false);
  const [openViewHistory, setOpenViewHistory] = useState(false);
  const [auction, setAuction] = useState([]);
  const [buyNowAmount, setBuyNowAmount] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const userId = useSelector((state) => state.user.currentUser).user.id;

  useEffect(() => {
    const getAuction = async () => {
      const res = await userRequest(`/bid/auction/${id}`);
      setAuction(res.data.content);
    };
    if (openViewHistory) {
      getAuction();
    }
  }, [id, openViewHistory]);

  useEffect(() => {
    const countdown = moment.duration(data.timeLeft);

    const interval = setInterval(() => {
      countdown.subtract(1, "second");
      const formattedTime = `${countdown.days()} days, ${countdown.hours()} hours, ${countdown.minutes()} minutes, ${countdown.seconds()} seconds`;
      setTimeLeft(formattedTime);

      if (countdown.asSeconds() <= 0) {
        clearInterval(interval);
        setTimeLeft("Auction ended");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data.timeLeft]);

  const handleOpenBuyNow = () => setOpenBuyNow(true);
  const handleCloseBuyNow = () => setOpenBuyNow(false);

  const handleOpenPlaceBid = () => setOpenPlaceBid(true);
  const handleClosePlaceBid = () => setOpenPlaceBid(false);

  const handleOpenViewHistory = () => setOpenViewHistory(true);
  const handleCloseViewHistory = () => setOpenViewHistory(false);

  const handleBuyNowChange = (event) => setBuyNowAmount(event.target.value);
  const handleBidAmountChange = (event) => setBidAmount(event.target.value);

  const handleBuyNowSubmit = async () => {
    try {
      const res = await userRequest.post(`/bid/auction/buy/${id}`);
      toast(res.message);
    } catch (error) {
      toast(error.message);
    }
    handleCloseBuyNow();
  };

  const handlePlaceBidSubmit = async () => {
    try {
      const res = await userRequest.post(`/bid/auction/${id}`, {
        amount: bidAmount,
      });
      toast(res.data);
    } catch (error) {
      toast(error.response.data[0].error);
    }
    handleClosePlaceBid();
  };

  const { bids } = data || {};

  return (
    <div className="bidhistory">
      <ToastContainer />
      <div className="top">
        <span className="title">Bidding History</span>
        <div className="time">
          <span>Time left</span>
          <span>{timeLeft || "N/A"}</span>
        </div>
      </div>

      <div className="center">
        {bids?.length ? (
          bids.map((item, index) => (
            <div className="item" key={index}>
              <div className="bidderInfo">
                <img
                  src="https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Bidder"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
                <div className="info">
                  <span>{item.userId.username}</span>
                  <span className="time">
                    {moment(item.createdAt).fromNow()}
                  </span>
                </div>
              </div>
              <div className="amount">
                <span>${item.amount}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-bids"></div>
        )}
      </div>

      <div className="bottom">
        <button className="btn-yellow" onClick={handleOpenBuyNow}>
          Buy now
        </button>
        <button className="btn-green" onClick={handleOpenPlaceBid}>
          Place a Bid
        </button>
        <button className="btn-default" onClick={handleOpenViewHistory}>
          View bid history
        </button>

        {userId === data.userId && (
          <button className="btn-green">
            <Link to="/chat" className="link">
              Chat Auction Owner
            </Link>
          </button>
        )}
      </div>

      {/* Buy Now Modal */}
      <Modal
        open={openBuyNow}
        onClose={handleCloseBuyNow}
        aria-labelledby="buy-now-modal-title"
        aria-describedby="buy-now-modal-description"
      >
        <Box sx={style}>
          <Typography id="buy-now-modal-title" variant="h6" component="h2">
            Buy Now
          </Typography>
          <Typography id="buy-now-modal-description" sx={{ mt: 2 }}>
            Enter the amount to buy now:
          </Typography>
          <input
            type="number"
            value={buyNowAmount}
            onChange={handleBuyNowChange}
            style={{
              width: "100%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleBuyNowSubmit}
            style={{
              padding: "10px 20px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </Box>
      </Modal>

      {/* Place a Bid Modal */}
      <Modal
        open={openPlaceBid}
        onClose={handleClosePlaceBid}
        aria-labelledby="place-bid-modal-title"
        aria-describedby="place-bid-modal-description"
      >
        <Box sx={style}>
          <Typography id="place-bid-modal-title" variant="h6" component="h2">
            Place a Bid
          </Typography>
          <Typography id="place-bid-modal-description" sx={{ mt: 2 }}>
            Enter your bid amount:
          </Typography>
          <input
            type="number"
            value={bidAmount}
            onChange={handleBidAmountChange}
            style={{
              width: "100%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handlePlaceBidSubmit}
            style={{
              padding: "10px 20px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </Box>
      </Modal>

      {/* View Bid History Modal */}
      <Modal
        open={openViewHistory}
        onClose={handleCloseViewHistory}
        aria-labelledby="view-bid-history-modal-title"
        aria-describedby="view-bid-history-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="view-bid-history-modal-title"
            variant="h6"
            component="h2"
          >
            Bid History
          </Typography>
          <div
            id="view-bid-history-modal-description"
            style={{ marginTop: "16px" }}
          >
            {auction?.length ? (
              auction.map((item, index) => (
                <div
                  className="user"
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div className="left" style={{ display: "flex" }}>
                    <img
                      src="https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=600"
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        marginRight: "10px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="others">
                      <span
                        className="name"
                        style={{ display: "block", fontWeight: "bold" }}
                      >
                        {item.username}
                      </span>
                      <span className="time_left" style={{ color: "#888" }}>
                        {moment(item.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="right">
                    <span style={{ fontWeight: "bold" }}>
                      &#x20B5;{item.amount}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-bids">
                <span>No bids Yet. Bid now!</span>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default BidHistory;
