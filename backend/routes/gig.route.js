import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  getTopGigs,
  editGig
} from "../controllers/gig.controller.js";

const router = express.Router();

router.get("/topgigs", getTopGigs);
router.post("/", verifyToken, createGig);
router.put("/edit/:id", verifyToken, editGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);

export default router;
