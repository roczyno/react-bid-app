import { useEffect, useState } from "react";
import BidHistory from "../../components/bidHistory/BidHistory";
import CarImg from "../../components/carImg/CarImg";
import Description from "../../components/description/Description";
import "./product.scss";
import { getAuction } from "../../redux/apiCalls";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Product = () => {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const auctionData = await getAuction(id);
        setAuction(auctionData);
      } catch (error) {
        console.error("Error fetching auction:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuction();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="product">
        <div className="loading">Loading auction details...</div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="product">
        <div className="error">Auction not found</div>
      </div>
    );
  }

  return (
    <div className="product">
      <ToastContainer />
      <CarImg auction={auction} />
      <div className="info">
        <div className="name">{auction.title}</div>
        <div className="money">${auction.currentPrice || auction.startingPrice}</div>
      </div>
      <hr />
      <div className="container">
        <Description auction={auction} />
        <BidHistory data={auction} />
      </div>
    </div>
  );
};

export default Product;