import CustomError from "../utils/customError.js";

import userManager from "../entities/UserManager.js";

import authManager from "../entities/AuthManager.js";

import jwt from "jsonwebtoken";

async function authMiddleware(req, res, next) {
  try {
    let token = req.get("Authorization");

    if (!token) {
      throw new CustomError("Invalid authorization", 401);
    }

    token = authManager.cleanToken(token);

    const decodedToken = jwt.verify(token, process.env.SECRET);

    const foundAuth = await authManager.getAuthByIdAndToken(
      decodedToken.idUser,
      token
    );

    if (!foundAuth) {
      throw new CustomError("Invalid authorization", 401);
    }

    const foundUser = await userManager.getUserById(decodedToken.idUser);

    req.user = foundUser;

    next();
  } catch (error) {
    next(error);
  }
}

export default authMiddleware;
