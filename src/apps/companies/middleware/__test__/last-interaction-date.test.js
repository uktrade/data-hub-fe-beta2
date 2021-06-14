const { endOfToday, format, subMonths } = require('date-fns')
const middleware = require('../last-interaction-date')
const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')

const QUERY_PARAM = 'interaction_between'
const START_DATE_PARAM = 'latest_interaction_date_before'
const END_DATE_PARAM = 'latest_interaction_date_after'

function getTimestamp(offset) {
  const date = endOfToday()

  if (offset > 0) {
    subMonths(date, offset)
  }

  return format(date, 'y-MM-d')
}

function callMiddleware(value) {
  const { reqMock, resMock, nextSpy } = buildMiddlewareParameters({
    requestBody: {
      [QUERY_PARAM]: value,
    },
  })

  middleware(reqMock, resMock, nextSpy)

  return reqMock
}

function checkBody(reqMock, startValue, endValue) {
  expect(reqMock.body[QUERY_PARAM]).to.be.undefined
  expect(reqMock.body[START_DATE_PARAM]).to.equal(getTimestamp(startValue))
  expect(reqMock.body[END_DATE_PARAM]).to.equal(getTimestamp(endValue))
}

describe('Last interaction date middleware', () => {
  describe('np param', () => {
    it('should delete the param from req.body', () => {
      const { reqMock, resMock, nextSpy } = buildMiddlewareParameters({
        requestBody: {},
      })

      middleware(reqMock, resMock, nextSpy)

      expect(reqMock.body[QUERY_PARAM]).to.be.undefined
      expect(reqMock.body[START_DATE_PARAM]).to.be.undefined
      expect(reqMock.body[END_DATE_PARAM]).to.be.undefined
    })
  })

  describe('an empty param', () => {
    it('should delete the param from req.body', () => {
      const reqMock = callMiddleware('')

      expect(reqMock.body[QUERY_PARAM]).to.be.undefined
      expect(reqMock.body[START_DATE_PARAM]).to.be.undefined
      expect(reqMock.body[END_DATE_PARAM]).to.be.undefined
    })
  })

  describe('a single value param', () => {
    describe('with a value of 0', () => {
      it('should add today and 1 month', () => {
        const reqMock = callMiddleware('0')
        checkBody(reqMock, 0, 1)
      })
    })

    describe('with a value of 1', () => {
      it('should add 3 and 6 months', () => {
        const reqMock = callMiddleware('1')
        checkBody(reqMock, 1, 3)
      })
    })

    describe('with a value of 2', () => {
      it('should add 3 and 6 months', () => {
        const reqMock = callMiddleware('2')
        checkBody(reqMock, 3, 6)
      })
    })

    describe('with a value of 3', () => {
      it('should add 6 and 12 months', () => {
        const reqMock = callMiddleware('3')
        checkBody(reqMock, 6, 12)
      })
    })

    describe('with a value of 4', () => {
      it('should add 12 and 24 months', () => {
        const reqMock = callMiddleware('4')
        checkBody(reqMock, 12, 24)
      })
    })

    describe('with a value of 5', () => {
      it('should not add any dates', () => {
        const reqMock = callMiddleware('5')

        expect(reqMock.body[QUERY_PARAM]).to.be.undefined
        expect(reqMock.body[START_DATE_PARAM]).to.be.undefined
        expect(reqMock.body[END_DATE_PARAM]).to.be.undefined
      })
    })
  })

  describe('a multi value param', () => {
    describe('With two known values', () => {
      it('Should add the correct values', () => {
        const reqMock = callMiddleware(['1', '3'])
        checkBody(reqMock, 1, 12)
      })
    })

    describe('With one unknown value', () => {
      it('Should add the known values', () => {
        const reqMock = callMiddleware(['1', '5'])
        checkBody(reqMock, 1, 3)
      })
    })
  })
})
