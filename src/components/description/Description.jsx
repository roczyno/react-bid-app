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

const Description = () => {
  return (
    <div className="desc">
      <div className="top">
        <div className="item">
          <DirectionsCarIcon className="icon" />
          <div className="info">
            <p>Sedan </p>
            <p className="p">Body Type</p>
          </div>
        </div>
        <div className="item">
          <AirlineSeatReclineNormalIcon className="icon" />
          <div className="info">
            <p>5 seats</p>
            <p className="p">Volume</p>
          </div>
        </div>
        <div className="item">
          <LocalGasStationIcon className="icon" />
          <div className="info">
            <p>27-29Mpg</p>
            <p className="p">Consumption</p>
          </div>
        </div>
        <div className="item">
          <SettingsIcon className="icon" />
          <div className="info">
            <p>3.2l 6-Cylinder</p>
            <p className="p">Engine</p>
          </div>
        </div>
      </div>
      <div className="center">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
          consequatur dicta rerum consequuntur, eligendi quibusdam saepe,
          perferendis, quo temporibus perspiciatis quidem maxime asperiores! Non
          earum officia inventore possimus reprehenderit dolorum molestias, iure
          quae accusamus vel at ducimus ex, provident voluptatum repellendus
          nobis. Commodi deserunt optio accusantium consequatur, illo sit
          distinctio!
        </p>
        <div className="wrapper">
          <div className="left">
            <div className="item">
              <AdjustIcon />
              <span>17 Inc Wheel</span>
            </div>
            <div className="item">
              <CompareArrowsIcon />
              <span>Lane Departure Warning</span>
            </div>
            <div className="item">
              <SpeedIcon />
              <span>Push-Start Button</span>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <SwapVertIcon />
              <span>forward Collision Warning</span>
            </div>
            <div className="item">
              <FlashlightOnIcon />
              <span>LED headlight</span>
            </div>
            <div className="item">
              <SensorsIcon />
              <span>Front and rear parking sensors</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom">
        <p>Warranty</p>
        <div className="wrapper">
          <div className="left">
            <div className="item">
              <span>Bumper to Bumber</span>
              <span>48 months/ 50,000 miles</span>
            </div>
            <div className="item">
              <span>Roadside Assistance</span>
              <span>48 months / unlimited distance</span>
            </div>
            <div className="item">
              <span>Basic warranty terms</span>
              <span>1year</span>
            </div>
            <div className="item">
              <span>Dealer certification required</span>
              <span>196-point inspection</span>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <span>Powertrain</span>
              <span>48 months / 50,000 miles</span>
            </div>
            <div className="item">
              <span>Maximum age/Mileage</span>
              <span>Certified Pre-Owned Elite</span>
            </div>
            <div className="item">
              <span>Engine Components</span>
              <span>50,000 miles</span>
            </div>
            <div className="item">
              <span>Roadside Assistance</span>
              <span>1year</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
