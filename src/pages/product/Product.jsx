import { useEffect, useState } from "react";
import BidHistory from "../../components/bidHistory/BidHistory";
import CarImg from "../../components/carImg/CarImg";
import Description from "../../components/description/Description";

import "./product.scss";
import { publicRequest } from "../../requestMethods";
import { useLocation } from "react-router-dom";

const Product = () => {
  const [auction, setAuction] = useState([]);
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  useEffect(() => {
    const getAuction = async () => {
      const res = await publicRequest(`/auction/${id}`);
      setAuction(res.data);
    };
    getAuction();
  }, [id]);
  return (
    <div className="product">
      <CarImg auction={auction} />
      <div className="info">
        <div className="name">{auction.title}</div>
        <div className="money">${auction.startingBid}</div>
      </div>
      <hr />
      <div className="container">
        <Description />
        <BidHistory data={auction} />
      </div>
    </div>
  );
};

export default Product;
