import { Link } from "react-router-dom";

const EndingAuction = ({ item }) => {
  return (
    <Link className="link" to="/product/2">
      <div className="border border-gray-300 rounded-lg w-full max-w-sm min-h-[500px] md:min-h-[450px] overflow-hidden cursor-pointer mx-auto hover:shadow-lg transition-shadow">
        <div className="m-1 flex flex-col gap-2 h-[calc(100%-8px)]">
          <img 
            src="https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg" 
            alt={item.title}
            className="w-full h-48 md:h-56 object-cover rounded"
          />
          
          <span className="font-medium text-sm md:text-base px-2">{item.title}</span>
          
          <div className="flex flex-wrap gap-2 text-gray-500 text-xs px-2">
            <span>{item.distanceCv}</span>
            <span>{item.modelColor}</span>
            <span>{item.transmission}</span>
            <span>{item.engineType}</span>
          </div>
          
          <div className="flex items-center gap-3 font-medium px-2">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Seller"
              className="w-10 h-10 md:w-12 md:h-12 rounded object-cover"
            />
            <div className="flex flex-col md:flex-row gap-1 md:gap-3 text-xs md:text-sm">
              <span className="font-medium">Sabbath</span>
              <span className="text-gray-500">Seller</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between font-medium text-xs px-2 gap-2">
            <div className="text-red-600">{item.timeLeft}</div>
            <div className="text-blue-600">{item.activeBids} bids</div>
            <div className="text-green-600 font-semibold">${item.currentBid}</div>
          </div>
          
          <button className="mt-auto mx-2 mb-2 py-2 md:py-3 text-white bg-primary border-none rounded cursor-pointer text-sm font-medium hover:bg-primary/90 transition-colors">
            Place a Bid
          </button>
        </div>
      </div>
    </Link>
  );
};

export default EndingAuction;