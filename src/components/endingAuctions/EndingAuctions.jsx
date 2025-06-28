import "./endingAuctions.scss";
import EndingAuction from "../endingAuction/EndingAuction";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EndingAuctions = () => {
  const data = [
    {
      id: 1,
      title: "2023 Subara Forester Premium Plus",
      distanceCv: "11475 miles",
      modelColor: "white",
      transmission: "AWD",
      engineType: "4-Cylinder-Turbo",
      timeLeft: "10d 12hrs",
      activeBids: 18,
      currentBid: "14000",
    },
    {
      id: 2,
      title: "2023 Subara Forester Premium Plus",
      distanceCv: "11475 miles",
      modelColor: "white",
      transmission: "AWD",
      engineType: "4-Cylinder-Turbo",
      timeLeft: "10d 12hrs",
      activeBids: 18,
      currentBid: "14000",
    },
    {
      id: 3,
      title: "2023 Subara Forester Premium Plus",
      distanceCv: "11475 miles",
      modelColor: "white",
      transmission: "AWD",
      engineType: "4-Cylinder-Turbo",
      timeLeft: "10d 12hrs",
      activeBids: 18,
      currentBid: "14000",
    },
    {
      id: 4,
      title: "2023 Subara Forester Premium Plus",
      distanceCv: "11475 miles",
      modelColor: "white",
      transmission: "AWD",
      engineType: "4-Cylinder-Turbo",
      timeLeft: "10d 12hrs",
      activeBids: 18,
      currentBid: "14000",
    },
    {
      id: 5,
      title: "2023 Subara Forester Premium Plus",
      distanceCv: "11475 miles",
      modelColor: "white",
      transmission: "AWD",
      engineType: "4-Cylinder-Turbo",
      timeLeft: "10d 12hrs",
      activeBids: 18,
      currentBid: "14000",
    },
    {
      id: 6,
      title: "2023 Subara Forester Premium Plus",
      distanceCv: "11475 miles",
      modelColor: "white",
      transmission: "AWD",
      engineType: "4-Cylinder-Turbo",
      timeLeft: "10d 12hrs",
      activeBids: 18,
      currentBid: "14000",
    },
    {
      id: 7,
      title: "2023 Subara Forester Premium Plus",
      distanceCv: "11475 miles",
      modelColor: "white",
      transmission: "AWD",
      engineType: "4-Cylinder-Turbo",
      timeLeft: "10d 12hrs",
      activeBids: 18,
      currentBid: "14000",
    },
  ];

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
    <div className="endingAuctions">
      <h1>Ending Soon Auctions</h1>
      <div className="container">
        <Slider {...settings}>
          {data.map((item) => (
            <EndingAuction key={item.id} item={item} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default EndingAuctions;