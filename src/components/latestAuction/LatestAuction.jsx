/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./latestAuction.scss";
import moment from "moment";

const LatestAuction = ({ item }) => {
  return (
    <Link to={`/product/${item.id}`} className="link">
      <div className="latestAuction">
        <div className="container">
          <img src={item.images[0]} alt="" />
          <span>{item.title}</span>
          <div className="desc">
            <span>{item.distanceCv}</span>
            <span>{item.modelColor}</span>
            <span>{item.transmission}</span>
            <span>{item.engineType}</span>
          </div>
          <div className="userInfo">
            <img
              src={
                item.userProfilePic ||
                "https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-260nw-1406263805.jpg"
              }
              alt=""
            />
            <div className="info">
              <span className="name">{item.username}</span>
              <span className="status">Seller</span>
            </div>
          </div>
          <div className="carStatus">
            <div className="timeleft">
              {moment(item.timeLeft).format("dddd, h:mm A")}
            </div>
            <div className="activebids">{item.activeBids}</div>
            <div className="current bid">${item.currentBid}</div>
          </div>
          <button>Place a Bid</button>
        </div>
      </div>
    </Link>
  );
};

export default LatestAuction;
