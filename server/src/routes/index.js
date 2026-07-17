import { Router } from "express";
import classRoutes from "./classRoutes.js";
import waitlistRoutes from "./waitlistRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import dashboardRoutes from "./DashboardRoutes.js";

const router = Router();

router.use("/classes", classRoutes);
router.use("/waitlist", waitlistRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;