import table from "../repositories/tableRepository.js";
import taskManager from "../entities/TaskManager.js"
import { isLesserOrEqualThan } from "../utils/utilsFunctions.js";
import CustomError from "../utils/customError.js";

class TableManager {
  //Constructor
  constructor() {}

  //Methods
  async createTable(_table) {
    try {
      const createdTable = await table.create(_table);
      
      return createdTable;
    } catch (error) {
      throw error;
    }
  }

  async getTableByIdAndIdUser(id, idUser) {
    try {
      const foundTable = await table.find({ _id: id, idUser: idUser });

      return foundTable;
    } catch (error) {
      throw error;
    }
  }

  async getTablesByIdUser(idUser) {
    try {
      const foundTables = await table.find({ idUser: idUser });

      return foundTables;
    } catch (error) {
      throw error;
    }
  }

  async updateTableByIdAndIdUser(id, idUser, _table) {
    try {
      const updatedTable = await table.findOneAndUpdate(
        { _id: id, idUser: idUser },
        _table
      );

      if (isLesserOrEqualThan(updatedTable.matchedCount, 0)) {
        throw new CustomError(`Table not found`, 400);
      }

      if (isLesserOrEqualThan(updatedTable.modifiedCount, 0)) {
        throw new CustomError(`Table not modified`, 500);
      }

      return updatedTable;
    } catch (error) {
      throw error;
    }
  }

  async deleteTableByIdAndIdUser(id, idUser) {
    try {
      await taskManager.deleteTasksByIdTableIdUser(id, idUser);

      const deletedTable = await table.deleteOne({ _id: id, idUser: idUser });

      if (deletedTable.deletedCount <= 0) {
        throw new CustomError(`Table not deleted`, 500);
      }

      return deletedTable;
    } catch (error) {
      throw error;
    }
  }

  async deleteTablesByIdUser(idUser) {
    try {
      await taskManager.deleteTasksByIdUser(idUser);
      
      const deletedTables = await table.deleteMany({idUser: idUser });

      return deletedTables;
    } catch (error) {
      throw error;
    }
  }
}

export default new TableManager();
