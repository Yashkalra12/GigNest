import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaPrint, FaListAlt } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

const PaymentSuccess = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      // behavior: "smooth",
    });
  }, []);
  const location = useLocation();
  const navigate = useNavigate();
  const { payment, gig, dataUser } = location.state || {};

  console.log(location)

  const contentRef = useRef();

  const handleDownloadPdf = () => {
    const element = contentRef.current;
    const opt = {
      margin: [0.5, 1],
      filename: 'payment_receipt.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="md:mt-10  flex items-center justify-center p-4 -mt-20">
      <div className="bg-gradient-to-br from-green-50 to-green-100 shadow-2xl rounded-3xl p-8 w-full max-w-xl" ref={contentRef}>
        <div className='flex justify-center items-center gap-2 mb-2'>
          <img src="/images/GN_logo.png" className='w-12' alt="" />
          {/* <p className="text-xl sm:text-2xl font-bold ">GigNest.</p> */}
        </div>
        <div className="flex items-center justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-3xl md:text-5xl" />
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 ml-3">Payment Successful</h1>
        </div>

        {payment && gig && dataUser ? (
          <div>
            <div className="gig-details mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Gig Details</h2>
              <img src={gig.cover} alt={gig.title} className="w-full h-64 object-cover rounded-xl mb-4 shadow-md" />
              <h3 className="text-lg md:text-xl font-bold text-gray-800">{gig.title}</h3>
              <p className="text-gray-600 mt-2">{gig.shortDesc.substr(0, 100)}</p>
              <div className="flex flex-col md:flex-row justify-between md:items-center mt-4">
                <p className="text-gray-600 text-lg font-semibold"><span className="font-semibold">Amount Paid:</span> ₹{gig.price}</p>
                <p className="text-gray-600 text-lg font-semibold"><span className="font-semibold">Seller:</span> {dataUser?.fullname}</p>
              </div>
            </div>

            <div className="receipt bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Receipt</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-600"><span className="font-semibold">Payment ID:</span> {payment.paymentId}</p>
                <p className="text-gray-600"><span className="font-semibold">Order ID:</span> {payment.orderId}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center  gap-4">
              <button
                onClick={handleDownloadPdf}
                className="flex w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400  items-center justify-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                <FaPrint />
                <span>Download Receipt</span>
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="flex w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400  items-center justify-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                <FaListAlt />
                <span>My Orders</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-red-600 text-center text-2xl font-semibold my-5 ">No payment details available.
            <br />
            <p>I guess u arrived here by mistake</p></p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;