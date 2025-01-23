import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";

const GigCard = ({ item }) => {
  const { isFetching, error, data } = useQuery({
    queryKey: [`${item.userId}`],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/users/${item.userId}`)
        .then((res) => res.data)
        .catch((error) => {
          toast.error(error.message);
          throw error;
        }),
  });

  // useEffect(() => {
  //   // Example condition: Only log if data has more than 0 items
  //   if (data) {
  //     console.log("Data updated:", data);
  //   }
  //   if (error) {
  //     console.log("Error updated:", error);
  //   }
  // }, [data, error]);


  return (
    <div className="w-[320px] sm:w-[280px] my-5 mx-4 transition-transform duration-300 ease-in-out hover:scale-[102%] hover:shadow-2xl">
      <Link to={`/gig/${item._id}`}>
        <div className="shadow-lg border border-gray-300 rounded-lg p-1 rounded-b-lg h-full cursor-pointer flex flex-col">
        <img
            src={item.cover}
            className="object-cover h-[240px]  w-full"
            alt=""
          />
          {!isFetching && !error &&  (
             <div className="text-xs flex items-center gap-3 pt-2 px-3">
             <img src={data.img || "/images/noavatar.jpg"}  className='w-[40px] h-[40px] rounded-full' alt="" />
             <p>{data?.fullname}</p>
           </div>

          )}
         
          <div className="text-sm px-4 flex flex-col gap-3 justify-between mt-2 ">
            <p className="font-semibold text-[1.09rem]">{item.title.length>40 ? `${item.title.substr(0,40)}...` : item.title }</p>
            <p className="pb-2">{item.desc.length>50 ? `${item.desc.substr(0,50)}...` : item.desc } </p>
            <div className="flex justify-between">
              <div className="flex items-center justify-center gap-2">
              <img src="/images/star.png" className="w-5" alt="" />
              <p className="text-[#ffc108] py-1">{!isNaN(Math.round(item.totalStar/item.starNumber)) ? `${Math.round(item.totalStar/item.starNumber)} Stars`: ("No reviews")} </p>
              </div>
            <p className="font-semibold text-lg text-blue-900 dark:text-indigo-500">₹{item.price} INR</p>
            </div>
            <p className="text-xs text-right text-gray-500">Posted : {moment(item.updatedAt).fromNow()}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GigCard;
