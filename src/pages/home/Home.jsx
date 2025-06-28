import Header from "../../components/header/Header";
import Advert from "../../components/advert/Advert";
import "./home.scss";
import LatestAuctions from "../../components/latestAuctions/LatestAuctions";
import EndingAuctions from "../../components/endingAuctions/EndingAuctions";
import Contact from "../../components/contact/Contact";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <Advert />
      <LatestAuctions />
      <EndingAuctions />
      <Contact />
    </div>
  );
};

export default Home;
