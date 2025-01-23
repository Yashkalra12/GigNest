import React, { useState, useEffect } from "react";
import Review from "./Review";
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import toast from "react-hot-toast";
import useDarkMode from "../Store/useDarkMode";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient()
  const { isPending, error, data ,refetch} = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/reviews/${gigId}`)
        .then((res) => res.data)
        .catch((error) => {
          if (error.response.data.error) toast.error(error.response.data.error);
          console.log(error);
          throw error;
        }),
  });

  // useEffect(() => {
  //   // Example condition: Only log if data has more than 0 items
  //   if (data) {
  //     console.log("reviews:", data);
  //   }
  //   if (error) {
  //     console.log("Error updated:", error);
  //   }
  // }, [data, error]);

  const [reviewData, setReviewData] = useState({
    desc: "",
    star: 0,
    gigId: gigId,
  });

  // useEffect(() => {
  //   console.log(reviewData);
  // }, [reviewData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewData.desc.trim() || reviewData.star <= 0) {
      // Display an error message to the user
      toast.error("Please provide a review and a star rating.");
      return
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reviews`,reviewData,{withCredentials:true});
        refetch()
      // console.log(res);
      toast.success("Review Submitted");

      setReviewData({ desc: "", star: 0, gigId: gigId });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Please login to submit review");
    }
  };

  const dark=useDarkMode((state)=>state.dark);


  // alternate useMutation

  // const {mutate} = useMutation({
  //   mutationFn: (review) => {
  //     return axios.post(`${import.meta.env.VITE_BACKEND_URL}/reviews`, review,{withCredentials:true});
  //   },
  //   onSuccess:()=>{
  //     queryClient.invalidateQueries(["reviews"])
  //     toast.success("Review Submitted");
  //     setReviewData({ desc: "", star: 0, gigId: gigId }); 
  //   }
  // });

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   mutate(reviewData);
  // };


  return (
    <div>
      <h1 className="text-2xl font-bold my-8">Reviews</h1>

      <div className="my-8 flex flex-col md:flex-row justify-center items-center gap-3 md:gap-8">
      <TextField
     sx={{
      width: "80%",
    }}
  multiline
  fullWidth
  label="Write a Review"
  type="text"
  placeholder="Write a Review"
  value={reviewData.desc}
  onChange={(e) => {
    setReviewData({ ...reviewData, desc: e.target.value });
  }}
/>

        <div>
          <p>Give Rating</p>
          <Rating
            name="simple-controlled"
            value={reviewData.star}
            onChange={(event, newValue) => {
              setReviewData({ ...reviewData, star: newValue });
            }}
          />
        </div>
        <button className="px-4 py-2 bg-blue-900 text-white rounded-lg" onClick={handleSubmit}>
          Submit Review
        </button>
      </div>

      {!isPending && (
        <div className="space-y-10">
          {data.map((review, index) => (
            <Review review={review} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
