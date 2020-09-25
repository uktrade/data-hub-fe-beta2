import CardUtils from '../CardUtils'

describe('CardUtils.js', () => {
  describe('#canRenderByTypes', () => {
    describe('when the type exists', () => {
      test('should return true', () => {
        const actual = CardUtils.canRenderByTypes(
          {
            object: {
              type: ['Event', 'dit:Interaction'],
            },
          },
          ['dit:Interaction']
        )

        expect(actual).toBeTruthy()
      })
    })

    describe('when the type does not exist', () => {
      test('should return false', () => {
        const actual = CardUtils.canRenderByTypes(
          {
            object: {
              type: ['Event', 'dit:Interaction'],
            },
          },
          ['dit:InvestmentProject']
        )

        expect(actual).toBeFalsy()
      })
    })
  })

  describe('#transform', () => {
    test('should transform', () => {
      const actual = CardUtils.transform({
        object: {
          url: 'url',
          'dit:subject': 'subject',
          'dit:service': {
            name: 'service',
          },
          startTime: '2019-06-17T15:44:27.298Z',
        },
      })

      expect(actual).toEqual({
        url: 'url',
        subject: 'subject',
        service: 'service',
        startTime: '2019-06-17T15:44:27.298Z',
      })
    })
  })
})
