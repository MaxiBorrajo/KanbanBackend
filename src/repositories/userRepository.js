//imports
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import CustomError from "../utils/customError.js";
import jwt from "jsonwebtoken";

//schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleUser;
      },
      select: false,
    },
    googleUser: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "light",
    },
    publicId: {
      type: String,
      default: "default",
    },
    urlProfilePhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/dixntuyk8/image/upload/v1693830223/x1vdmydenrkd3luzvjv6.png",
    },
    toDoColor: {
      type: String,
      default: "#6443D9",
    },
    doingColor: {
      type: String,
      default: "#ff1c1c",
    },
    doneColor: {
      type: String,
      default: "#54ff59",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Middleware that encrypts the user's password before saving it to the database.
 * @param {Function} next - Express's next function.
 * @returns {Promise<void>} Promise that is resolved when process of encryption is completed.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
});

/**
 * Function that verifies if passwords matches.
 * @param {String} password - Password to see if matches with the one store in the database.
 * @returns {Promise<Boolean>} Promise that returns a boolean when the process of matching finish.
 */
userSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Schema's method that generates a reset password token
 * @param {String} - User's id
 * @returns {String} - A token that is used to allow the user change his password.
 */
userSchema.methods.getResetPasswordToken = function (id) {
  try {
    const resetPasswordToken = jwt.sign({ _id: id }, process.env.SECRET, {
      expiresIn: "2 minutes",
    });

    return resetPasswordToken;
  } catch (error) {
    throw error;
  }
};

const user = new mongoose.model("users", userSchema);

export default user;
