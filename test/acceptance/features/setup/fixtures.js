/**
 * Easily reference fixtures provided to the UAT tests
 * @type {}
 */
module.exports = {
  company: {
    companiesHouse: {
      name: 'Exobite Skeletons Ltd',
      address1: '999 Juliet Street',
      town: 'Llangefni',
      postcode: 'LL77 5RN',
      country: 'United Kingdom',
    },
    foreign: {
      pk: '0fb3379c-341c-4da4-b825-bf8d47b26baa',
      name: 'Lambda plc',
      address1: '12 St George\'s Road',
      town: 'Paris',
      postcode: '75001',
      country: 'France',
      primaryAddress: '12 St George\'s Road, Paris, 75001, France',
      businessType: 'Company',
      headquarterType: 'Not a headquarters',
      sector: 'Retail',
      description: 'This is a dummy company for testing',
      employeeRange: '500+',
      turnoverRange: '£33.5M+',
      currentlyExportingTo: 'France, Germany',
      futureCountriesOfInterest: 'Yemen',
    },
    foreignOther: {
      pk: 'b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
      name: 'Mars Exports Ltd',
      address1: '12 First Street',
      town: 'New York',
      postcode: '765413',
      country: 'United States',
    },
    ukLtd: {
      pk: '0f5216e0-849f-11e6-ae22-56b6b6499611',
      name: 'Venus Ltd',
      address1: '66 Marcham Road',
      town: 'Bordley',
      postcode: 'BD23 8RZ',
      country: 'United Kingdom',
      primaryAddress: '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom',
      ukRegion: 'North West',
      headquarterType: 'Not a headquarters',
      sector: 'Retail',
      description: 'This is a dummy company for testing',
      referenceCode: 'ORG-10096257',
    },
  },
  contact: {
    georginaClark: {
      pk: '048f2edc-e7ed-4881-b1cc-29142a80238a',
      name: 'Georgina Clark',
    },
    johnnyCakeman: {
      pk: '9b1138ab-ec7b-497f-b8c3-27fed21694ef',
      name: 'Johnny Cakeman',
    },
  },
  event: {
    oneDayExhibition: {
      pk: 'b93d4273-36fe-4008-ac40-fbc197910791',
      name: 'One-day exhibition',
    },
    grandExhibition: {
      pk: 'bda12a57-433c-4a0c-a7ce-5ebd080e09e8',
      name: 'Grand exhibition',
    },
  },
  interaction: {
    attendedGammaEvent: {
      pk: 'ec4a46ef-6e50-4a5c-bba0-e311f0471312',
      company: 'Venus Ltd',
      contact: 'Johnny Cakeman',
      serviceProvider: 'CBBC North EAST',
      service: 'Events - UK Based',
      subject: 'Attended gamma event',
      name: 'Attended gamma event',
      notes: 'This is a dummy service delivery for testing',
      date: '5 September 2017',
      ditAdviser: 'Puck Head',
      event: 'Grand exhibition',
      documents: 'View files and documents (will open another website)',
    },
    grandExhibition: {
      pk: '0dcb3748-c097-4f20-b84f-0114bbb1a8e0',
      subject: 'Provided funding information',
    },
    tapGrant: {
      pk: 'aa350238-5d84-4bed-be68-b08dea7ea6d5',
      company: 'Venus Ltd',
      contact: 'Dean Cox',
      serviceProvider: 'Marketing - Marketing Team',
      service: 'Tradeshow Access Programme (TAP)',
      serviceStatus: 'Offered',
      grantOffered: '£2,500.00',
      subject: 'TAP grant',
      name: 'TAP grant',
      notes: 'This is a dummy service delivery for testing',
      date: '15 September 2017',
      ditAdviser: 'John Rogers',
      event: 'No',
      documents: 'There are no files or documents',
    },
  },
  investmentProject: {
    newHotelCommitmentToInvest: {
      pk: 'fb5b5006-56af-40e0-8615-7aba53e0e4bf',
      name: 'New hotel (commitment to invest)',
    },
    newRollercoaster: {
      pk: '0e686ea4-b8a2-4337-aec4-114d92ad4588',
      name: 'New rollercoaster',
    },
    newHotelFdi: {
      pk: '721e2a04-21c3-4172-a321-4368463a4b2d',
      name: 'New hotel (FDI)',
    },
    newGolfCourse: {
      pk: 'e32b3c33-80ac-4589-a8c4-dda305d726ba',
      name: 'New golf course (DA)',
    },
    newZoo: {
      pk: 'ba1f0b14-5fe4-4c36-bf6a-ddf115272977',
      name: 'New zoo (LEP)',
    },
  },
}
