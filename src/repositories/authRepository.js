//imports
import mongoose from "mongoose";

//schema
const authSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const auth = new mongoose.model("auths", authSchema);

export default auth;
