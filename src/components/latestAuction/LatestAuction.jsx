import { Link } from "react-router-dom";
import "./latestAuction.scss";
import moment from "moment";

const LatestAuction = ({ item }) => {
  const formatTimeLeft = (endTime) => {
    const now = moment();
    const end = moment(endTime);
    const duration = moment.duration(end.diff(now));
    
    if (duration.asMilliseconds() <= 0) {
      return "Auction ended";
    }
    
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <Link to={`/product/${item.id}`} className="link">
      <div className="latestAuction">
        <div className="container">
          <img 
            src={item.images?.[0] || "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg"} 
            alt={item.title}
            onError={(e) => {
              e.target.src = "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg";
            }}
          />
          <span>{item.title}</span>
          <div className="desc">
            <span>{item.mileage ? `${item.mileage} miles` : 'N/A'}</span>
            <span>{item.color || 'N/A'}</span>
            <span>{item.transmission || 'N/A'}</span>
            <span>{item.fuelType || 'N/A'}</span>
          </div>
          <div className="userInfo">
            <img
              src={
                item.seller?.avatar ||
                "https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-260nw-1406263805.jpg"
              }
              alt="Seller"
              onError={(e) => {
                e.target.src = "https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-260nw-1406263805.jpg";
              }}
            />
            <div className="info">
              <span className="name">
                {item.seller ? `${item.seller.firstName} ${item.seller.lastName}` : 'Unknown Seller'}
              </span>
              <span className="status">Seller</span>
            </div>
          </div>
          <div className="carStatus">
            <div className="timeleft">
              {formatTimeLeft(item.endTime)}
            </div>
            <div className="activebids">
              {item._count?.bids || 0} bids
            </div>
            <div className="currentbid">
              ${item.currentPrice || item.startingPrice}
            </div>
          </div>
          <button>Place a Bid</button>
        </div>
      </div>
    </Link>
  );
};

export default LatestAuction;