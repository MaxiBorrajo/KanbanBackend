//Imports

import express from "express";

import {
  bodyMustContain,
  bodyMustNotContain,
} from "../middlewares/validateFieldsMiddlewares.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

import {
  createTable,
  getTables,
  getTableById,
  updateTableById,
  deleteTableById,
} from "../controllers/tableController.js";

//Routes

router.post("/", authMiddleware, bodyMustContain(["tableName"]), createTable);

router.get("/", authMiddleware, getTables);

router.get("/:id", authMiddleware, getTableById);

router.put(
  "/:id",
  authMiddleware,
  bodyMustNotContain(["_id", "idUser"]),
  updateTableById
);

router.delete("/:id", authMiddleware, deleteTableById);



export default router;
