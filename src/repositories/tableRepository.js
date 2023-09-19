//imports
import mongoose from "mongoose";

//schema
const tableSchema = new mongoose.Schema(
  {
    tableName: {
      type: String,
      required: true,
    },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true, },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const table = new mongoose.model("tables", tableSchema);

export default table
