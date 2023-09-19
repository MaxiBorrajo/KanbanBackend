import taskManager from "../entities/TaskManager.js";

import CustomError from "../utils/customError.js";

import { returnResponse } from "../utils/utilsFunctions.js";

async function createTask(req, res, next) {
  try {
    const task = { ...req.body, ...{ idUser: req.user._id } };

    const createdTask = await taskManager.createTask(task);

    if (!createdTask) {
      throw new CustomError("Task not created", 500);
    }

    return returnResponse(res, 201, createdTask, true);
  } catch (error) {
    next(error);
  }
}

async function getTaskByIdAndIdTable(req, res, next) {
  try {
    const foundTask = await taskManager.getTaskByIdAndIdTableAndIdUser(
      req.params.id,
      req.params.idTable,
      req.user._id
    );

    if (!foundTask) {
      throw new CustomError("Task not found", 400);
    }

    return returnResponse(res, 200, foundTask, true);
  } catch (error) {
    next(error);
  }
}

async function getTasksByStatusAndIdTable(req, res, next) {
  try {
    const foundTasks = await taskManager.getTasksByIdUserAndIdTableAndStatus(
      req.params.id,
      req.user._id,
      req.params.value
    );

    return returnResponse(res, 200, foundTasks, true);
  } catch (error) {
    next(error);
  }
}

async function getCountTasksByStatusAndIdTable(req, res, next) {
  try {
    const count = await taskManager.countTasksByStatusAndIdTableAndIdUser(
      req.params.value,
      req.params.id,
      req.user._id
    );

    return returnResponse(res, 200, count, true);
  } catch (error) {
    next(error);
  }
}

async function updateTaskByIdAndIdTable(req, res, next) {
  try {
    const updatedTask = await taskManager.updateTaskByIdAndIdTableAndIdUser(
      req.params.id,
      req.params.idTable,
      req.user._id,
      req.body
    );

    if (updatedTask) {
      return returnResponse(
        res,
        200,
        { message: "Task updated successfully" },
        true
      );
    }
  } catch (error) {
    next(error);
  }
}

async function deleteTaskByIdAndIdTable(req, res, next) {
  try {
    const deletedTask = await taskManager.deleteTaskByIdAndIdTableAndIdUser(
      req.params.id,
      req.params.idTable,
      req.user._id
    );

    if (deletedTask) {
      return returnResponse(
        res,
        200,
        { message: "Task deleted successfully" },
        true
      );
    }
  } catch (error) {
    next(error);
  }
}

async function deleteTasksByStatusAndIdTable(req, res, next) {
  try {
    const deletedTasks =
      await taskManager.deleteTasksByStatusAndIdTableAndIdUser(
        req.params.value,
        req.params.id,
        req.user._id
      );

    if (deletedTasks) {
      return returnResponse(
        res,
        200,
        { message: "Tasks deleted successfully" },
        true
      );
    }
  } catch (error) {
    next(error);
  }
}

export {
  createTask,
  getTaskByIdAndIdTable,
  getTasksByStatusAndIdTable,
  getCountTasksByStatusAndIdTable,
  updateTaskByIdAndIdTable,
  deleteTaskByIdAndIdTable,
  deleteTasksByStatusAndIdTable,
};
