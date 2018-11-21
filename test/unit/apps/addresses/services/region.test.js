describe('Region service', () => {
  describe('#getRegion', () => {
    beforeEach(() => {
      this.loggerErrorSpy = sinon.spy()

      this.region = proxyquire('~/src/apps/addresses/services/region.js', {
        '../../../../config': {
          regionLookup: {
            baseUrl: 'https://regions.com/pcode={postcode}',
          },
        },
        '../../../../config/logger': {
          error: this.loggerErrorSpy,
        },
      })
    })

    context('when the region service call is successful', () => {
      beforeEach(async () => {
        nock('https://regions.com')
          .get('/pcode=postcode')
          .reply(200, {
            region: 'West Midlands',
          })

        this.actual = await this.region.getRegion('postcode')
      })

      it('should return the region', () => {
        expect(this.actual).to.equal('West Midlands')
      })

      it('should not log an error', () => {
        expect(this.loggerErrorSpy).to.not.have.been.called
      })
    })

    context('when the region service call is successful', () => {
      beforeEach(async () => {
        nock('https://regions.com')
          .get('/pcode=postcode')
          .reply(500, 'Error message')

        this.actual = await this.region.getRegion('postcode')
      })

      it('should not return the region', () => {
        expect(this.actual).to.be.undefined
      })

      it('should log an error', () => {
        expect(this.loggerErrorSpy).to.have.been.calledOnce
        expect(this.loggerErrorSpy).to.have.been.calledWith(sinon.match({
          message: '500 - "Error message"',
        }))
      })
    })
  })
})
