import express from "express"
import { verifyToken } from "../middleware/jwt.js"
import { createPayment,paymentVerification } from "../controllers/payment.controller.js"

const router=express.Router()

router.post("/checkout",verifyToken,createPayment);
router.post("/verify-payment", paymentVerification);


export default router