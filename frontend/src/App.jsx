import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Gigs from "./Pages/Gigs";
import Gig from "./Pages/Gig";
import Mygigs from "./Pages/Mygigs";
import Orders from "./Pages/Orders";
import Addgigs from "./Pages/Addgigs";
import Messages from "./Pages/Messages";
import Message from "./Pages/Message";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import axios from "axios";
import Loader from "./Components/Loader";
import toast from "react-hot-toast";
import PaymentSuccess from "./Pages/PaymentSuccess";
import Editgig from "./Pages/Editgig";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';



import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import useUserStore from "./Store/useUserStore";
import useDarkMode from "./Store/useDarkMode";

function App() {
  const login = useUserStore((state) => state.login);
  const userLoaded = useUserStore((state) => state.userLoaded);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/test`);
        if (response.status === 200) {
          useUserStore.setState({ userLoaded: true });
        } else {
          useUserStore.setState({ userLoaded: false });
          toast.error("Backend Server Not Responding");
        }
      } catch (error) {
        console.log(error);
        useUserStore.setState({ userLoaded: false });
        toast.error("Test API request failed");
      }
    };
  
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/fetchuser`, {
          withCredentials: true,
        });
        const user = response.data;
        login(user);
        useUserStore.setState({ userLoaded: true });
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchTestData();
    fetchUser();
  }, [login]);

  if (!userLoaded) {
    return (
      <div className="w-full h-[90vh] flex flex-col  justify-center items-center">
        <Loader />
        <p className="text-blue-800 text-lg">Loading Data from Backend Server</p>
      </div>
    );
  }

  const queryClient = new QueryClient();
  const Layout = () => {
    const dark = useDarkMode((state) => state.dark);
    
  const darkTheme = createTheme({
    palette: {
      mode: dark?'dark':'light',
      background: {
        default: dark ? '#1A1B1D' : '#ffffff', // Black for dark mode, white for light mode
        paper: dark ? '#000000' : '#ffffff', // Black for dark mode, white for light mode
      },
      text: {
        primary: dark ? '#ffffff' : '#000000', // White text for dark mode, black text for light mode
      },
    },
  });
    return (
      <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={darkTheme}>
          <CssBaseline />
        <div className={`${dark ? "dark" : ""} font-montserrat`}>
          <Navbar />

          <div className="pt-[5rem]">
            <Outlet />
            <Footer />
            <ReactQueryDevtools initialIsOpen={false} />
          </div>
        </div>
        </ThemeProvider>
      </QueryClientProvider>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/gigs", element: <Gigs /> },
        { path: "/gig/:id", element: <Gig /> },
        { path: "/orders", element: <Orders /> },
        { path: "/mygigs", element: <Mygigs /> },
        { path: "/addgigs", element: <Addgigs /> },
        { path: "/editgig/:id", element: <Editgig /> },
        { path: "/messages", element: <Messages /> },
        { path: "/message/:id", element: <Message /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/paymentsuccess", element: <PaymentSuccess /> },

      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
