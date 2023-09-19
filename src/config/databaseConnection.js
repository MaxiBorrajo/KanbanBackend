//imports
import mongoose from "mongoose";
import CustomError from '../utils/customError.js';

//config
mongoose.set("strictQuery", true);

//methods
/**
 * Establish connection with database with uri as enviroment variable DATABASE_URI
 * @throws {Error} - If cannot connects with database throws an error.
 */
async function databaseConnection() {
  //Waits until mongoose connects with database 
  await mongoose
    .connect(process.env.DB_URI)
    .then((res) => {
      //If connects, prints in console that connection was established
      console.log("Succesfully connected to database");
    })
    .catch((err) => {
      //If doesn't connect, throws an error
      throw new CustomError(`Connection to database failed, ERROR: ${err.message}`);
    });
}

//exports
export default databaseConnection;
