import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./slide.css"

import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

const Slide = ({ children, slidesToShow }) => {
  return (
    <div className="slide-container" >
        
      <Swiper
        navigation={true}
        cssMode={true}
        pagination={{ clickable: true }}
        mousewheel={true}
        keyboard={true}
        loop={true}
        slidesPerView={slidesToShow}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        className="mySwiper "
      >
        
        {children.map((child, index) => (
          <SwiperSlide key={index} className="py-10 flex gap-5">
            <div className="mx-auto">
            {child}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slide;
