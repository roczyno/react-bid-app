import { useEffect, useState } from "react";
import MyAuctions from "../../components/myAuctions/MyAuctions";
import "./myAuctionsPage.scss";
import { useSelector } from "react-redux";
import { userRequest } from "../../requestMethods";

const MyAuctionsPage = () => {
  // const dispatch = useDispatch();
  const auction = useSelector((state) => state.auction.auctions);
  const [data, setData] = useState(auction.results);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null); // Initialize with null for all auctions

  // useEffect(() => {
  //   getAuctions(dispatch);
  // }, [dispatch]);
  // Function to fetch auctions based on search term and status filter
  const fetchAuctions = async () => {
    try {
      const res = await userRequest.get(`/auction`, {
        params: {
          searchTerm: search,
          status: statusFilter, // Pass status filter as query parameter
        },
      });
      setData(res.data.content.content); // Assuming `content` contains auction data
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  // Fetch auctions initially and whenever search term or status filter changes
  useEffect(() => {
    fetchAuctions();
  }, [search, statusFilter]);

  return (
    <div className="my_auctions">
      <div className="container">
        <div className="filters">
          <span
            className={`filter ${statusFilter === null ? "active" : ""}`}
            onClick={() => setStatusFilter(null)}
          >
            All
          </span>
          <span
            className={`filter ${statusFilter === "ACTIVE" ? "active" : ""}`}
            onClick={() => setStatusFilter("ACTIVE")}
          >
            Active auctions
          </span>
          <span
            className={`filter ${statusFilter === "CLOSED" ? "active" : ""}`}
            onClick={() => setStatusFilter("CLOSED")}
          >
            Closed auctions
          </span>
        </div>
        <div className="search">
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <MyAuctions data={data} />
      </div>
    </div>
  );
};

export default MyAuctionsPage;
