import user from "../repositories/userRepository.js";
import auth from "../repositories/authRepository.js";
import CustomError from "../utils/customError.js";
import jwt from "jsonwebtoken";

class AuthManager {
  constructor() {}

  async getAuthByIdAndToken(idUser, token) {
    try {
      const foundAuth = await auth.findOne({ idUser: idUser, token: token });
      
      return foundAuth;
    } catch (error) {
      throw error;
    }
  }

  async deleteAuthByIdUser(id) {
    try {
      const deletedAuth = await auth.deleteOne({ idUser: id });

      if (deletedAuth.deletedCount <= 0) {
        throw new CustomError(`Auth not deleted`, 500);
      }

      return deletedAuth;
    } catch (error) {
      throw error;
    }
  }

  async authorize(_auth) {
    try {
      let authorization = await auth.findOneAndUpdate(
        { idUser: _auth.idUser },
        { token: _auth.token }
      );

      if (!authorization) {
        authorization = await auth.create(_auth);
      }

      return authorization;
    } catch (error) {
      throw error;
    }
  }

  generateToken(idUser) {
    const token = jwt.sign({ idUser: idUser }, process.env.SECRET);
    return token;
  }

  cleanToken(token) {
    return token.replace("Bearer ", "");
  }
}

export default new AuthManager();
