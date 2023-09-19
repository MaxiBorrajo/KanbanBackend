import passport from "passport";

import { Strategy as localStrategy } from "passport-local";

import userManager from "../entities/UserManager.js";

import CustomError from "../utils/customError.js";

passport.use(
  new localStrategy(async function (username, password, done) {
    try {
      const authenticated = await userManager.authenticateUser(
        username,
        password
      );

      if (!authenticated) {
        return done(null, false);
      }

      return done(null, authenticated);
    } catch (error) {
      return done(error);
    }
  })
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
