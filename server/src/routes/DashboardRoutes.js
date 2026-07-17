import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController.js";

const router = Router();
const controller = new DashboardController();

router.get("/stats", controller.getStats.bind(controller));

export default router;