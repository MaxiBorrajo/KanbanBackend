import task from "../repositories/taskRepository.js";
import { isLesserOrEqualThan } from "../utils/utilsFunctions.js";
import CustomError from "../utils/customError.js";

class TaskManager {
  //Constructor
  constructor() {}

  //Methods
  async createTask(_task) {
    try {
      const createdTask = await task.create(_task);

      return createdTask;
    } catch (error) {
      throw error;
    }
  }

  async getTaskByIdAndIdTableAndIdUser(id, idTable, idUser) {
    try {
      const foundTask = await task.findOne({
        _id: id,
        idTable: idTable,
        idUser: idUser,
      });

      return foundTask;
    } catch (error) {
      throw error;
    }
  }

  async getTasksByIdUserAndIdTableAndStatus(idTable, idUser, status) {
    try {
      const foundTasks = await task
        .find({ idTable: idTable, idUser: idUser, status: status })
        .sort({
          order: "asc",
        });

      return foundTasks;
    } catch (error) {
      throw error;
    }
  }

  async updateTaskByIdAndIdTableAndIdUser(id, idTable, idUser, _task) {
    try {
      const updatedTask = await task.findOneAndUpdate(
        {
          _id: id,
          idTable: idTable,
          idUser: idUser,
        },
        _task
      );

      if (isLesserOrEqualThan(updatedTask.matchedCount, 0)) {
        throw new CustomError(`Task not found`, 400);
      }

      if (isLesserOrEqualThan(updatedTask.modifiedCount, 0)) {
        throw new CustomError(`Task not modified`, 500);
      }

      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  async deleteTaskByIdAndIdTableAndIdUser(id, idTable, idUser) {
    try {
      const deletedTask = await task.findOneAndDelete({
        _id: id,
        idTable: idTable,
        idUser: idUser,
      });

      if (deletedTask.deletedCount <= 0) {
        throw new CustomError(`Task not deleted`, 500);
      }

      return deletedTask;
    } catch (error) {
      throw error;
    }
  }

  async deleteTasksByIdUser(idUser){
    try {
      const deletedTasks = await task.deleteMany({
        idUser: idUser,
      });

      return deletedTasks;
    } catch (error) {
      throw error;
    }
  }

  async deleteTasksByIdTableIdUser(idTable, idUser){
    try {
      const deletedTasks = await task.deleteMany({
        _id: idTable,
        idUser: idUser,
      });

      return deletedTasks;
    } catch (error) {
      throw error;
    }
  }

  async deleteTasksByStatusAndIdTableAndIdUser(status, idTable, idUser) {
    try {
      const deletedTasks = await task.deleteMany({
        status: status,
        idTable: idTable,
        idUser: idUser,
      });

      return deletedTasks;
    } catch (error) {
      throw error;
    }
  }

  async countTasksByStatusAndIdTableAndIdUser(status, idTable, idUser) {
    try {
      const count = await task.countDocuments({
        status: status,
        idTable: idTable,
        idUser: idUser,
      });

      return count
    } catch (error) {
      throw error;
    }
  }
}

export default new TaskManager();
