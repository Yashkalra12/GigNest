import React, { useState, useEffect } from "react";
import Slide from "../Components/Slide";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import Loader from "../Components/Loader";
import Reviews from "../Components/Reviews";
import useUserStore from "../Store/useUserStore";
import moment from "moment";
import { RxCheck } from "react-icons/rx";

const Gig = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      // behavior: "smooth",
    });
  }, []);

  const param = useParams();
  const gigId = param.id;
  const currentUser = useUserStore((state) => state.currentUser);

  const { isFetching, error, data } = useQuery({
    queryKey: ["gig", gigId],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/gigs/single/${gigId}`)
        .then((res) => res.data)
        .catch((error) => {
          toast.error(`Something went wrong : ${error.message}`);
          console.log(error.message);
          throw error;
        }),
  });

  const {
    isFetching: isFetchingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", data?.userId],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/users/${data.userId}`)
        .then((res) => res.data)
        .catch((errorUser) => {
          toast.error(errorUser.message);
          console.log("dss", errorUser.message);
          throw errorUser;
        }),
  });

  const handleOrder = (orderId) => {
    if (currentUser === null) {
      toast.error("Please Login to place order");
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${gigId}`,
        { buyerName: currentUser.fullname, sellerName: dataUser.fullname, orderId },
        { withCredentials: true }
      )
      .then((res) => res.data)
      .then(() => toast.success("Order Placed Successfully"))
      // .then(() => navigate("/orders"))
      .catch((error) => {
        toast.error(error?.response?.data?.error || error.message);
      });
  };


  const checkoutHandler = async () => {
    if (currentUser === null) {
      toast.error("Please Login to place order");
      return;
    }

    try {
      const key = import.meta.env.VITE_RAZORPAY_API_KEY;
      // create order 
      const { data: payment } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/checkout`, { amount: data.price }, { withCredentials: true });

      const options = {
        key: key,
        amount: Number(payment.order.amount),
        currency: "INR",
        name: "GigNest",
        description: "Payment using RazorPay",
        // image: "https://raw.githubusercontent.com/KaranKumar-97/GigNest/main/frontend/public/images/GN_logo.png",
        order_id: payment.order.id,
        callback_url: `${import.meta.env.VITE_BACKEND_URL}/payment/verify-payment`,
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          "color": "#1e3a8a"
        },
        handler: async (response) => {
          try {
            const { data: res } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/verify-payment`, response, { withCredentials: true });
            if (res.success) {
              console.log(res)
              handleOrder(res.orderId);
              navigate(`/paymentsuccess?reference=${res.paymentId}`, { state: { payment: res, gig: data, dataUser } });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Error during payment verification:", error);
            toast.error("Payment verification failed");
          }
        }
      }


      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };


  return (
    <div className="dark:bg-[#1A1B1D] dark:text-white">

      <div className="w-[90%] mx-auto flex gap-6">
        {isFetching && (
          <div className=" w-full h-[80vh] flex justify-center items-center">
            <Loader />
          </div>
        )}

        {error && (
          <div className="w-full h-[80vh] flex flex-col gap-6 justify-center items-center">
            <p className="text-blue-900 text-4xl font-bold">
              Oops! Soemthing Went Wrong
            </p>
            <p className="text-red-600 text-4xl font-bold">{error.message}</p>
            <button
              className="px-6 py-4 bg-blue-900 text-white rounded-lg"
              onClick={() => navigate("/")}
            >
              Take me to Home Page
            </button>
          </div>
        )}

        {!isFetching && !error && (
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* left */}
            <div className="md:mt-10 mb-8 space-y-3 w-[90vw] md:w-[58vw]">
              <p className="flex gap-2">
                <img src="/images/home.svg" alt="" /> {"/  "}GigNest {">"}{" "}
                {data.category}
              </p>

              <h1 className="font-bold text-2xl">{data.title}</h1>

              {isFetchingUser && (
                <>
                  <p className="py-5">Loading user Info...</p>
                </>
              )}

              {!isFetchingUser && (
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">

                    <img
                      src={dataUser.img || "/images/noavatar.jpg"}
                      className="w-[50px] h-[50px] border-2 object-cover rounded-full"
                      alt=""
                    />
                    <p>{dataUser.fullname}</p>
                    {!isNaN(Math.round(data.totalStar / data.starNumber)) && (
                      <>
                        <div className="flex gap-1">
                          {Array(Math.round(data.totalStar / data.starNumber))
                            .fill()
                            .map((_, index) => (
                              <img
                                key={index}
                                src="/images/star.png"
                                className="w-[15px]"
                                alt=""
                              />
                            ))}
                        </div>
                        <p className="text-[#ffc108]">
                          {Math.round(data.totalStar / data.starNumber)} Stars
                        </p>
                      </>
                    )}
                  </div>

                  {data.userId === currentUser?._id && <Link to={`/editgig/${data?._id}`} className="py-2 px-4 bg-blue-900 text-white rounded-lg">
                    Edit Gig
                  </Link>}
                </div>
              )}

              <div className="border p-2  rounded-xl">
                <Slide slidesToShow={1} arrowsScroll={1}>
                  {data.images.map((img, index) => (
                    <div className="flex items-center h-full" key={index}>
                      <img
                        className="object-contain mx-auto md:h-[500px]"
                        src={img}
                        alt=""
                      />
                    </div>
                  ))}
                </Slide>
              </div>

              <div className="w-[90vw] md:w-[30vw] border border-gray-400 rounded-lg p-6 h-auto mt-10  block md:hidden">
                <div className="flex justify-between text-xl mb-5">
                  <p className="font-semibold">{data.shortTitle}</p>
                  <p>₹{data.price} INR</p>
                </div>
                <p>{data.shortDesc}</p>
                <div className="flex justify-between my-5">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/clock.png"
                      className="w-[20px] h-[20px]"
                      alt=""
                    />
                    <span>{data.deliveryTime} Days Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/recycle.png"
                      className="w-[20px] h-[20px]"
                      alt=""
                    />
                    <span>{data.revision} Revisions</span>
                  </div>
                </div>

                {data.features.length > 0 &&
                  data.features?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <RxCheck size={25} className="text-blue-900" />

                      <p>{item}</p>
                    </div>
                  ))}

                <button
                  className="w-full py-3 bg-blue-900 rounded-lg mt-8 text-white font-semibold"
                  onClick={checkoutHandler}
                >
                  Request to Order
                </button>
              </div>

              <div className="">
                <h1 className="text-2xl font-semibold">About this Gig</h1>
                <p>{data.desc}</p>
              </div>

              <div>
                {data.features.length > 0 && (
                  <>
                    <p className="text-2xl font-semibold">Features</p>

                    {data.features?.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <li>{item}</li>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {!isFetchingUser && !errorUser && (
                <div>
                  <h1 className="text-2xl font-bold my-8">About the Seller</h1>

                  <div className="border border-gray-400 rounded-lg p-6 my-10">
                    <div className="flex items-center gap-8">
                      <img
                        src={dataUser.img || `/images/noavatar.jpg`}
                        className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] border-2 object-cover rounded-full"
                        alt=""
                      />
                      <div className="flex flex-col lg:flex-row justify-between lg:w-full gap-4 lg:items-center">
                        <div className="space-y-4">
                          <p className="text-xl font-semibold">
                            {dataUser.fullname}
                          </p>

                          <div className="flex gap-1">
                            {!isNaN(
                              Math.round(data.totalStar / data.starNumber)
                            ) && (
                                <>
                                  <div className="flex gap-1">
                                    {Array(
                                      Math.round(data.totalStar / data.starNumber)
                                    )
                                      .fill()
                                      .map((_, index) => (
                                        <img
                                          key={index}
                                          src="/images/star.png"
                                          className="w-[15px]"
                                          alt=""
                                        />
                                      ))}
                                  </div>
                                </>
                              )}
                          </div>
                        </div>

                        <button
                          className="px-4 py-2 border border-gray-800 rounded-lg"
                          onClick={() => toast.error("will be available soon")}
                        >
                          Contact me
                        </button>
                      </div>
                    </div>
                    <hr className="mt-5" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 my-2 gap-2 text-left">
                      <div className="flex  items-center gap-3">
                        <p className="title">Member since :</p>
                        <p className="font-semibold">
                          {moment(dataUser.createdAt).format("LL")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="whitespace-nowrap">Total Orders Done:</p>
                        <p className="font-semibold">{dataUser?.orders || 0}</p>
                      </div>
                      <div className="flex md:items-center gap-3">
                        <p className="whitespace-nowrap">Expertise : </p>
                        <p className="font-semibold">{dataUser.expertise}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p>contact : </p>
                        <p className="font-semibold">{dataUser.email}</p>
                      </div>
                    </div>
                    <hr className="my-2" />
                    <p>{dataUser.desc}</p>
                  </div>
                </div>
              )}

              <Reviews gigId={gigId} />
            </div>

            {/* right */}
            <div className="w-[90vw] md:w-[30vw] border border-gray-400 rounded-lg p-6 h-auto mt-10 sticky top-[10rem] hidden md:block">
              <div className="flex justify-between text-xl mb-5">
                <p className="font-semibold">{data.shortTitle}</p>
                <p className="whitespace-nowrap">₹{data.price} INR</p>
              </div>
              <p>{data.shortDesc}</p>
              <div className="flex justify-between my-5">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/clock.png"
                    className="w-[20px] h-[20px] dark:invert"
                    alt=""
                  />
                  <span>{data.deliveryTime} Days Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/images/recycle.png"
                    className="w-[20px] h-[20px] dark:invert"
                    alt=""
                  />
                  <span>{data.revision} Revisions</span>
                </div>
              </div>

              {data.features.length > 0 &&
                data.features?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <RxCheck size={25} className="text-blue-900" />

                    <p>{item}</p>
                  </div>
                ))}

              <button
                className="w-full py-3 bg-blue-900 rounded-lg mt-8 text-white font-semibold"
                onClick={checkoutHandler}
              >
                Request to Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default Gig;
