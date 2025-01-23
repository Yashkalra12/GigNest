import React from "react";
import { Link } from "react-router-dom";
import { BsGithub } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

function Footer() {
  return (
    <div className="dark:bg-[#1A1B1D] md:text-white pt-10">
      <div className="max-w-[100%] mx-auto py-5 bg-[#1A1B1D] text-white p-9 ">
        <div className="flex flex-col md:flex-row gap-3 justify-around">
          <div className="item">
            <h2 className="font-semibold">Categories</h2>
            <a href="#" className="hidden md:block">Graphics & Design</a>
            <a href="#" className="hidden md:block">Digital Marketing</a>
            <a href="#" className="hidden md:block">Writing & Translation</a>
            <a href="#" className="hidden md:block">Video & Animation</a>
            <a href="#" className="hidden md:block">Music & Audio</a>
            <a href="#" className="hidden md:block">Programming & Tech</a>
            <a href="#" className="hidden md:block">Data</a>
            <a href="#" className="hidden md:block">Business</a>
            <a href="#" className="hidden md:block">Lifestyle</a>
            <a href="#" className="hidden md:block">Photography</a>
            <a href="#" className="hidden md:block">Sitemap</a>
          </div>
          <hr className="block md:hidden" />
          <div className="item">
            <h2 className="font-semibold">About</h2>
            <a href="#" className="hidden md:block">Press & News</a>
            <a href="#" className="hidden md:block">Partnerships</a>
            <a href="#" className="hidden md:block">Privacy Policy</a>
            <a href="#" className="hidden md:block">Terms of Service</a>
            <a href="#" className="hidden md:block">Intellectual Property Claims</a>
            <a href="#" className="hidden md:block">Investor Relations</a>
            <a href="#" className="hidden md:block">Contact Sales</a>
          </div>
          <hr className="block md:hidden" />
          <div className="item">
            <h2 className="font-semibold">Support</h2>
            <a href="#" className="hidden md:block">Help & Support</a>
            <a href="#" className="hidden md:block">Trust & Safety</a>
            <a href="#" className="hidden md:block">Selling on GigNest</a>
            <a href="#" className="hidden md:block">Buying on GigNest</a>
          </div>
          <hr className="block md:hidden" />
          <div className="item">
            <h2 className="font-semibold">Community</h2>
            <a href="#" className="hidden md:block">Customer Success Stories</a>
            <a href="#" className="hidden md:block">Community hub</a>
            <a href="#" className="hidden md:block">Forum</a>
            <a href="#" className="hidden md:block">Events</a>
            <a href="#" className="hidden md:block">Blog</a>
            <a href="#" className="hidden md:block">Influencers</a>
            <a href="#" className="hidden md:block">Affiliates</a>
            <a href="#" className="hidden md:block">Podcast</a>
            <a href="#" className="hidden md:block">Invite a Friend</a>
            <a href="#" className="hidden md:block">Become a Seller</a>
            <a href="#" className="hidden md:block">Community Standards</a>
          </div>
          <hr className="block md:hidden" />
          <div className="item">
            <h2 className="font-semibold">More From GigNest</h2>
            <a href="#" className="hidden md:block">GigNest Business</a>
            <a href="#" className="hidden md:block">GigNest Pro</a>
            <a href="#" className="hidden md:block">GigNest Logo Maker</a>
            <a href="#" className="hidden md:block">GigNest Guides</a>
            <a href="#" className="hidden md:block">Get Inspired</a>
            <a href="#" className="hidden md:block">GigNest Select</a>
            <a href="#" className="hidden md:block">ClearVoice</a>
            <a href="#" className="hidden md:block">GigNest Workspace</a>
            <a href="#" className="hidden md:block">Learn</a>
            <a href="#" className="hidden md:block">Working Not Working</a>
          </div>
        </div>
        <div className="bottom">
          <hr className="mt-5" />
          <div className="pt-2 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col justify-between items-center gap-2 text-gray-500 ">
              <h2 className="font-bold text-3xl text-gray-300">GigNest.</h2>
              <a href="#" className="block text-sm">© GigNest Ltd. 2024</a>
            </div>
            <Link to="https://github.com/Yashkalra12">
              <p className="flex gap-2 items-center text-lg hover:text-gray-300 cursor-pointer">Developed by <BsGithub /> <span className="font-semibold"> Yash Kalra</span></p>
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-center gap-14 mt-4 md:mt-0">
              <div className="flex gap-8 items-center">
                <Link to="https://github.com/Yashkalra12"><BsGithub size={35} className="cursor-pointer" /></Link>
                <Link to="https://www.linkedin.com/in/yashkalra12/"><FaLinkedin size={35} className="cursor-pointer" /></Link>
                <Link to="https://leetcode.com/u/yashkalra12/"><SiLeetcode size={35} className="cursor-pointer" /></Link>

              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;