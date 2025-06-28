/* eslint-disable react/prop-types */
import Car from "../../assets/car.png";
import { Link } from "react-router-dom";
import "./endingAuction.scss";

const EndingAuction = ({ item }) => {
  return (
    <Link className="link" to="/product/2">
      <div className="endingAuction">
        <div className="container">
          <img src={Car} alt="" />
          <span>{item.title}</span>
          <div className="desc">
            <span>{item.distanceCv}</span>
            <span>{item.modelColor}</span>
            <span>{item.transmission}</span>
            <span>{item.engineType}</span>
          </div>
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt=""
            />
            <div className="info">
              <span className="name">Sabbath</span>
              <span className="status">Seller</span>
            </div>
          </div>
          <div className="carStatus">
            <div className="timeleft">{item.timeLeft}</div>
            <div className="activebids">{item.activeBids}</div>
            <div className="current bid">{item.currentBid}</div>
          </div>
          <button>Place a Bid</button>
        </div>
      </div>
    </Link>
  );
};

export default EndingAuction;
