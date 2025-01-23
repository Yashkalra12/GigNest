import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import upload from "../utils/upload.jsx";

const Register = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    fullname: "",
    email: "",
    password: "",
    country: "",
    expertise: "",
    desc: "",
    isSeller: false,
    img: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};

    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

    if (!registerData.fullname) tempErrors.fullname = "Full name is required";
    if (!registerData.email) {
      tempErrors.email = "Email is required";
    } else if (!re.test(String(registerData.email).toLowerCase())) {
      tempErrors.email = "Invalid email format";
    }
    if (!registerData.password) tempErrors.password = "Password is required";

    if (registerData.isSeller) {
      if (!registerData.expertise)
        tempErrors.expertise = "Expertise is required";
      if (!registerData.desc)
        tempErrors.desc = "Description is required";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });

    // Check if the errors object has a key corresponding to the name of the input field
    // If it does, update the errors object to set the value for that key to an empty string
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // useEffect(()=>{
  //   console.log(registerData);
  // },[ registerData])

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    let imgUrl = null;
    if (image) {
      const toastId = toast.loading("Uploading Image...");
      try {
        imgUrl = await upload(image);
        toast.dismiss(toastId);
      } catch (error) {
        toast.error("Failed to upload image");
        console.error("Error uploading image:", error);
        return; // Stop the registration process if image upload fails
      }
    }

    const newregisterData = imgUrl
      ? { ...registerData, img: imgUrl }
      : registerData;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        newregisterData
      );
      // console.log('Response Data:', res.data);

      toast.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error.response.data.error);
    }
  };

  return (
    <div className="-mt-28 sm:mt-0">
      <div className="flex flex-col md:flex-row justify-evenly w-[90%] mt-16 mx-auto">
        <div className="flex flex-col items-center justify-center gap-5 md:min-w-[45%] ">
          <p className="font-bold text-2xl ">
            Create a new account
          </p>

          <div className="w-full md:w-[50%] mx-auto space-y-5">
            <TextField
              fullWidth
              required
              name="fullname"
              label="Full Name"
              value={registerData.fullname}
              onChange={handleInput}
              error={!!errors.fullname}
              helperText={errors.fullname}
            />
            <TextField
              fullWidth
              required
              name="email"
              label="Email"
              value={registerData.email}
              onChange={handleInput}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              fullWidth
              required
              name="password"
              label="Password"
              type="password"
              value={registerData.password}
              onChange={handleInput}
              error={!!errors.password}
              helperText={errors.password}
            />

            <p className="font-medium">Upload Profile Picture:</p>
            <div className="border border-slate-300 p-3 rounded">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
              />
              {image && (
                <img src={image} alt="Profile Preview" className="w-[19rem]" />
              )}
            </div>

            {/* <TextField fullWidth label="Country" /> */}
          </div>
        </div>

        <div className="space-y-5 md:mt-0 mt-16">
          <p className="font-bold text-2xl text-center">
            I want to become a Seller
          </p>

          <div className="space-y-8">
            <div className="flex items-center">
              <p>Activate the Seller Account</p>
              <Switch
                checked={registerData.isSeller}
                onChange={(e) => {
                  // setSeller(e.target.checked);
                  setRegisterData({
                    ...registerData,
                    isSeller: e.target.checked,
                  });
                }}
              />
            </div>

            <TextField
              fullWidth
              name="expertise"
              label="Expertise"
              type="text"
              placeholder="List all skills/exercises separated by commas"
              disabled={registerData.isSeller ? false : true}
              onChange={handleInput}
              error={!!errors.expertise}
              helperText={errors.expertise}
            />

            <TextField
              fullWidth
              name="desc"
              label="Description"
              placeholder="A short Description about Yourself"
              multiline
              rows={6}
              disabled={registerData.isSeller ? false : true}
              onChange={handleInput}
              error={!!errors.desc}
              helperText={errors.desc}
            />
          </div>
        </div>
      </div>

      <button
        className="w-[50%] md:w-[30%] mt-8 flex justify-center mx-auto bg-blue-900 py-3 text-white font-semibold rounded-lg"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
};

export default Register;
