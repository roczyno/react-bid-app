import { Link, useNavigate } from "react-router-dom";
import "./navbar.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/userRedux";
import PostAuctionModal from "../postAuction/PostAuctionModal";

const Navbar = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [showProfile, setShowProfile] = useState(false);
  const [openPostAuctionModal, setOpenPostAuctionModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenPostAuctionModal = () => setOpenPostAuctionModal(true);
  const handleClosePostAuctionModal = () => setOpenPostAuctionModal(false);

  return (
    <div className="navbar">
      <div className="container">
        <div className="top">
          <div className="container">
            <div className="info">
              <span>Help</span>
              <span>How to buy</span>
              <span>How to sell</span>
            </div>
            <div className="cart">
              <span>Cart</span>
              <ShoppingCartIcon />
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="container">
            <Link to="/" className="link">
              <div className="logo">CarDealer</div>
            </Link>
            <div className="links">
              <div className="navlinks">
                {user && (
                  <Link className="link" to="/dashboard">
                    <span>Dashboard</span>
                  </Link>
                )}
                {!user && (
                  <Link className="link" to="/auctions">
                    <span>Auctions</span>
                  </Link>
                )}
                {user && (
                  <Link className="link" to="/my-auctions">
                    <span>My Auctions</span>
                  </Link>
                )}
                {user && (
                  <Link className="link" to="/upgrade">
                    <span>Upgrade</span>
                  </Link>
                )}
                <Link to="/about" className="link">
                  <span>About Us</span>
                </Link>
                <span>FAQ</span>
                <Link className="link" to="/contact">
                  <span>Contact</span>
                </Link>
                <Link className="link" to="/chat">
                  <span>Chat</span>
                </Link>
                {user && (
                  <button onClick={handleOpenPostAuctionModal}>
                    Post an Auction
                  </button>
                )}
              </div>

              {!user && (
                <div className="buttons">
                  <Link className="link" to="/login">
                    <button>Login</button>
                  </Link>
                  <Link className="link" to="/register">
                    <button>Sign Up</button>
                  </Link>
                </div>
              )}
            </div>
            {user && (
              <div
                className="user"
                onClick={() => setShowProfile(!showProfile)}
              >
                <img
                  src={
                    user.user.profilePic ||
                    "https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-260nw-14062638"
                  }
                  alt=""
                />
                <KeyboardArrowDownIcon />
              </div>
            )}
          </div>
          {showProfile && (
            <div className="profile">
              <div className="wrapper">
                <img
                  src={
                    user.user.profilePic ||
                    "https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-260nw-14062638"
                  }
                  alt=""
                />

                <h5>{user.username}</h5>
                <div className="trans">
                  <div className="balance">
                    <span className="bold">$500</span>
                    <span className="light">balance</span>
                  </div>
                  <div className="bids">
                    <span className="bold">0 bids</span>
                    <span className="light">bids won</span>
                  </div>
                </div>
                <span>Transaction history</span>
                <span>Settings</span>
                <span onClick={handleLogout}>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <PostAuctionModal
        isOpen={openPostAuctionModal}
        onClose={handleClosePostAuctionModal}
      />
    </div>
  );
};

export default Navbar;
