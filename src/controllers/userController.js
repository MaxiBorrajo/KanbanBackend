//Imports
import userManager from "../entities/UserManager.js";

import authManager from "../entities/AuthManager.js";

import CustomError from "../utils/customError.js";

import { returnResponse } from "../utils/utilsFunctions.js";

import sendEmail from "../utils/sendEmail.js";

import jwt from "jsonwebtoken";

import { deleteImageInCloud } from "../middlewares/uploadsImageMiddleware.js";

//Methods
async function register(req, res, next) {
  try {
    const createdUser = await userManager.createUser(req.body);

    return returnResponse(res, 201, createdUser, true);
  } catch (error) {
    next(error);
  }
}

async function googleRedirect(req, res, next) {
  try {
    const auth = {
      idUser: req.user._id,
      token: authManager.generateToken(req.user._id),
    };

    await authManager.authorize(auth);

    res.set("authorizationToken", auth.token);

    res.redirect(`${process.env.URL_FRONTEND}?googleRedirect=true`);
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authManager.deleteAuthByIdUser(req.user._id);

    return returnResponse(res, 200, { message: "You have log out" }, true);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller that sends a password change email
 * to the address provided.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the user isn't found in database or if authentication
 * cannot be sent
 */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const foundUser = await userManager.getUserByEmail(email);

    if (!foundUser || foundUser.googleUser) {
      throw new CustomError("User not found", 400);
    }

    const resetPasswordToken = foundUser.getResetPasswordToken(foundUser._id);

    const resetPasswordUrl = `${process.env.URL_FRONTEND}/resetPassword?token=${resetPasswordToken}`; //link al front

    //esto despues va a ser un archivo html lindo
    const resetPasswordEmailBody = `
            <h1>Reset password</h1>
            <p>To reset your password click the following link: </p>
            <a href='${resetPasswordUrl}' rel='noreferrer' referrerpolicy='origin' clicktracking='off'>Change your password</a>
          `;

    sendEmail({
      to: email,
      subject: "Password Reset Requested",
      text: resetPasswordEmailBody,
      html: resetPasswordEmailBody,
    });

    return returnResponse(
      res,
      200,
      {
        message:
          "Email sent. Go to your email account and finish the operation",
      },
      true
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Controller that change the password of the user encrypted
 * in the reset password token
 *
 * @param {Object} req - The request object from the HTTP request
 * @param {Object} res - The response object from the HTTP response
 * @param {Function} next - The next function in the middleware chain
 * @throws {CustomError}  If any the reset password token was provided, if
 * any password was provided, if the verification code is invalid,
 * if it is expired, if the user isn't found
 * or if the authentication associated with the user isn't found
 */
async function resetPassword(req, res, next) {
  try {
    if (!req.params.token) {
      throw new CustomError("Any verification token was provided", 400);
    }

    const payload = jwt.verify(req.params.token, process.env.SECRET);

    const foundUser = await userManager.getUserById(payload._id);

    if (!foundUser) {
      throw new CustomError("User not found", 400);
    }

    foundUser.password = req.body.password;

    await foundUser.save();

    return returnResponse(
      res,
      200,
      {
        message: "Password changed successfully",
      },
      true
    );
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const authenticatedUser = await userManager.authenticateUser(
      username,
      password
    );

    const auth = {
      idUser: authenticatedUser._doc._id,
      token: authManager.generateToken(authenticatedUser._doc._id),
    };

    await authManager.authorize(auth);

    res.set("authorizationToken", auth.token);

    return returnResponse(
      res,
      200,
      authenticatedUser,
      true
    );
  } catch (error) {
    next(error);
  }
}

async function getActualUser(req, res, next) {
  try {
    const foundUser = await userManager.getUserById(req.user._id);

    if (!foundUser) {
      throw new CustomError("User not found", 500);
    }

    return returnResponse(res, 200, foundUser, true);
  } catch (error) {
    next(error);
  }
}

async function deleteActualUser(req, res, next) {
  try {
    const deletedUser = await userManager.deleteUserById(req.user._id);

    if (deletedUser) {
      await logout(req, res, next);
    }
  } catch (error) {
    next(error);
  }
}

async function sendFeedback(req, res, next) {
  try {
    const feedback = { idUser: req.user._id, ...req.body };

    const createdFeedback = await userManager.sendFeedback(feedback);

    if (!createdFeedback) {
      throw new CustomError("Feedback not send", 500);
    }

    return returnResponse(
      res,
      200,
      {
        message: "Feedback sent successfully",
      },
      true
    );
  } catch (error) {
    next(error);
  }
}

async function updateActualUser(req, res, next) {
  try {
    console.log(req.user)
    console.log(req.body)
    let user = { ...req.user._doc, ...req.body };
    console.log(user)
    if (existsImageUpload(req)) {
      await deleteImageInCloud(req.user.publicId);

      const profilePhoto = {
        publicId: req.file.publicId,
        urlProfilePhoto: req.file.url,
      };

      user = { ...user, ...profilePhoto };
    }

    const updatedUser = await userManager.updateUserById(req.user._id, user);

    if (updatedUser) {
      return returnResponse(
        res,
        200,
        {
          message: "User updated successfully",
        },
        true
      );
    }
  } catch (error) {
    next(error);
  }
}

function existsImageUpload(req) {
  return Boolean(req.file && req.file.url && req.file.publicId);
}

export {
  register,
  logout,
  forgotPassword,
  resetPassword,
  getActualUser,
  deleteActualUser,
  sendFeedback,
  updateActualUser,
  googleRedirect,
  login,
};
