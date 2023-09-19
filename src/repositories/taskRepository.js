//imports
import mongoose from "mongoose";

//schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },
        message: "It must be an integer",
      },
    },
    order: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },
        message: "It must be an integer",
      },
    },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    idTable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tables",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const task = new mongoose.model("tasks", taskSchema);

export default task;
