import "./dashboard.scss";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 300, pv: 2400, amt: 2400 },
  { name: "Page C", uv: 200, pv: 2400, amt: 2400 },
  { name: "Page D", uv: 100, pv: 2400, amt: 2400 },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="left">
        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
      <div className="right"></div>
    </div>
  );
};

export default Dashboard;
