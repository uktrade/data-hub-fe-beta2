const { investmentTypes } = require('../types')

const getInvestmentTypeDetails = (investmentType, fdiType) => {
  if (investmentType !== null && fdiType !== null && investmentType.name === investmentTypes.FDI) {
    return `${investmentType.name}, ${fdiType.name}`
  }
  return investmentType.name
}

module.exports = {
  getInvestmentTypeDetails,
}
