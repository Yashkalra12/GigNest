import Razorpay from "razorpay";
import crypto from "crypto";
import {Payment} from "../models/payment.model.js";
import dotenv from "dotenv";
dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPayment = async (req, res) => {
    if(req.isSeller){
        return res.status(400).json({error:"Sellers cannot buy a gigs"})
    }
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


export const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
  
    const isAuthentic = expectedSignature === razorpay_signature;
  
    if (isAuthentic) {
  
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      res.status(200).json({
        success: true,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      });
  
    //   res.redirect(
    //     `${process.env.CLIENT_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    //   );
    } else {
      res.status(400).json({
        success: false,
      });
    }
  };
