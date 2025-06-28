import { useEffect, useRef, useState } from "react";
import moment from "moment";
import "./myAuction.scss";
import { useDispatch, useSelector } from "react-redux";
import { addBid } from "../../redux/apiCalls";
import { userRequest } from "../../requestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ITEM_HEIGHT = 48;

const MyAuction = ({ data }) => {
  const [bid, setBid] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const open = Boolean(anchorEl);
  const bidInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  const userId = user?.user?.id;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Update time left
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

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [data?.endTime]);

  const handleBid = async () => {
    if (!bid || parseFloat(bid) <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    if (parseFloat(bid) <= (data?.currentPrice || data?.startingPrice)) {
      toast.error("Bid must be higher than current price");
      return;
    }

    try {
      setIsLoading(true);
      await addBid(dispatch, { amount: parseFloat(bid) }, data.id);
      setBid("");
      if (bidInputRef.current) {
        bidInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Bid error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAuction = async (id) => {
    try {
      setIsLoading(true);
      await userRequest.delete(`/auctions/${id}`);
      toast.success("Auction deleted successfully");
      // Refresh the page or update the list
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to delete auction";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAuction = async (id) => {
    try {
      setIsLoading(true);
      await userRequest.put(`/auctions/${id}`, { status: "CANCELLED" });
      toast.success("Auction cancelled successfully");
      // Refresh the page or update the list
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to cancel auction";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isOwner = userId === data?.sellerId;
  const isAuctionEnded = moment().isAfter(moment(data?.endTime));
  const canBid = !isOwner && !isAuctionEnded && user;

  const menuOptions = [];
  if (isOwner) {
    if (!isAuctionEnded && data?.status === "ACTIVE") {
      menuOptions.push("Cancel Auction");
    }
    if (data?._count?.bids === 0) {
      menuOptions.push("Delete Auction");
    }
  } else {
    menuOptions.push("Chat with Seller");
  }

  return (
    <div className="myAuction">
      <ToastContainer />
      <div className="my_auction_container">
        <div className="left">
          <Link to={`/product/${data.id}`} className="link">
            <img 
              src={data.images?.[0] || "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg"} 
              alt={data.title}
              onError={(e) => {
                e.target.src = "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg";
              }}
            />
          </Link>
        </div>
        <div className="right">
          <div className="info">
            <span className="title">{data.title}</span>
            {menuOptions.length > 0 && (
              <div>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  disabled={isLoading}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: "20ch",
                    },
                  }}
                >
                  {menuOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => {
                        handleClose();
                        if (option === "Cancel Auction") {
                          handleCloseAuction(data.id);
                        } else if (option === "Delete Auction") {
                          handleDeleteAuction(data.id);
                        } else if (option === "Chat with Seller") {
                          navigate(`/chat?userId=${data.sellerId}`);
                        }
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            )}
          </div>
          
          <div className="descript">
            <span>{data.mileage ? `${data.mileage} miles` : 'N/A'}</span>
            <span>{data.fuelType || 'N/A'}</span>
            <span>{data.color || 'N/A'}</span>
            <span>{data.transmission || 'N/A'}</span>
          </div>

          <div className="others">
            <div className="item">
              <h5>{timeLeft}</h5>
              <span>Time left</span>
            </div>
            <div className="item">
              <h5>{moment(data.endTime).format("MMM DD, h:mm A")}</h5>
              <span>Auction ending</span>
            </div>
            <div className="item">
              <h5>{data._count?.bids || 0}</h5>
              <span>Active bids</span>
            </div>
            <div className="item">
              <h5>${data.currentPrice || data.startingPrice}</h5>
              <span>Current Price</span>
            </div>
          </div>

          {canBid && (
            <div className="bottom">
              <input
                type="number"
                placeholder={`Enter bid (min $${(data.currentPrice || data.startingPrice) + 1})`}
                ref={bidInputRef}
                onChange={(e) => setBid(e.target.value)}
                min={(data.currentPrice || data.startingPrice) + 1}
              />
              <button onClick={handleBid} disabled={isLoading}>
                {isLoading ? "Placing..." : "Place Bid"}
              </button>
            </div>
          )}

          {!user && (
            <div className="bottom">
              <Link to="/login">
                <button>Login to Bid</button>
              </Link>
            </div>
          )}

          {isAuctionEnded && (
            <div className="auction-status">
              <span className="ended">Auction Ended</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAuction;