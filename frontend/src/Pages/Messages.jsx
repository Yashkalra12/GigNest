import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link ,useNavigate} from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { toast } from "react-hot-toast";
import useUserStore from "../Store/useUserStore";
import Loader from "../Components/Loader";

const Messaages = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentUser) {
        toast.error("Please login to access that page");
        navigate("/");
      }
    }, 1000); 

    return () => clearTimeout(timer);
  }, [currentUser]);

  const queryClient = useQueryClient();

  const { isFetching, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/conversations`, {
          withCredentials: true,
        })
        .then((res) => res.data)
        .catch((error) => {
          toast.error(error.message);
          throw error;
        }),
  });

  const { mutate } = useMutation({
    mutationFn: (id) => {
      return axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/conversations/${id}`,
        {},
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleRead = (id) => {
    mutate(id);
  };

  return (
    <div className="-mt-16 sm:mt-0">
      {isFetching ? (
        <Loader/>
      ) : error ? (
        "error"
      ) : (
        <div className="w-[95%] md:w-[90%] mx-auto ">
          <div className="font-bold text-4xl my-10 text-blue-900 dark:text-white">
            <h1>Messages</h1>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="w-full max-w-4xl ">
              {data.length === 0 && (
                <div className="font-bold text-3xl flex flex-col gap-5 text-center justify-center items-center h-[40vh] text-red-700">You Dont have any Messages yet</div>
              )}
              {data.length>0 && data.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-co items-center justify-between p-4 mb-4 border rounded-lg shadow-xl"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <img
                        className="w-12 h-12 rounded-full"
                        src={(currentUser.isSeller ? c?.buyerData.img : c.sellerData.img ) || "/images/noavatar.jpg"}
                        alt="Profile"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-lg ">
                        {currentUser.isSeller ? c?.buyerName : c.sellerName}
                      </div>
                      <div>{c?.lastMessage?.substring(0, 10)}...</div>
                      <div className="text-sm text-gray-500">
                        {moment(c.updatedAt).fromNow()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {(currentUser.isSeller && !c.readBySeller) ||
                    (!currentUser.isSeller && !c.readByBuyer) ? (
                      <button
                        onClick={() => handleRead(c.id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm sm:text-base whitespace-nowrap"
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <Link
                        to={{
                          pathname: `/message/${c.id}`,
                        }}
                        className="inline-block bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm sm:text-base whitespace-nowrap"
                      >
                        Open Chat
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default Messaages;
