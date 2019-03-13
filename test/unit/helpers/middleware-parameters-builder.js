const paths = require('~/src/apps/investments/paths')

module.exports = ({
  requestBody,
  requestParams = {},
  requestQuery = {},
  CURRENT_PATH = '',
  breadcrumb = sinon.stub().returnsThis(),
  company,
  contact,
  interaction,
  order,
  investment,
  companiesHouseRecord,
  features = {},
  user,
}) => {
  return {
    reqMock: {
      session: {
        token: '1234',
      },
      body: requestBody,
      params: requestParams,
      query: requestQuery,
      flash: sinon.spy(),
    },
    resMock: {
      breadcrumb,
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {
        CURRENT_PATH,
        paths,
        company,
        contact,
        interaction,
        order,
        investment,
        companiesHouseRecord,
        features,
        user,
      },
    },
    nextSpy: sinon.spy(),
  }
}
