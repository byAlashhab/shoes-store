import { Router } from "express";

import {
  deleteShoes,
  getAllShoes,
  getShoesById,
  insertShoes,
  updateShoesById,
} from "../controller/shoes.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router
  .get("/all", getAllShoes)
  .get("/:id", getShoesById)
  .post("/:id", updateShoesById)
  .post("/", isAdmin, insertShoes)
  .delete("/:id", isAdmin, deleteShoes);

export default router;
