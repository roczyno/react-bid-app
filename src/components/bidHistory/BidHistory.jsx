import { Link, useLocation } from "react-router-dom";
import "./bidHistory.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { addBid, getAuctionBids } from "../../redux/apiCalls";
import { useSelector, useDispatch } from "react-redux";

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
  const [auctionBids, setAuctionBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location.pathname.split("/")[2];
  const user = useSelector((state) => state.user.currentUser);
  const userId = user?.user?.id;

  useEffect(() => {
    if (!data?.endTime) return;

    const updateTimeLeft = () => {
      const now = moment();
      const end = moment(data.endTime);
      const duration = moment.duration(end.diff(now));

      if (duration.asMilliseconds() <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [data?.endTime]);

  const fetchAuctionBids = async () => {
    try {
      setIsLoading(true);
      const response = await getAuctionBids(id);
      setAuctionBids(response.bids || []);
    } catch (error) {
      console.error("Error fetching auction bids:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenBuyNow = () => setOpenBuyNow(true);
  const handleCloseBuyNow = () => setOpenBuyNow(false);

  const handleOpenPlaceBid = () => setOpenPlaceBid(true);
  const handleClosePlaceBid = () => setOpenPlaceBid(false);

  const handleOpenViewHistory = () => {
    setOpenViewHistory(true);
    fetchAuctionBids();
  };
  const handleCloseViewHistory = () => setOpenViewHistory(false);

  const handleBidAmountChange = (event) => setBidAmount(event.target.value);

  const handleBuyNowSubmit = async () => {
    if (!data?.buyNowPrice) {
      toast.error("Buy now price not available");
      return;
    }

    try {
      setIsLoading(true);
      await addBid(dispatch, { amount: data.buyNowPrice }, id);
      toast.success("Purchase successful!");
      handleCloseBuyNow();
    } catch (error) {
      console.error("Buy now error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceBidSubmit = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    if (parseFloat(bidAmount) <= (data?.currentPrice || data?.startingPrice)) {
      toast.error("Bid must be higher than current price");
      return;
    }

    try {
      setIsLoading(true);
      await addBid(dispatch, { amount: parseFloat(bidAmount) }, id);
      setBidAmount("");
      handleClosePlaceBid();
      // Refresh the page data
      window.location.reload();
    } catch (error) {
      console.error("Place bid error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuctionEnded = moment().isAfter(moment(data?.endTime));
  const isOwner = userId === data?.sellerId;

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
        {data?.bids?.length ? (
          data.bids.slice(0, 5).map((item, index) => (
            <div className="item" key={index}>
              <div className="bidderInfo">
                <img
                  src={
                    item.bidder?.avatar ||
                    "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=600"
                  }
                  alt="Bidder"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  onError={(e) => {
                    e.target.src = "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=600";
                  }}
                />
                <div className="info">
                  <span>
                    {item.bidder ? `${item.bidder.firstName} ${item.bidder.lastName}` : 'Anonymous'}
                  </span>
                  <span className="time">
                    {moment(item.timestamp).fromNow()}
                  </span>
                </div>
              </div>
              <div className="amount">
                <span>${item.amount}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-bids">
            <span>No bids yet. Be the first to bid!</span>
          </div>
        )}
      </div>

      <div className="bottom">
        {!isAuctionEnded && !isOwner && user && (
          <>
            {data?.buyNowPrice && (
              <button className="btn-yellow" onClick={handleOpenBuyNow} disabled={isLoading}>
                Buy now - ${data.buyNowPrice}
              </button>
            )}
            <button className="btn-green" onClick={handleOpenPlaceBid} disabled={isLoading}>
              Place a Bid
            </button>
          </>
        )}
        
        <button className="btn-default" onClick={handleOpenViewHistory}>
          View bid history
        </button>

        {!isOwner && user && (
          <button className="btn-green">
            <Link to={`/chat?userId=${data?.sellerId}`} className="link">
              Chat with Seller
            </Link>
          </button>
        )}

        {!user && (
          <div className="auth-required">
            <Link to="/login">Login to place bids</Link>
          </div>
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
            Purchase this item immediately for ${data?.buyNowPrice}
          </Typography>
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              onClick={handleBuyNowSubmit}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                background: "#57b3ac",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                flex: 1
              }}
            >
              {isLoading ? "Processing..." : "Confirm Purchase"}
            </button>
            <button
              onClick={handleCloseBuyNow}
              style={{
                padding: "10px 20px",
                background: "#ccc",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                flex: 1
              }}
            >
              Cancel
            </button>
          </div>
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
            Current price: ${data?.currentPrice || data?.startingPrice}
          </Typography>
          <input
            type="number"
            value={bidAmount}
            onChange={handleBidAmountChange}
            placeholder={`Minimum: $${(data?.currentPrice || data?.startingPrice) + 1}`}
            min={(data?.currentPrice || data?.startingPrice) + 1}
            style={{
              width: "100%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handlePlaceBidSubmit}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                background: "#57b3ac",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                flex: 1
              }}
            >
              {isLoading ? "Placing..." : "Place Bid"}
            </button>
            <button
              onClick={handleClosePlaceBid}
              style={{
                padding: "10px 20px",
                background: "#ccc",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                flex: 1
              }}
            >
              Cancel
            </button>
          </div>
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
            style={{ marginTop: "16px", maxHeight: "300px", overflowY: "auto" }}
          >
            {isLoading ? (
              <div>Loading bid history...</div>
            ) : auctionBids?.length ? (
              auctionBids.map((item, index) => (
                <div
                  className="user"
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    padding: "10px",
                    border: "1px solid #eee",
                    borderRadius: "4px"
                  }}
                >
                  <div className="left" style={{ display: "flex" }}>
                    <img
                      src={
                        item.bidder?.avatar ||
                        "https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=600"
                      }
                      alt=""
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=600";
                      }}
                    />
                    <div className="others">
                      <span
                        className="name"
                        style={{ display: "block", fontWeight: "bold" }}
                      >
                        {item.bidder ? `${item.bidder.firstName} ${item.bidder.lastName}` : 'Anonymous'}
                      </span>
                      <span className="time_left" style={{ color: "#888" }}>
                        {moment(item.timestamp).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="right">
                    <span style={{ fontWeight: "bold" }}>
                      ${item.amount}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-bids">
                <span>No bids yet. Be the first to bid!</span>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default BidHistory;