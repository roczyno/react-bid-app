import "./header.scss";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  return (
    <div className="header">
      <ToastContainer />
      <div className="text">
        <h1>
          Say hello to your next <br /> awesome Itmes
        </h1>
        <h3>
          Featuring used,WholeSale and Salvage cars, <br />
          Trucks and SUV for Sale
        </h3>
      </div>
      <div className="filterContainer">
        <div className="cat">
          <select>
            <option value="">Select Category</option>
            <option value="">ajjhgkhfjhfjh</option>
            <option value="">a</option>
            <option value="">a</option>
            <option value="">a</option>
            <option value="">a</option>
            <option value="">a</option>
            <option value="">a</option>
          </select>
        </div>
        <div className="search">
          <input type="search" placeholder="     Search Items" />
          <SearchIcon className="icon" />
        </div>
        <div className="filter">
          <TuneIcon />
          <span>Filter</span>
        </div>
        <div className="button">
          <button>Search</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
