import express from "express";
import { nearByPlacesController } from "../controllers/nearByPlacesController.js";

const router = express.Router();

// Route to fetch nearby places
router.post("/nearby", nearByPlacesController);

export default router;
