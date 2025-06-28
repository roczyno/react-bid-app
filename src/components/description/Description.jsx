import "./description.scss";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SettingsIcon from "@mui/icons-material/Settings";
import AdjustIcon from "@mui/icons-material/Adjust";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import SpeedIcon from "@mui/icons-material/Speed";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import FlashlightOnIcon from "@mui/icons-material/FlashlightOn";
import SensorsIcon from "@mui/icons-material/Sensors";

const Description = ({ auction }) => {
  if (!auction) return null;

  return (
    <div className="desc">
      <div className="top">
        <div className="item">
          <DirectionsCarIcon className="icon" />
          <div className="info">
            <p>{auction.make} {auction.model}</p>
            <p className="p">Vehicle</p>
          </div>
        </div>
        <div className="item">
          <AirlineSeatReclineNormalIcon className="icon" />
          <div className="info">
            <p>{auction.year}</p>
            <p className="p">Year</p>
          </div>
        </div>
        <div className="item">
          <LocalGasStationIcon className="icon" />
          <div className="info">
            <p>{auction.fuelType || 'N/A'}</p>
            <p className="p">Fuel Type</p>
          </div>
        </div>
        <div className="item">
          <SettingsIcon className="icon" />
          <div className="info">
            <p>{auction.transmission || 'N/A'}</p>
            <p className="p">Transmission</p>
          </div>
        </div>
      </div>
      
      <div className="center">
        <p>{auction.description}</p>
        
        <div className="wrapper">
          <div className="left">
            <div className="item">
              <AdjustIcon />
              <span>Mileage: {auction.mileage ? `${auction.mileage} miles` : 'N/A'}</span>
            </div>
            <div className="item">
              <CompareArrowsIcon />
              <span>Condition: {auction.condition}</span>
            </div>
            <div className="item">
              <SpeedIcon />
              <span>Color: {auction.color || 'N/A'}</span>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <SwapVertIcon />
              <span>Location: {auction.location}</span>
            </div>
            <div className="item">
              <FlashlightOnIcon />
              <span>VIN: {auction.vin || 'Not provided'}</span>
            </div>
            <div className="item">
              <SensorsIcon />
              <span>Starting Price: ${auction.startingPrice}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bottom">
        <p>Auction Details</p>
        <div className="wrapper">
          <div className="left">
            <div className="item">
              <span>Current Price</span>
              <span>${auction.currentPrice || auction.startingPrice}</span>
            </div>
            {auction.buyNowPrice && (
              <div className="item">
                <span>Buy Now Price</span>
                <span>${auction.buyNowPrice}</span>
              </div>
            )}
            {auction.reservePrice && (
              <div className="item">
                <span>Reserve Price</span>
                <span>${auction.reservePrice}</span>
              </div>
            )}
          </div>
          <div className="right">
            <div className="item">
              <span>Total Bids</span>
              <span>{auction._count?.bids || 0}</span>
            </div>
            <div className="item">
              <span>Seller</span>
              <span>{auction.seller ? `${auction.seller.firstName} ${auction.seller.lastName}` : 'Unknown'}</span>
            </div>
            <div className="item">
              <span>Status</span>
              <span>{auction.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;