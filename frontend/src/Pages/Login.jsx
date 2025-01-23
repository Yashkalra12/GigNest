import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import useUserStore from "../Store/useUserStore";

const Login = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);
    const navigate=useNavigate()
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const login = useUserStore((state)=>state.login)
  const currentUser = useUserStore((state)=>state.currentUser)


  const handleLogin = async () => {
    let hasError = false;

    if (!loginData.email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(loginData.email)) {
      setEmailError("Invalid email format");
      hasError = true;
    }
  
    if (!loginData.password) {
      setPasswordError("Password is required");
      hasError = true;
    }
  
    if (hasError) {
      return;
    }

   try {
    const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, loginData,{withCredentials:true})
    const user=res.data

    login(user)

    toast.success("Logged in successfully")
    setTimeout(() => {
        navigate("/");
      }, 1400);
     
   } catch (err) {
    toast.error(err?.response?.data?.error ||err.message)
    // console.log(err.message)
   }
  
  }


  return (
    <div>
        <Toaster />
      <div className="flex flex-col justify-center items-center -mt-32 sm:mt-0 ">
        <p className="text-3xl font-bold text-center text-blue-900 dark:text-white mt-20">
          SIGN IN
        </p>

        <div className="flex flex-col justify-center items-center gap-5 mt-10 md:w-[25%]">
          <TextField
            fullWidth
            label="Email"
            placeholder="Enter your Email"
            variant="outlined"
            onChange={(e) => {
                setLoginData({ ...loginData, email: e.target.value })
                setEmailError("")
            }}
            value={loginData.email}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            fullWidth
            label="Password"
            placeholder="Enter your Password"
            type="password"
            variant="outlined"
            onChange={(e) => {
                setLoginData({ ...loginData, password: e.target.value })
                setPasswordError("")
            }}
            value={loginData.password}
            error={!!passwordError}
            helperText={passwordError}
          />

          <button className="bg-blue-900 w-full py-4 mt-5 rounded-xl text-white font-semibold"
          onClick={handleLogin}>
            Sign In
          </button>
        </div>
            <div className="flex flex-wrap justify-center gap-2 my-5">

          <p>Don't have an account?</p><button className="font-semibold" onClick={()=>navigate("/register")}>Click here to Sign Up</button>
            </div>
      </div>
    </div>
  );
};

export default Login;
