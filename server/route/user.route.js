import { Router } from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  getUserByEmail,
  updateUser,
  getAllUsers,
  getAnalytics
} from "../controller/user.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router
  .get("/all", isAdmin, getAllUsers)
  .get("/info", getUserByEmail)
  .get("/analytics", getAnalytics)
  .post("/info", updateUser);

export default router;
