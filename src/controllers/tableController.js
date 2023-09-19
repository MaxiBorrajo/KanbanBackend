//Imports
import tableManager from "../entities/TableManager.js";

import CustomError from "../utils/customError.js";

import { returnResponse } from "../utils/utilsFunctions.js";

async function createTable(req, res, next) {
  try {
    const createdTable = await tableManager.createTable({
      ...req.body,
      ...{ idUser: req.user._id },
    });

    if (!createdTable) {
      throw new CustomError("Table not created", 500);
    }

    return returnResponse(res, 201, createdTable, true);
  } catch (error) {
    next(error);
  }
}

async function getTables(req, res, next) {
  try {
    const foundTables = await tableManager.getTablesByIdUser(req.user._id);

    return returnResponse(res, 201, foundTables, true);
  } catch (error) {
    next(error);
  }
}

async function getTableById(req, res, next) {
  try {
    const foundTable = await tableManager.getTableByIdAndIdUser(
      req.params.id,
      req.user._id
    );

    if (!foundTable) {
      throw new CustomError("Table not found", 400);
    }

    return returnResponse(res, 200, foundTable, true);
  } catch (error) {
    next(error);
  }
}

async function updateTableById(req, res, next) {
  try {
    const foundTable = await tableManager.updateTableByIdAndIdUser(
      req.params.id,
      req.user._id,
      req.body
    );

    if (foundTable) {
      return returnResponse(
        res,
        200,
        { message: "Table updated successfully" },
        true
      );
    }
  } catch (error) {
    next(error);
  }
}

async function deleteTableById(req, res, next) {
  try {
    const deletedTable = await tableManager.deleteTableByIdAndIdUser(
      req.params.id,
      req.user._id
    );

    if (deletedTable) {
      return returnResponse(
        res,
        200,
        { message: "Table deleted successfully" },
        true
      );
    }
  } catch (error) {
    next(error);
  }
}

export {
  createTable,
  getTables,
  getTableById,
  updateTableById,
  deleteTableById,
};
