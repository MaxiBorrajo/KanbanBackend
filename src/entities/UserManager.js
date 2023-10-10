import user from "../repositories/userRepository.js";
import feedback from "../repositories/feedbackRepository.js";
import tableManager from "../entities/TableManager.js";
import taskManager from "../entities/TaskManager.js";
import { isLesserOrEqualThan } from "../utils/utilsFunctions.js";
import CustomError from "../utils/customError.js";
import { deleteImageInCloud } from "../middlewares/uploadsImageMiddleware.js";

class UserManager {
  constructor() {}

  async createUser(_user) {
    try {
      const foundUser = await user.findOne({
        $or: [{ username: _user.username }, { email: _user.email }],
      });

      if (foundUser) {
        throw new CustomError("User already exists", 400);
      }

      const createdUser = await user.create(_user);

      await tableManager.createTable({
        tableName: "New table",
        idUser: createdUser._doc._id,
      });

      delete createdUser._doc.password;

      delete createdUser._doc._id;

      delete createdUser._doc.updatedAt;

      delete createdUser._doc.createdAt;

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const foundUser = await user.findById(id);

      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const foundUser = await user.findOne({ email: email });

      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUserById(id, _user) {
    try {
      const updatedUser = await user.findByIdAndUpdate(id, _user);

      if (isLesserOrEqualThan(updatedUser.matchedCount, 0)) {
        throw new CustomError(`User not found`, 400);
      }

      if (isLesserOrEqualThan(updatedUser.modifiedCount, 0)) {
        throw new CustomError(`User not modified`, 500);
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUserById(id) {
    try {
      await tableManager.deleteTablesByIdUser(id);
      await taskManager.deleteTasksByIdUser(id);

      await this.deleteImageOfUser(id);

      const deletedUser = await user.findByIdAndDelete(id);

      if (deletedUser.deletedCount <= 0) {
        throw new CustomError(`User not deleted`, 500);
      }

      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteImageOfUser(id) {
    try {
      const foundUser = await this.getUserById(id);

      if (!foundUser) {
        throw new CustomError("User not found", 400);
      }

        await deleteImageInCloud(foundUser.publicId);
   
    } catch (error) {
      throw error;
    }
  }

  async sendFeedback(_feedback) {
    try {
      const createdFeedback = await feedback.create(_feedback);

      return createdFeedback;
    } catch (error) {
      throw error;
    }
  }

  async authenticateUser(username, password) {
    try {
      const foundUser = await user
        .findOne({
          $or: [{ username: username }, { email: username }],
        })
        .select("+password");

      if (!foundUser || !(await foundUser.matchPasswords(password))) {
        throw new CustomError("Email or password are wrong", 400);
      }

      delete foundUser._doc.password;

      delete foundUser._doc.updatedAt;

      delete foundUser._doc.createdAt;

      return foundUser;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserManager();
