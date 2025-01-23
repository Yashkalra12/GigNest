import React, { useState } from 'react';

const Footer = () => {
  const [accordion, setAccordion] = useState({
    categories: true,
    about: true,
    support: true,
    community: true,
    more: true,
  });
  return (
    <div>
      <hr className="my-10" />
      <div className="w-[90%] mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold cursor-pointer" onClick={() => setAccordion({ ...accordion, categories: !accordion.categories })}>Categories</h2>
            {accordion.categories && (
              <div className={`${!accordion.categories ? 'block' : 'hidden'} md:block`}>
                <p>Graphics & Design</p>
                <p>Digital Marketing</p>
                <p>Writing & Translation</p>
                <p>Video & Animation</p>
                <p>Music & Audio</p>
                <p>Programming & Tech</p>
                <p>Data</p>
                <p>Business</p>
                <p>Lifestyle</p>
                <p>Photography</p>
                <p>Sitemap</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold cursor-pointer" onClick={() => setAccordion({ ...accordion, about: !accordion.about })}>About</h2>
            {accordion.about && (
              <div className={`${!accordion.categories ? 'block' : 'hidden'} md:block`}>
                <p>Press & News</p>
                <p>Partnerships</p>
                <p>Privacy Policy</p>
                <p>Terms of Service</p>
                <p>Intellectual Property Claims</p>
                <p>Investor Relations</p>
                <p>Contact Sales</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold cursor-pointer" onClick={() => setAccordion({ ...accordion, support: !accordion.support })}>Support</h2>
            {accordion.support && (
              <div className={`${!accordion.categories ? 'block' : 'hidden'} md:block`}>
                <p>Help & Support</p>
                <p>Trust & Safety</p>
                <p>Selling on GigNest</p>
                <p>Buying on GigNest</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold cursor-pointer" onClick={() => setAccordion({ ...accordion, community: !accordion.community })}>Community</h2>
            {accordion.community && (
              <div className={`${!accordion.categories ? 'block' : 'hidden'} md:block`}>
                <p>Customer Success Stories</p>
                <p>Community hub</p>
                <p>Forum</p>
                <p>Events</p>
                <p>Blog</p>
                <p>Influencers</p>
                <p>Affiliates</p>
                <p>Podcast</p>
                <p>Invite a Friend</p>
                <p>Become a Seller</p>
                <p>Community Standards</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold cursor-pointer" onClick={() => setAccordion({ ...accordion, more: !accordion.more })}>Support</h2>
            {accordion.more && (
              <div className={`${!accordion.categories ? 'block' : 'hidden'} md:block`}>
                <p>GigNest Business</p>
                <p>GigNest Pro</p>
                <p>GigNest Logo Maker</p>
                <p>GigNest Guides</p>
                <p>Get Inspired</p>
                <p>GigNest Select</p>
                <p>ClearVoice</p>
                <p>GigNest Workspace</p>
                <p>Learn</p>
                <p>Working Not Working</p>
              </div>
            )}
          </div>
        </div>
        <hr className="mt-5" />
        <div className="pt-2 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 ">
            <h2 className="font-bold text-4xl text-gray-700">GigNest</h2>
            <p>© GigNest International Ltd. 2024</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-14 mt-4 md:mt-0">
            <div className="flex gap-5">
              <img src="/images/twitter.png" className="w-[30px] h-[30px]" alt="Twitter" />
              <img src="/images/facebook.png" className="w-[30px] h-[30px]" alt="Facebook" />
              <img src="/images/linkedin.png" className="w-[30px] h-[30px]" alt="LinkedIn" />
              <img src="/images/pinterest.png" className="w-[30px] h-[30px]" alt="Pinterest" />
              <img src="/images/instagram.png" className="w-[30px] h-[30px]" alt="Instagram" />
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/language.png" className="w-[30px] h-[30px]" alt="Language" />
              <p>English</p>
              <img src="/images/coin.png" className="w-[30px] h-[30px]" alt="Currency" />
              <p>USD</p>
            </div>
            <img src="/images/accessibility.png" className="border border-gray-400 rounded-full p-2 w-10" alt="Accessibility" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
