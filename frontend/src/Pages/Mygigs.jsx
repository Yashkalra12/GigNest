import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useUserStore from "../Store/useUserStore";
import Loader from "../Components/Loader";

const Mygigs = () => {

  const currentUser = useUserStore((state) => state.currentUser);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { isFetching, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/gigs?userId=${currentUser._id}`
        )
        .then((res) => res.data)
        .catch((error) => {
          console.log(error);
          throw error;
        }),
  });

  const { mutate } = useMutation({
    mutationFn: (id) => {
      return axios.delete(`${import.meta.env.VITE_BACKEND_URL}/gigs/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    mutate(id);
  };

  // console.log(data);

  return (
    <div className="w-[90%] mx-auto -mt-16 sm:mt-0">
      <div className="font-bold flex justify-between text-4xl my-10 text-blue-900 dark:text-white">
        <h1>My Gigs</h1>
        {data?.length>0 && <button className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl py-2 px-3 text-sm font-medium" onClick={()=>navigate("/addgigs")}>Create New Gig</button>}
      </div>
      {isFetching && <Loader/>}
      {!isFetching && data?.length === 0 && (
        <div className="font-bold text-3xl flex flex-col gap-5 text-center justify-center items-center h-[40vh] text-red-700">
          You don't have any gigs yet !
          <button className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl p-2"  onClick={()=>navigate("/addgigs")}>Create New Gig</button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!isFetching && data?.length>0 && data?.map((g) => (
          <div
            key={g._id}
            className=" shadow-md rounded-lg p-6 border border-gray-200 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-xl text-gray-800 dark:text-white flex flex-col justify-between"
          >
            <img
              src={g.cover}
              alt=""
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-900 dark:text-indigo-500 mb-2">
              {g.title}
            </h3>
            <p className="">
              <strong>Price:</strong> ₹ {g.price}
            </p>
            <p className="">
              <strong>Category:</strong> {g.category}
            </p>
            <p className="">
              <strong>Orders Done:</strong> {g.sales}
            </p>
            <div className="flex justify-between items-center mt-4">
              <Link
                to={`/gig/${g._id}`}
                className="bg-blue-900 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out hover:bg-blue-700"
              >
                View
              </Link>
              <Link
                to={`/editgig/${g._id}`}
                className="bg-green-700 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out hover:bg-green-600"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(g._id)}
                className="bg-red-900 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mygigs;
