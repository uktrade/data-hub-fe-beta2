export default {
  'Resource example': (id) =>
    new Promise((resolve, reject) =>
      id.match('reject')
        ? setTimeout(reject, 1000, 'Could not load resource')
        : setTimeout(resolve, 1000, {
            example: 'This is a dummy resource representation example',
          })
    ),
  Contact: (id) => {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            id,
            companyId: '008ba003-b528-4e79-b209-49fcfcceb371',
            companyName: 'Little Britain',
            firstName: 'Andy',
            lastName: 'Pipkin',
            jobTitle: 'Unemployed',
            primary: false,
            telephoneCountrycode: '123',
            telephoneNumber: '456789',
            email: 'andy.pipkin@littlebritain.co.uk',
            acceptsDitEmailMarketing: true,
            addressSameAsCompany: true,
            address1: 'Foo',
            address2: 'Bar',
            addressTown: 'Town',
            addressCounty: 'County',
            addressPostcode: null,
            addressCountry: '87756b9a-5d95-e211-a939-e4115bead28a',
            telephoneAlternative: '33333',
            emailAlternative: 'alternative@email.keket',
            notes: 'Notes',
          }),
        2000
      )
    )
  },
  Company: (id) => {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            id,
            referenceCode: '',
            name: 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978',
            tradingName: '',
            tradingNames: [],
            ukBased: true,
            companyNumber: 'BR100000',
            vatNumber: '',
            dunsNumber: null,
            createdOn: '2019-01-09T09:45:06.080938Z',
            modifiedOn: '2019-01-09T09:45:06.080969Z',
            archived: false,
            archivedDocumentsUrlPath: '',
            archivedOn: null,
            archivedReason: null,
            archivedBy: null,
            description: 'Doloribus accusamus qui non nam et earum inventore.',
            transferredBy: null,
            transferredOn: null,
            transferredTo: null,
            transferReason: '',
            website: 'http://jamaal.biz',
            businessType: {
              name: 'UK branch of foreign company (BR)',
              id: 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98',
            },
            oneListGroupTier: null,
            contacts: [
              {
                id: '0e75d636-1d24-416a-aaf0-3fb220d594ce',
                title: null,
                firstName: 'Bob',
                lastName: 'lawson',
                name: 'Bob lawson',
                jobTitle: 'Magician',
                company: {
                  name: 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978',
                  id: '4cd4128b-1bad-4f1e-9146-5d4678c6a018',
                },
                adviser: {
                  name: 'DIT Staff',
                  firstName: 'DIT',
                  lastName: 'Staff',
                  id: '7d19d407-9aec-4d06-b190-d3f404627f21',
                },
                primary: true,
                telephoneCountrycode: '222',
                telephoneNumber: '3453454',
                email: 'contact@bob.com',
                addressSameAsCompany: true,
                address1: null,
                address2: null,
                addressTown: null,
                addressCounty: null,
                addressCountry: null,
                addressPostcode: null,
                telephoneAlternative: null,
                emailAlternative: null,
                notes: null,
                acceptsDitEmailMarketing: false,
                archived: false,
                archivedDocumentsUrlPath: '',
                archivedOn: null,
                archivedReason: null,
                archivedBy: null,
                createdOn: '2019-02-04T15:59:14.267412Z',
                modifiedOn: '2019-02-05T13:17:23.112153Z',
              },
            ],
            employeeRange: {
              name: '50 to 249',
              id: '3fafd8d0-5d95-e211-a939-e4115bead28a',
            },
            numberOfEmployees: null,
            isNumberOfEmployeesEstimated: null,
            exportToCountries: [],
            futureInterestCountries: [],
            headquarterType: null,
            oneListGroupGlobalAccountManager: null,
            globalHeadquarters: null,
            sector: {
              name:
                'Biotechnology and Pharmaceuticals : Bio and Pharma Marketing and Sales : Bio and Pharma Retail',
              id: '70f7ffde-5f95-e211-a939-e4115bead28a',
            },
            turnoverRange: {
              name: '£1.34 to £6.7M',
              id: '784cd12a-6095-e211-a939-e4115bead28a',
            },
            turnover: null,
            isTurnoverEstimated: null,
            ukRegion: {
              name: 'London',
              id: '874cd12a-6095-e211-a939-e4115bead28a',
            },
            exportExperienceCategory: null,
            address: {
              line1: '3 Priory Court',
              line2: 'Kingshill Road',
              town: 'Dursley',
              county: 'Gloucestershire',
              postcode: 'GL11 4DH',
              country: {
                name: 'United Kingdom',
                id: '80756b9a-5d95-e211-a939-e4115bead28a',
              },
            },
            registeredAddress: {
              line1: '3 Priory Court',
              line2: 'Kingshill Road',
              town: 'Dursley',
              county: 'Gloucestershire',
              postcode: 'GL11 4DH',
              country: {
                name: 'United Kingdom',
                id: '80756b9a-5d95-e211-a939-e4115bead28a',
              },
            },
          }),
        2000
      )
    )
  },
}
