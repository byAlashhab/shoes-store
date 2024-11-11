import { Router } from "express";
import { getAllAgents } from "../controller/agent.coontroller.js";

const router = Router();

router.get("/all", getAllAgents);

export default router;
