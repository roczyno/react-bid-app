import Auction from "../../components/auctions/Auctions";
import "./auctions.scss";

const Auctions = () => {
  return (
    <div className="auctions">
      <div className="container">
        <div className="left">
          <Auction />
        </div>
      </div>
    </div>
  );
};

export default Auctions;
