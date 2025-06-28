import "./latestAuctions.scss";
import LatestAuction from "../latestAuction/LatestAuction";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { publicRequest } from "../../requestMethods";

const LatestAuctions = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const getAuctions = async () => {
      const res = await publicRequest.get("/auction");
      setAuctions(res.data.content.content);
    };
    getAuctions();
  }, []);

  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };
  
  return (
    <div className="latestAuctions">
      <h1>Latest Auctions</h1>
      <div className="container">
        <Slider {...settings}>
          {auctions.map((item) => (
            <LatestAuction key={item.id} item={item} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default LatestAuctions;