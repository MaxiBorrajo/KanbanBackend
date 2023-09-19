//Imports

import CustomError from "../utils/customError.js";

import _ from "lodash";

//Methods

/**
 * Middleware function that checks if the body of the request meets certain requirements
 * Requirements:
 * - The body must have an 'email' attribute.
 * - The 'email' attribute, if present, must be a valid email address
 *
 * @param {Object} req - The request object from the HTTP request
 * @param {Object} res - The response object from the HTTP response
 * @param {Function} next - The next function in the middleware chain
 * @throws {CustomError} If the body of the request doesn't meet the requirements
 */
function meetsWithEmailRequirements(req, res, next) {
  try {
    const email = req.body.email;

    if (!email) {
      throw new CustomError("An 'email' attribute is required", 400);
    }

    const emailRegularExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegularExpression.test(email)) {
      throw new CustomError(
        "The value of the 'email' attribute must be a valid email address",
        422
      );
    }

    return next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware function that checks if the body of the request meets certain requirements
 * Requirements:
 * - The body must have an 'password' attribute.
 * - The 'password' attribute, if present, must be have
 * at least one lowercase letter, one uppercase letter,
 * one digit, one special character, and be 8 characters or longer
 *
 * @param {Object} req - The request object from the HTTP request
 * @param {Object} res - The response object from the HTTP response
 * @param {Function} next - The next function in the middleware chain
 * @throws {CustomError} If the body of the request doesn't meet the requirements
 */
function meetsWithPasswordRequirements(req, res, next) {
  try {
    const password = req.body.password;

    if (!password) {
      throw new CustomError("'password' attribute is required", 400);
    }

    const passwordRegularExpression =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegularExpression.test(password)) {
      throw new CustomError(
        "The value of 'password' attribute must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8 characters or longer.",
        422
      );
    }

    return next();
  } catch (error) {
    next(error);
  }
}

/**
 * Creates a middleware function that checks
 * if the body of the request does not contain specified attributes
 *
 * @param {string[]} attributes - An array of attribute
 * that should not be present in the request body
 * @returns {Function} - A middleware function that checks the presence of the specified attributes
 * @throws {CustomError} - If any of the excluded attributes are found in the request body
 */
function bodyMustNotContain(attributes) {
  /**
   * Middleware function that checks if the body of the request does not contain specified attributes.
   *
   * @param {Object} req - The request object from the HTTP request
   * @param {Object} res - The response object from the HTTP response
   * @param {Function} next - The next function in the middleware chain
   * @throws {CustomError} - If any of the excluded attributes are found in the request body
   */
  return function (req, res, next) {
    try {
      const bodyAttributes = Object.keys(req.body);

      const foundAttribute = bodyAttributes.find((attribute) =>
        attributes.includes(attribute)
      );

      if (foundAttribute) {
        throw new CustomError(
          `The attribute '${foundAttribute}' is not allowed`,
          400
        );
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Creates a middleware function that checks
 * if the body of the request does contain specified attributes
 *
 * @param {string[]} attributes - An array of attribute names that
 * must be present in the request body
 * @returns {Function} - A middleware function that checks the presence of the specified attributes
 * @throws {CustomError} - If any of the must attributes are not found in the request body
 */
function bodyMustContain(attributes) {
  /**
   * Middleware function that checks if the body of the request does contain the specified attributes
   *
   * @param {Object} req - The request object from the HTTP request
   * @param {Object} res - The response object from the HTTP response
   * @param {Function} next - The next function in the middleware chain
   * @throws {CustomError} - If any of the must attributes are not found in the request body
   */
  return function (req, res, next) {
    try {
      const bodyAttributes = Object.keys(req.body);

      const intersectedAttributes = _.intersection(bodyAttributes, attributes);

      if (!_.isEqual(intersectedAttributes.sort(), attributes.sort())) {
        const missingAttributes = _.difference(attributes, bodyAttributes);

        throw new CustomError(
          `The body is missing the following attributes: ${missingAttributes}`,
          400
        );
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
}

//Exports

export {
  meetsWithEmailRequirements,
  meetsWithPasswordRequirements,
  bodyMustContain,
  bodyMustNotContain,
};
