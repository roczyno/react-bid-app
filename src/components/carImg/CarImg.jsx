/* eslint-disable react/prop-types */
import "./carImg.scss";
import Car1 from "../../assets/carImg1.png";
import Car2 from "../../assets/carImg2.png";

// eslint-disable-next-line react/prop-types
const CarImg = ({ auction }) => {
  return (
    <div className="CarImg">
      <div className="carImg">
        <div className="firstImg">
          <img src={auction.content?.images} alt="" />
        </div>
        <div className="others">
          <img src={Car1} alt="" />
          <div className="item">
            <img src={auction.content?.images} alt="" />
            <img src={Car2} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarImg;
