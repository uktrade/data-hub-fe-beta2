/**
 * When posting data the API has different rules for empty and null
 * fields to blank fields are made null to be consistant.
 *
 * Also handy for cleaning data to send to a form
 *
 * @param {any} data
 */
function nullEmptyFields (data) {
  const cleanedObject = Object.assign({}, data)
  const fieldNames = Object.keys(cleanedObject)
  for (const fieldName of fieldNames) {
    const fieldValue = cleanedObject[fieldName]
    if (fieldValue !== null && typeof fieldValue === 'string' && fieldValue.length === 0) {
      cleanedObject[fieldName] = null
    }
  }
  return cleanedObject
}

function deleteNulls (data) {
  const nullableObject = Object.assign({}, data)
  const fieldNames = Object.keys(nullableObject)
  for (const fieldName of fieldNames) {
    const fieldValue = nullableObject[fieldName]
    if (fieldValue === null) {
      delete nullableObject[fieldName]
    }
  }
  return nullableObject
}

/**
 * Looks in the object passed and if it has a name property, return the name
 *
 * @param {Object} object
 * @param {string} key
 * @returns {string|null} the name for the object
 */
function getPropertyName (object, key) {
  if (object && typeof object === 'object' && object[key] && object[key].name) {
    return object[key].name
  }
  return null
}

/**
 * Looks in the object passed and if it has an ID property, return the id
 *
 * @param {Object} object
 * @param {string} key
 * @returns {string|null} the ID for the object
 */
function getPropertyId (object, key) {
  if (object && typeof object === 'object' && object[key] && object[key].id) {
    return object[key].id
  }
  return null
}

/**
 * Convert Yes and No string to true and false
 *
 * @param {Object} object
 */
function convertYesNoToBoolean (object) {
  const convertedObject = Object.assign({}, object)
  const keys = Object.keys(convertedObject)

  for (const key of keys) {
    const value = convertedObject[key]

    if (typeof value !== 'boolean') {
      if (value.toLocaleLowerCase() === 'yes') {
        convertedObject[key] = true
      }
      if (value.toLocaleLowerCase() === 'no') {
        convertedObject[key] = false
      }
    }
  }

  return convertedObject
}

/**
* Convert fk relationships from flat to 1-level deep
*
* @param {Object} object
* @param {Array} props
*/
function convertNestedObjects (object = {}, props = []) {
  const convertedObject = Object.assign({}, object)

  for (const prop of props) {
    const value = object[prop]

    if (value) {
      convertedObject[prop] = {
        id: value,
      }
    }
  }

  return convertedObject
}

module.exports = {
  convertNestedObjects,
  convertYesNoToBoolean,
  deleteNulls,
  getPropertyId,
  getPropertyName,
  nullEmptyFields,
}
