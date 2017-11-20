const address = require('~/src/lib/address')

describe('Address formatter', function () {
  it('should format an address when it is fully populated.', function () {
    const source = {
      id: '12651151-2149-465e-871b-ac45bc568a62',
      address_1: '10 The Street',
      address_2: 'Warble',
      address_town: 'Big Town',
      address_county: 'Large County',
      address_country: {
        id: '1234',
        name: 'Country',
      },
      address_postcode: 'LL1 1LL',
    }
    const actual = address.getFormattedAddress(source)
    expect(actual).equal('10 the Street, Warble, Big Town, Large County, LL1 1LL, Country')
  })
  it('ignores blank address lines', function () {
    const source = {
      id: '12651151-2149-465e-871b-ac45bc568a62',
      address_1: '10 The Street',
      address_2: '',
      address_town: 'Big Town',
      address_county: '',
      address_country: {
        id: '1234',
        name: 'Country',
      },
      address_postcode: 'LL1 1LL',
    }
    const actual = address.getFormattedAddress(source)
    expect(actual).equal('10 the Street, Big Town, LL1 1LL, Country')
  })
  it('should add United Kingdom to the address if no country is provided.', function () {
    const source = {
      id: '12651151-2149-465e-871b-ac45bc568a62',
      address_1: '10 The Street',
      address_2: 'Warble',
      address_town: 'Big Town',
      address_county: 'Large County',
      address_postcode: 'LL1 1LL',
    }
    const actual = address.getFormattedAddress(source)
    expect(actual).equal('10 the Street, Warble, Big Town, Large County, LL1 1LL')
  })
  it('should format an address with field names containing a prefix', function () {
    const source = {
      id: '12651151-2149-465e-871b-ac45bc568a62',
      trading_address_1: '10 The Street',
      trading_address_2: 'Warble',
      trading_address_town: 'Big Town',
      trading_address_county: 'Large County',
      trading_address_postcode: 'LL1 1LL',
    }

    const actual = address.getFormattedAddress(source, 'trading')
    expect(actual).equal('10 the Street, Warble, Big Town, Large County, LL1 1LL')
  })
  it('should return null when the address is empty', function () {
    const source = {
      id: '12651151-2149-465e-871b-ac45bc568a62',
      address_1: '',
      address_2: '',
      address_town: '',
      address_county: '',
      address_postcode: '',
    }
    const actual = address.getFormattedAddress(source)
    expect(actual).to.be.null
  })
})
