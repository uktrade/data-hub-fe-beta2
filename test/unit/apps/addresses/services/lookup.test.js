describe('Address lookup service', () => {
  describe('#getAddresses', () => {
    beforeEach(() => {
      this.loggerErrorSpy = sinon.spy()

      this.lookup = proxyquire('~/src/apps/addresses/services/lookup.js', {
        '../../../../config': {
          postcodeLookup: {
            baseUrl: 'https://addresses.com/{postcode}?api-key={api-key}',
            apiKey: 'postcode_key',
          },
        },
        '../../../../config/logger': {
          error: this.loggerErrorSpy,
        },
      })
    })

    context('Address variation 1', () => {
      beforeEach(async () => {
        nock('https://addresses.com')
          .get('/postcode?api-key=postcode_key')
          .reply(200, {
            Addresses: [
              'zero, one, two, , , five, six',
            ],
          })

        this.actual = await this.lookup.getAddresses('postcode')
      })

      it('should return addresses', () => {
        expect(this.actual).to.deep.equal([
          {
            postcode: 'postcode',
            county: 'six',
            city: 'five',
            address1: 'zero - one',
            address2: 'two',
            id: 'zero, one, two, , , five, six',
            name: 'zero - one, two, five, six',
          },
        ])
      })
    })

    context('Address variation 2', () => {
      beforeEach(async () => {
        nock('https://addresses.com')
          .get('/postcode?api-key=postcode_key')
          .reply(200, {
            Addresses: [
              'zero, one, two, , , , ',
            ],
          })

        this.actual = await this.lookup.getAddresses('postcode')
      })

      it('should return addresses', () => {
        expect(this.actual).to.deep.equal([
          {
            postcode: 'postcode',
            address1: 'zero - one',
            address2: 'two',
            id: 'zero, one, two, , , , ',
            name: 'zero - one, two',
          },
        ])
      })
    })

    context('Address variation 3', () => {
      beforeEach(async () => {
        nock('https://addresses.com')
          .get('/postcode?api-key=postcode_key')
          .reply(200, {
            Addresses: [
              'zero, one, , , , five, ',
            ],
          })

        this.actual = await this.lookup.getAddresses('postcode')
      })

      it('should return addresses', () => {
        expect(this.actual).to.deep.equal([
          {
            postcode: 'postcode',
            city: 'five',
            address1: 'zero',
            address2: 'one',
            id: 'zero, one, , , , five, ',
            name: 'zero, one, five',
          },
        ])
      })
    })

    context('when the lookup API responds with an error', () => {
      beforeEach(async () => {
        nock('https://addresses.com')
          .get('/postcode?api-key=postcode_key')
          .reply(500, 'Error message')

        this.actual = await this.lookup.getAddresses('postcode')
      })

      it('should not return addresses', () => {
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
