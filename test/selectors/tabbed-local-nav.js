module.exports = () => {
  const tabbedLocalNavSelector = `[data-auto-id="tabbedLocalNav"]`
  return {
    item: (number) => `${tabbedLocalNavSelector} ul li:nth-child(${number}) a`,
    selected: `${tabbedLocalNavSelector} a.govuk-tabs__tab--selected`,
  }
}
