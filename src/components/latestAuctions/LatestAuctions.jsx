import "./latestAuctions.scss";
import LatestAuction from "../latestAuction/LatestAuction";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { getAuctions } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

const LatestAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await getAuctions(dispatch, { 
          page: 1, 
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        setAuctions(response.auctions || []);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [dispatch]);

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

  if (loading) {
    return (
      <div className="latestAuctions">
        <h1>Latest Auctions</h1>
        <div className="loading">Loading auctions...</div>
      </div>
    );
  }
  
  return (
    <div className="latestAuctions">
      <h1>Latest Auctions</h1>
      <div className="container">
        {auctions.length > 0 ? (
          <Slider {...settings}>
            {auctions.map((item) => (
              <LatestAuction key={item.id} item={item} />
            ))}
          </Slider>
        ) : (
          <div className="no-auctions">No auctions available at the moment.</div>
        )}
      </div>
    </div>
  );
};

export default LatestAuctions;