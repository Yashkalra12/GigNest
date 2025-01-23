import React from "react";
import { Link } from "react-router-dom";

const Catcard = ({ item }) => {
  return (
    <div className="w-64 h-64">
      <Link to="/gigs?category=">
        <div className="relative mx-5 h-full cursor-pointer">
          <img
            src={item.img}
            className="w-full h-full object-cover rounded-md "
          />
          <div className="absolute top-5 left-3 font-medium text-white">
            <p>{item.desc}</p>
            <p className="font-bold">{item.title}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Catcard;
