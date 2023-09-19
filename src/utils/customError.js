//Extends from class Error to create more personalize errors
class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

//Exports

export default CustomError;
