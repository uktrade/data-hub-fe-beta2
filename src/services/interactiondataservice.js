/* eslint camelcase: 0 */
const Q = require('q')
const companyRepository = require('../repositorys/companyrepository')
const contactRepository = require('../repositorys/contactrepository')
const metadataRepository = require('../repositorys/metadatarepository')
const interactionRepository = require('../repositorys/interactionrepository')

function getInteractionType (interactionTypeId) {
  for (const interactionType of metadataRepository.interactionTypeOptions) {
    if (interactionType.id === interactionTypeId) {
      return interactionType
    }
  }
  return null
}

function getHydratedInteraction (token, interactionId) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        const interaction = yield interactionRepository.getInteraction(token, interactionId)
        interaction.company = yield companyRepository.getDitCompany(token, interaction.company.id)
        resolve(interaction)
      } catch (error) {
        reject(error)
      }
    })
  })
}

function createBlankInteractionForContact (token, dit_advisor, interaction_type, contactId) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        if (!contactId || !interaction_type || !token) {
          return reject('Missing parameter')
        }

        const contact = yield contactRepository.getContact(token, contactId)

        if (!contact.company || !contact.company.id) {
          return reject('Invalid contact')
        }

        const company = yield companyRepository.getDitCompany(token, contact.company.id)
        const interaction_type_obj = getInteractionType(interaction_type)
        resolve({
          contact,
          company,
          interaction_type: interaction_type_obj,
          dit_advisor,
          date: new Date(),
          service: {
            id: null,
            name: null
          },
          dit_team: {
            id: null,
            name: null
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

function createBlankInteractionForCompany (token, dit_advisor, interaction_type, companyId) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        if (!companyId || !interaction_type || !token) {
          return reject('Missing parameter')
        }

        const company = yield companyRepository.getDitCompany(token, companyId)
        const interaction_type_obj = getInteractionType(interaction_type)
        resolve({
          company,
          contact: null,
          interaction_type: interaction_type_obj,
          dit_advisor,
          date: new Date(),
          service: {
            id: null,
            name: null
          },
          dit_team: {
            id: null,
            name: null
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = {
  getInteractionType,
  getHydratedInteraction,
  createBlankInteractionForCompany,
  createBlankInteractionForContact
}
