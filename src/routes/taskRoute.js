//Imports
import express from "express";

import {
  bodyMustContain,
  bodyMustNotContain,
} from "../middlewares/validateFieldsMiddlewares.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

import {
  createTask,
  getTaskByIdAndIdTable,
  getTasksByStatusAndIdTable,
  getCountTasksByStatusAndIdTable,
  updateTaskByIdAndIdTable,
  deleteTaskByIdAndIdTable,
  deleteTasksByStatusAndIdTable,
} from "../controllers/taskController.js";

router.post(
  "/",
  authMiddleware,
  bodyMustNotContain(["_id", "idUser"]),
  bodyMustContain(["title", "order", "status", "idTable"]),
  createTask
);

router.get("/:id/tables/:idTable", authMiddleware, getTaskByIdAndIdTable);

router.get(
  "/status/:value/tables/:id",
  authMiddleware,
  getTasksByStatusAndIdTable
);

router.get(
  "/count/status/:value/tables/:id",
  authMiddleware,
  getCountTasksByStatusAndIdTable
);

router.put(
  "/:id/tables/:idTable",
  authMiddleware,
  bodyMustNotContain(["_id", "idUser", "idTable"]),
  updateTaskByIdAndIdTable
);

router.delete("/:id/tables/:idTable", authMiddleware, deleteTaskByIdAndIdTable);

router.delete(
  "/status/:value/tables/:id",
  authMiddleware,
  deleteTasksByStatusAndIdTable
);

export default router;
