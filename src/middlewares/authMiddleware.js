import CustomError from "../utils/customError.js";

function authMiddleware(req, res, next) {
  try {
    console.log(req.session)
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
      next();
    } else {
      throw new CustomError("Invalid authorization", 401);
    }
  } catch (error) {
    next(error);
  }
}

export default authMiddleware;