/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./auction.scss";
import Car from "../../assets/car.png";

const Auction = ({ data }) => {
  return (
    <div className="auction">
      <div className="container">
        <div className="left">
          <img src={Car} alt="" />
        </div>
        <div className="right">
          <p className="title">{data.title}</p>
          <div className="desc">
            <span>{data.distanceCv}</span>
            <span>{data.engineType}</span>
            <span>{data.modelColor}</span>
            <span>{data.transmission}</span>
          </div>
          <div className="user">
            <img
              src="https://media.istockphoto.com/id/1353379172/photo/cute-little-african-american-girl-looking-at-camera.jpg?s=1024x1024&w=is&k=20&c=umFtOYrvwG4HIDCAskJ5U-2ncPlSoNXETjog2YbpC10="
              alt=""
            />
            <div className="userInfo">
              <span className="name">Barbara</span>
              <span className="distanceAway">50 miles away</span>
            </div>
          </div>
          <div className="bottom">
            <span>$3000</span>
            <Link to="/product/1" className="link">
              <button>view auction</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
