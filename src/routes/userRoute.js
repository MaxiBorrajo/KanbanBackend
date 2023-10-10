//Imports
import express from "express";

import {
  bodyMustContain,
  bodyMustNotContain,
  meetsWithEmailRequirements,
  meetsWithPasswordRequirements,
} from "../middlewares/validateFieldsMiddlewares.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import passport from "passport";

import {
  processImage,
  multerUploads,
} from "../middlewares/uploadsImageMiddleware.js";

const router = express.Router();

import "../middlewares/authWithGoogle.js";

import {
  logout,
  register,
  forgotPassword,
  resetPassword,
  getActualUser,
  deleteActualUser,
  sendFeedback,
  updateActualUser,
  googleRedirect,
  login
} from "../controllers/userController.js";

router.post(
  "/",
  bodyMustContain(["username", "email", "password"]),
  meetsWithEmailRequirements,
  meetsWithPasswordRequirements,
  register
);

router.post(
  "/credentials",
  bodyMustContain(["username", "password"]),
  meetsWithPasswordRequirements,
  login
);

/**
 * GET route to initiate google's authentication
 * Redirect a user to google's login page to authorize app to use user's information
 * @route GET /api/users/google
 * @returns {void}
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

/**
 * GET route to manage redirection after google's authentication.
 * It'll process of authentication and will send a cookie with an access token,
 * refresh token and certain user information
 * @route GET /api/users/google/redirect
 * @middleware passport.authenticate('google')
 * @param {Object} req - Request's object from the http request.
 * @param {Object} res - Response's object from the http request
 * @returns {Object} A response object with the user's information
 */
router.get("/google/redirect", passport.authenticate("google"), googleRedirect);

router.delete("/credentials", authMiddleware, logout);

router.post("/changePassword", meetsWithEmailRequirements, forgotPassword);

router.put(
  "/changePassword/:token",
  meetsWithPasswordRequirements,
  resetPassword
);

router.get("/", authMiddleware, getActualUser);

router.put(
  "/",
  authMiddleware,
  bodyMustNotContain(["_id", "password", "googleUser"]),
  multerUploads,
  processImage,
  updateActualUser
);

router.delete("/", authMiddleware, deleteActualUser);

router.post(
  "/feedback",
  bodyMustContain(["comment"]),
  authMiddleware,
  sendFeedback
);

export default router;
