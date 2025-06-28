/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import "./myAuction.scss";
import { useDispatch, useSelector } from "react-redux";
import { addBid, getAuctions } from "../../redux/apiCalls";
import { publicRequest, userRequest } from "../../requestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ITEM_HEIGHT = 48;
const options = ["Close Auction", "Delete Auction", "Chat Auction Owner"];

const MyAuction = ({ data }) => {
  const [bid, setBid] = useState("");
  const [countdown, setCountdown] = useState(data.timeLeft);
  const userId = useSelector((state) => state.user.currentUser).user.id;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const bidInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to handle placing a bid
  const handleBid = async () => {
    try {
      await addBid(
        dispatch,
        {
          amount: bid,
        },
        data.id
      );
      bidInputRef.current.value = ""; // Clear input after successful bid
      await refreshAuctions(); // Refresh auctions list after successful bid
    } catch (error) {
      console.log(error);
      toast.error(error.response.data[0].error); // Display error message on bid failure
    }
  };

  // Function to handle deleting an auction
  const handleDeleteAuction = async (id) => {
    try {
      const res = await userRequest.delete(`/auction/${id}`);
      toast.success(res.data); // Display success message on auction deletion
      await refreshAuctions(); // Refresh auctions list after deletion
    } catch (error) {
      toast.error(error.response.data[0].error); // Display error message on deletion failure
    }
  };

  // Function to handle closing an auction
  const handleCloseAuction = async (id) => {
    try {
      const res = await userRequest.put(`/auction/status/${id}?status=CLOSED`);
      toast.success(res.data); // Display success message on auction closure
      await refreshAuctions(); // Refresh auctions list after closure
    } catch (error) {
      toast.error(error.response.data[0].error); // Display error message on closure failure
    }
  };

  // Refresh auctions list function
  const refreshAuctions = async () => {
    try {
      await getAuctions(dispatch); // Fetch updated auctions list
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  // Countdown timer logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => Math.max(0, prevCountdown - 1000));
    }, 1000);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  // API call when countdown reaches 0 to handle auction end
  useEffect(() => {
    if (countdown === 0) {
      const handleAuctionEnd = async () => {
        try {
          await publicRequest.post(
            `auction/closeAutomatically/${data.id}?status=CLOSED`
          );
        } catch (error) {
          console.error("Error at auction end:", error); // Log error if API call fails
        }
      };
      handleAuctionEnd();
    }
  }, [countdown, data.id]);

  // Format countdown time using moment for display
  const formattedTimeLeft = moment.duration(countdown).humanize();

  // Filter options based on whether the current user is the auction owner
  const filteredOptions = options.filter((option) => {
    if (option === "Chat Auction Owner") {
      return userId !== data.userId;
    }
    return true;
  });

  return (
    <div className="myAuction">
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <div className="my_auction_container">
        <div className="left">
          <Link to={`/product/${data.id}`} className="link">
            <img src={data.images[0]} alt="" />
          </Link>
        </div>
        <div className="right">
          <div className="info">
            <span className="title">{data.title}</span>
            <div>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
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
                {filteredOptions.map((option) => (
                  <MenuItem
                    key={option}
                    onClick={() => {
                      handleClose();
                      if (option === "Close Auction") {
                        handleCloseAuction(data.id);
                      } else if (option === "Delete Auction") {
                        handleDeleteAuction(data.id);
                      } else if (option === "Chat Auction Owner") {
                        navigate(`/chat?userId=${data.userId}`);
                      }
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
          <div className="descript">
            <span>{data.distanceCv}.</span>
            <span>{data.engineType}.</span>
            <span>{data.modelColor}.</span>
            <span>{data.transmission}.</span>
          </div>

          <div className="others">
            <div className="item">
              <h5>{formattedTimeLeft}</h5>
              <span>Time left</span>
            </div>
            <div className="item">
              <h5>{moment(data.endDate).format("dddd, h:mm A")}</h5>
              <span>Auction ending</span>
            </div>
            <div className="item">
              <h5>{data.activeBids}</h5>
              <span>Active bids</span>
            </div>
            <div className="item">
              <h5>{data.currentBid}</h5>
              <span>Current Bid</span>
            </div>
          </div>

          <div className="bottom">
            <input
              type="text"
              placeholder="Enter your bid (minimum $1400)"
              ref={bidInputRef}
              onChange={(e) => setBid(e.target.value)}
            />
            <button onClick={handleBid}>Place Bid</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAuction;
