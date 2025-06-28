import Auction from "../auction/Auction";
import "./auctions.scss";

const Auctions = () => {
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
  ];
  return (
    <div className="auctions_component">
      {data.map((item) => (
        <Auction key={item.id} data={item} />
      ))}
    </div>
  );
};

export default Auctions;
