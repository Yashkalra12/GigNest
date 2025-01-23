import React, { useState, useReducer, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import upload from "../utils/upload.jsx";
import { GigReducer, INITIAL_STATE } from "../Reducers/GigReducer.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useUserStore from "../Store/useUserStore";
import toast from "react-hot-toast";
import axios from "axios";
import Slide from "../Components/Slide.jsx";

const Addgigs = () => {
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

  const [state, dispatch] = useReducer(GigReducer, {
    ...INITIAL_STATE,
    userId: currentUser?._id,
  });

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const categories = [
    "Graphics & Design",
    "Programming & Tech",
    "Digital Marketing",
    "Video & Animation",
    "Writing & Translation",
    "Music & Audio",
    "Business",
    "Consulting",
    "AI Services",
    "Personal Growth",
  ];

  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  // Convert single file to URL
  const singleFileURL = singleFile ? URL.createObjectURL(singleFile) : "";

  // Convert multiple files to URLs
  const fileURLs =
    files.length > 0
      ? Array.from(files).map((file) => URL.createObjectURL(file))
      : [];

  const handleUpload = async () => {
    if (!singleFile || files.length === 0) {
      toast.error("Cover or images cannot be empty.");
      return;
    }

    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );

      setUploading(false);
      setUploaded(true);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      // toast.error("Failed to upload images");
      toast.error(err?.response?.data?.error?.message || "Failed to upload images");
      setUploading(false);
      setUploaded(false);
      console.log(err);
    }
  };

  const handleFeature = (e) => {
    e.preventDefault();
    const featureValue = e.target[0].value.trim(); // Trim to remove any leading or trailing spaces

    if (featureValue === "") {
      toast.error("Feature must not be empty.");
      return;
    }
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };


  const queryClient = useQueryClient();

  const {mutate} = useMutation({
    mutationFn: (gig) => {
      return axios.post(`${import.meta.env.VITE_BACKEND_URL}/gigs`, gig,{withCredentials:true});
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
    onError: (error) => {
      console.log(error)
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const allFieldsFilled = Object.values(state).every((value) => {
      if (Array.isArray(value)) {
        return value.length > 0; // Check if the array is not empty
      } else if (typeof value === 'string') {
        return value.trim() !== ''; // Check if the string is not empty
      } else if (typeof value === 'number') {
        return !isNaN(value) && value !== 0; // Check if the number is not NaN and not 0
      } else {
        return true; // Assume non-string and non-array fields are optional or correctly filled
      }
    });
    if (!allFieldsFilled) {
      toast.error("Please fill in all the details and upload images.");
      return;
    }
    mutate(state);
    toast.success("Gig Created Successfully");
    navigate("/mygigs");
  };

  return (
    <div className="max-w-[90%] mx-auto -mt-3 md:mt-10">
      <h1 className="font-bold text-4xl mb-10 text-blue-900 dark:text-white">Add New Gig</h1>

      <div className="flex flex-col lg:flex-row justify-evenly">
        {/* left */}
        <div className="lg:w-[40%] space-y-6">
          <TextField
            fullWidth
            name="title"
            label="Gig Title"
            variant="outlined"
            placeholder="i.e I will do something i am really good at"
            onChange={handleChange}
          />

          <Autocomplete
            disablePortal
            label="Category"
            options={categories}
            onChange={(e, value) => dispatch({ type: "SET_CATEGORY", payload:  value })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                name="category"
                placeholder="Search for a Category"

              />
            )}
          />

          <div className="border p-4 rounded-xl space-y-2">
            <p className="font-medium">Upload Cover Image</p>

            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setSingleFile(e.target.files[0])}
            />

            {singleFile && (
              <img src={singleFileURL} alt="Cover" className="w-40" />
            )}
          </div>

          <div className="border p-4 rounded-xl space-y-2">
            <p className="font-medium">Upload Gig Image (upload multiple)</p>
            <input
              type="file"
              accept="image/png, image/jpeg"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <Slide slidesToShow={1} arrowsScroll={1} >
              {fileURLs.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Gig ${index + 1}`}
                  className="w-44 h-auto"
                  />
                ))}
                </Slide>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading || uploaded}
            className={`rounded-xl bg-blue-800 text-white py-2 w-full ${
              uploading || uploaded ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : uploaded ? "Uploaded" : "Upload"}
          </button>

     
        </div>

        {/* right */}
        <div className="lg:w-[40%] mt-10 md:mt-0 space-y-6">
        <TextField
            multiline
            fullWidth
            label="Description"
            placeholder="Brief Description to describe your service to clients "
            rows={6}
            name="desc"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Short Title"
            variant="outlined"
            placeholder="Short Title"
            onChange={handleChange}
            name="shortTitle"
          />

          <TextField
            multiline
            fullWidth
            label="Short Description"
            placeholder="Brief Description to describe your service to clients"
            rows={3}
            onChange={handleChange}
            name="shortDesc"
          />

          <TextField
            fullWidth
            type="number"
            label="Delivery Time"
            variant="outlined"
            placeholder="Delivery Time (in Days)"
            onChange={handleChange}
            name="deliveryTime"
          />
          <TextField
            fullWidth
            type="number"
            label="revision Number"
            variant="outlined"
            placeholder="No. of times you can modify the work"
            onChange={handleChange}
            name="revision"
          />

          <form action="" onSubmit={handleFeature} className="flex">
            <TextField
              type="text"
              label="Features"
              placeholder="What you will provide"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-800 text-white md:py-4 px-1 md:px-3 mx-5 p"
            >
              Add More
            </button>
          </form>
          <div className="flex flex-wrap gap-5">
            {state?.features?.map((f) => (
              <div className="border border-blue-800 rounded-lg p-2" key={f}>
                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE_FEATURE", payload: f })
                  }
                >
                  {f}
                  <span className="ml-5 px-2 py-1  bg-red-600 rounded-full text-white">X</span>
                </button>
              </div>
            ))}
          </div>

          <TextField
            fullWidth
            type="number"
            label="Price"
            placeholder="Price in INR"
            onChange={handleChange}
            name="price"
          />

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-blue-900 hover:bg-blue-700 text-white py-4 w-full"
          >
            Create Gig
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addgigs;
