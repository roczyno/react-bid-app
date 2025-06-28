import { useEffect, useState } from "react";
import MyAuctions from "../../components/myAuctions/MyAuctions";
import "./myAuctionsPage.scss";
import { getUserAuctions } from "../../redux/apiCalls";
import { ToastContainer } from "react-toastify";

const MyAuctionsPage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      
      const response = await getUserAuctions(params);
      setData(response.auctions || []);
    } catch (error) {
      console.error("Error fetching user auctions:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [search, statusFilter]);

  return (
    <div className="my_auctions">
      <ToastContainer />
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
            className={`filter ${statusFilter === "ENDED" ? "active" : ""}`}
            onClick={() => setStatusFilter("ENDED")}
          >
            Ended auctions
          </span>
          <span
            className={`filter ${statusFilter === "CANCELLED" ? "active" : ""}`}
            onClick={() => setStatusFilter("CANCELLED")}
          >
            Cancelled auctions
          </span>
        </div>
        <div className="search">
          <input
            type="search"
            placeholder="Search your auctions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="loading">Loading your auctions...</div>
        ) : (
          <MyAuctions data={data} />
        )}
      </div>
    </div>
  );
};

export default MyAuctionsPage;