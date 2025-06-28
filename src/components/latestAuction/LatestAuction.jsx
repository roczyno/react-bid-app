import { Link } from "react-router-dom";
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
      <div className="border border-gray-300 rounded-lg w-full max-w-sm min-h-[500px] md:min-h-[450px] overflow-hidden cursor-pointer mx-auto hover:shadow-lg transition-shadow">
        <div className="m-1 flex flex-col gap-2 h-[calc(100%-8px)]">
          <img 
            src={item.images?.[0] || "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg"} 
            alt={item.title}
            className="w-full h-48 md:h-56 object-cover rounded"
            onError={(e) => {
              e.target.src = "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg";
            }}
          />
          
          <span className="font-medium text-sm md:text-base px-2">{item.title}</span>
          
          <div className="flex flex-wrap gap-2 text-gray-500 text-xs px-2">
            <span>{item.mileage ? `${item.mileage} miles` : 'N/A'}</span>
            <span>{item.color || 'N/A'}</span>
            <span>{item.transmission || 'N/A'}</span>
            <span>{item.fuelType || 'N/A'}</span>
          </div>
          
          <div className="flex items-center gap-3 font-medium px-2">
            <img
              src={
                item.seller?.avatar ||
                "https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-260nw-1406263805.jpg"
              }
              alt="Seller"
              className="w-10 h-10 md:w-12 md:h-12 rounded object-cover"
              onError={(e) => {
                e.target.src = "https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-260nw-1406263805.jpg";
              }}
            />
            <div className="flex flex-col md:flex-row gap-1 md:gap-3 text-xs md:text-sm">
              <span className="font-medium">
                {item.seller ? `${item.seller.firstName} ${item.seller.lastName}` : 'Unknown Seller'}
              </span>
              <span className="text-gray-500">Seller</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between font-medium text-xs px-2 gap-2">
            <div className="text-red-600">
              {formatTimeLeft(item.endTime)}
            </div>
            <div className="text-blue-600">
              {item._count?.bids || 0} bids
            </div>
            <div className="text-green-600 font-semibold">
              ${item.currentPrice || item.startingPrice}
            </div>
          </div>
          
          <button className="mt-auto mx-2 mb-2 py-2 md:py-3 text-white bg-primary border-none rounded cursor-pointer text-sm font-medium hover:bg-primary/90 transition-colors">
            Place a Bid
          </button>
        </div>
      </div>
    </Link>
  );
};

export default LatestAuction;