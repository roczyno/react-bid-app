import { Link, useNavigate } from "react-router-dom";
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
    <div className="sticky top-0 z-50 w-full h-20 md:h-25 flex items-center justify-center">
      <div className="h-full w-full">
        {/* Top Bar */}
        <div className="w-full h-2/5 bg-primary flex justify-center items-center">
          <div className="max-w-6xl w-full flex justify-between items-center text-white px-4 md:px-6">
            <div className="flex gap-2 md:gap-3">
              <span className="text-xs md:text-sm">Help</span>
              <span className="text-xs md:text-sm">How to buy</span>
              <span className="text-xs md:text-sm">How to sell</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs md:text-sm">Cart</span>
              <ShoppingCartIcon className="text-sm md:text-base" />
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="w-full h-3/5 bg-white flex items-center justify-center relative shadow-lg px-4 md:px-6">
          <div className="w-full max-w-6xl flex items-center justify-between text-black">
            {/* Logo */}
            <Link to="/" className="link">
              <div className="text-lg md:text-2xl text-primary font-bold">CarDealer</div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex gap-4 text-xs items-center">
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
                <span className="cursor-pointer">FAQ</span>
                <Link className="link" to="/contact">
                  <span>Contact</span>
                </Link>
                <Link className="link" to="/chat">
                  <span>Chat</span>
                </Link>
                {user && (
                  <button 
                    onClick={handleOpenPostAuctionModal}
                    className="px-3 py-2 bg-primary text-white rounded text-xs hover:bg-primary/90 transition-colors"
                  >
                    Post an Auction
                  </button>
                )}
              </div>

              {/* Auth Buttons */}
              {!user && (
                <div className="flex items-center gap-3">
                  <Link className="link" to="/login">
                    <button className="px-4 py-2 text-xs bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link className="link" to="/register">
                    <button className="px-4 py-2 text-xs bg-white text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              {user ? (
                <div className="flex items-center cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
                  <img
                    src={user.user.profilePic || "https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-260nw-14062638"}
                    alt="Profile"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  />
                  <KeyboardArrowDownIcon className="text-sm" />
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login">
                    <button className="px-3 py-1 text-xs bg-primary text-white rounded">Login</button>
                  </Link>
                  <Link to="/register">
                    <button className="px-3 py-1 text-xs border border-primary text-primary rounded">Sign Up</button>
                  </Link>
                </div>
              )}
            </div>

            {/* User Profile */}
            {user && (
              <div className="hidden lg:flex items-center cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
                <img
                  src={user.user.profilePic || "https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-260nw-14062638"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <KeyboardArrowDownIcon />
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-4 md:right-6 top-full mt-2 w-48 md:w-52 bg-white rounded-lg shadow-xl border z-50">
              <div className="p-4 flex flex-col items-center gap-3">
                <img
                  src={user.user.profilePic || "https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-260nw-14062638"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <h5 className="font-medium">{user.username}</h5>
                <div className="flex gap-4 text-center">
                  <div>
                    <span className="block font-medium">$500</span>
                    <span className="text-gray-500 text-sm">balance</span>
                  </div>
                  <div>
                    <span className="block font-medium">0 bids</span>
                    <span className="text-gray-500 text-sm">bids won</span>
                  </div>
                </div>
                <div className="w-full space-y-2 text-sm">
                  <span className="block cursor-pointer hover:text-primary">Transaction history</span>
                  <span className="block cursor-pointer hover:text-primary">Settings</span>
                  <span className="block cursor-pointer hover:text-primary" onClick={handleLogout}>Logout</span>
                </div>
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