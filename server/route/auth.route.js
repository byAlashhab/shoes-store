import { Router } from "express";
import {
  register,
  login,
  logout,
  registerAgent,
  loginAgent,
} from "../controller/auth.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router
  .post("/register", register)
  .post("/register/agent", isAuthenticated, isAdmin, registerAgent)
  .post("/login", login)
  .post("/login/agent", loginAgent)
  .get("/logout", logout)
  .get("/status", isAuthenticated, (req, res) => {
    return res.sendStatus(200);
  });

export default router;
