import { useEffect, useState } from "react";
import "./biddingHistory.scss";
import { useLocation } from "react-router-dom";
import { userRequest } from "../../requestMethods";
import moment from "moment";

const BiddingHistory = () => {
  const [auction, setAuction] = useState([]);
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  useEffect(() => {
    const getAuction = async () => {
      const res = await userRequest(`/bid/auction/${id}`);
      console.log(res.data);
      setAuction(res.data);
    };
    getAuction();
  }, [id]);
  return (
    <div className="bh">
      <div className="container">
        <div className="wrapper">
          <h4>Bid History</h4>
          <hr />

          {auction?.map((item) => (
            <>
              <div className="user">
                <div className="left">
                  <img src="" alt="" />
                  <div className="others">
                    <span className="name">{item.username}</span>
                    <span className="time_left">
                      {moment(item.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="right">
                  <span>{item.amount}</span>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiddingHistory;
