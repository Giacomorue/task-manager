import express from "express";
import {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  updateOrder,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", getTasks);

router.post("/create", createTask);

router.delete("/delete/:id", deleteTask);

router.put("/update/:id", updateTask);

router.put("/update-order", updateOrder);

export default router;
