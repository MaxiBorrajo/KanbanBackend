//imports
import mongoose from "mongoose";

//schema
const feedbackSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
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

const feedback = new mongoose.model("feedbacks", feedbackSchema);

export default feedback;
