/* eslint-disable react/prop-types */
import "./myAuctions.scss";
import MyAuction from "../myAuction/MyAuction";

const MyAuctions = ({ data }) => {
  return (
    <div className="myAuctions">
      {data?.map((item) => (
        <MyAuction key={item.id} data={item} />
      ))}
    </div>
  );
};

export default MyAuctions;
