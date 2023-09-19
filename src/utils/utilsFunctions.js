//Methods

/**
 * Function that sees if firstParameter is equal to secondParameter
 * @param {any} firstParameter - The first parameter to evaluate
 * @param {any} secondParameter - The second parameter to evaluate
 * @returns {boolean} True if parameters are equal, false otherwise
 */
function areEqual(firstParameter, secondParameter) {
  return firstParameter === secondParameter;
}

/**
 * Function that sees if firstParameter is greater to secondParameter
 * @param {number} firstParameter - The first parameter to evaluate
 * @param {number} secondParameter - The second parameter to evaluate
 * @returns {boolean} True if firstParameter is greater to secondParameter, false otherwise
 */
function isGreaterThan(firstParameter, secondParameter) {
  return firstParameter > secondParameter;
}

/**
 * Function that sees if firstParameter is lesser to secondParameter
 * @param {number} firstParameter - The first parameter to evaluate
 * @param {number} secondParameter - The second parameter to evaluate
 * @returns {boolean} True if firstParameter is lesser to secondParameter, false otherwise
 */
function isLesserThan(firstParameter, secondParameter) {
  return firstParameter < secondParameter;
}

/**
 * Function that sees if firstParameter is greater or equal to secondParameter
 * @param {number} firstParameter - The first parameter to evaluate
 * @param {number} secondParameter - The second parameter to evaluate
 * @returns {boolean} True if firstParameter is greater or equal to secondParameter, false otherwise
 */
function isGreaterOrEqualThan(firstParameter, secondParameter) {
  return firstParameter >= secondParameter;
}

/**
 * Function that sees if firstParameter is lesser or equal to secondParameter
 * @param {number} firstParameter - The first parameter to evaluate
 * @param {number} secondParameter - The second parameter to evaluate
 * @returns {boolean} True if firstParameter is lesser or equal to secondParameter, false otherwise
 */
function isLesserOrEqualThan(firstParameter, secondParameter) {
  return firstParameter <= secondParameter;
}

/**
 * Function that deletes an specific element from an array
 * @param {any} element - The element to delete from the array
 * @param {Array} array - The array in which delete the element
 * @returns {Array} If element is in the array, returns array without element,
 * if not, returns array without changes
 */
function deleteElementFromArray(element, array) {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array;
}

/**
 * Function that return a success response with a status, resource and links given
 * @param {Object} res - The response object from the HTTP response
 * @param {number} status - The status of the HTTP response. Must be an integer
 * @param {any} resource - The resource to send to the cliente
 * @returns {Object} The response object from the HTTP response
 */
function returnResponse(res, status, resource, success) {
  return res.status(status).json({ success: success, resource: resource });
}

//Exports

export {
  areEqual,
  isGreaterThan,
  isLesserThan,
  isGreaterOrEqualThan,
  isLesserOrEqualThan,
  deleteElementFromArray,
  returnResponse,
};
