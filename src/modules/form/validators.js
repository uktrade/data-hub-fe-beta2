const { isNil, isEmpty } = require('lodash')

module.exports = {
  required: value => !(isNil(value) || isEmpty(value)),
  postcode (value) {
    const postcodePattern = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/
    return postcodePattern.test(value)
  },
}
