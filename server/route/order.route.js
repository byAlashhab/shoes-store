import { Router } from "express";
import {
  confirmOrder,
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getAnalytics,
  getUserOrders,
  verifyOrder,
} from "../controller/order.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAgent } from "../middleware/isAgent.js";

const router = Router();

router
  .get("/my-orders", isAuthenticated, getUserOrders)
  .get("/all", isAuthenticated, isAdmin, getAllOrders)
  .get("/confirm-order/:id", isAuthenticated, confirmOrder)
  .get("/analytics", isAuthenticated, isAdmin, getAnalytics)
  .post("/", isAuthenticated, createNewOrder)
  .post("/verify-order", isAuthenticated, isAgent, verifyOrder) //logged in allowed is delivery agent
  .delete("/:id", isAuthenticated, deleteOrder);

export default router;
