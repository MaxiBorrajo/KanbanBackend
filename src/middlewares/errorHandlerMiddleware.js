//Imports
import { returnResponse } from "../utils/utilsFunctions.js";

//Methods

/**
 * Middleware that handles errors from a http request
 *
 * @param {Error} err - The error that has occurred
 * @param {Object} req - Request's object from the http request
 * @param {Object} res - Response's object from the http response
 * @param {Function} next - Express's next function
 * @returns {Object} JSON response object with an error message and a status
 */
function errorHandlerMiddleware(err, req, res, next) {
  console.log(err)
  
  const message = {
    message: err.message
      ? `Something went wrong. Error: ${err.message}`
      : "Unknown error",
  };

  const status = err.status ? err.status : 500;

  return returnResponse(res, status, message, false);
}

//Exports

export default errorHandlerMiddleware;
