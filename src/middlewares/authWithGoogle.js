//Imports
import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth2";

import userManager from "../entities/UserManager.js";

import { uploadImageToCloud } from "./uploadsImageMiddleware.js";

import CustomError from "../utils/customError.js";

//Methods
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.URL_BACKEND}/api/users/google/redirect`,
      passReqToCallback: true,
    },
    /**
     * Passport google authentication strategy callback. Searches with the information given
     * by the authentication a user stored in database, if it is found, executes done function, if it is not
     * creates one and then executes done.
     * @param {Object} request - Request's object from the http request
     * @param {string} accessToken - Access token from google authentication
     * @param {string} refreshToken - Refresh token from google authentication
     * @param {Object} profile - User's google profile
     * @param {Function} done - Callback function that finish the authentication
     * @returns {Promise<void>} - Promise resolved when authentication is complete
     * @throws {CustomError} - If something goes wrong with the authentication or with the database
     */
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const user = await userManager.getUserByEmail(profile.email);

        if (!user) {
          const profile_photo = await uploadImageToCloud(profile.picture);

          const new_user = {
            email: profile.email,
            username: profile.displayName,
            urlProfilePhoto: profile_photo.url,
            publicId: profile_photo.publicId,
            password: "",
            googleUser: true,
          };

          const createdUser = await userManager.createUser(new_user);

          return done(null, createdUser);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  try {
    done(null, user);
  } catch (error) {
    return done(new CustomError(error.message, 500));
  }
});

passport.deserializeUser(async function (user, done) {
  try {
    const foundUser = await userManager.getUserByEmail(user.email);

    done(null, foundUser);
  } catch (error) {
    return done(new CustomError(error.message, 500));
  }
});
