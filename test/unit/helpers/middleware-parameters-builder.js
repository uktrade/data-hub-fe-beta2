const paths = require('~/src/apps/investments/paths')

module.exports = ({
  reqMock = {},
  resMock = {},
  requestBody,
  requestParams = {},
  requestQuery = {},
  CURRENT_PATH = '',
  breadcrumb = sinon.stub().returnsThis(),
  title = sinon.stub().returnsThis(),
  company,
  contact,
  interaction,
  interactions,
  order,
  investment,
  companiesHouseRecord,
  features = {},
  userAgent = { isIE: false },
  user,
}) => {
  return {
    reqMock: {
      ...reqMock,
      session: {
        token: '1234',
      },
      body: requestBody,
      params: requestParams,
      query: requestQuery,
      flash: sinon.spy(),
    },
    resMock: {
      ...resMock,
      breadcrumb,
      title,
      render: sinon.spy(),
      redirect: sinon.spy(),
      json: sinon.spy(),
      header: sinon.spy(),
      locals: {
        CURRENT_PATH,
        paths,
        company,
        contact,
        interaction,
        interactions,
        order,
        investment,
        companiesHouseRecord,
        features,
        userAgent,
        user,
      },
    },
    nextSpy: sinon.spy(),
  }
}
