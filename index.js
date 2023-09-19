//Imports
import app from './server.js'


import databaseConnection from "./src/config/databaseConnection.js";

//Methods

/**
 * Starts server in port establish in enviroment variable PORT,
 * and establish a connection with the database before starts listening
 * @throws {Error} - If cannot connects with database throws an error
 */
function startServer() {
  try {
    // Starts server
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });

    databaseConnection();
  } catch (error) {
    throw error;
  }
}

startServer();
