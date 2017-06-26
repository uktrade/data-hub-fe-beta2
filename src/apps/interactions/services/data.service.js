/* eslint camelcase: 0, prefer-promise-reject-errors: 0 */
const companyRepository = require('../../companies/repository')
const contactsRepository = require('../../contacts/contacts.repo')
const metadataRepository = require('../../../lib/metadata')
const interactionRepository = require('../interactions.repo')

function getInteractionType (interactionTypeId) {
  for (const interactionType of metadataRepository.interactionTypeOptions) {
    if (interactionType.id === interactionTypeId) {
      return interactionType
    }
  }
  return null
}

function getHydratedInteraction (token, interactionId) {
  return new Promise(async (resolve, reject) => {
    try {
      const interaction = await interactionRepository.getInteraction(token, interactionId)
      interaction.company = await companyRepository.getDitCompany(token, interaction.company.id)
      resolve(interaction)
    } catch (error) {
      reject(error)
    }
  })
}

function createBlankInteractionForContact (token, dit_adviser, interaction_type, contactId) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!contactId || !interaction_type || !token) {
        return reject('Missing parameter')
      }

      const contact = await contactsRepository.getContact(token, contactId)

      if (!contact.company || !contact.company.id) {
        return reject('Invalid contact')
      }

      const company = await companyRepository.getDitCompany(token, contact.company.id)
      const interaction_type_obj = getInteractionType(interaction_type)
      resolve({
        contact,
        company,
        interaction_type: interaction_type_obj,
        dit_adviser,
        date: new Date(),
        service: {
          id: null,
          name: null,
        },
        dit_team: {
          id: null,
          name: null,
        },
      })
    } catch (error) {
      reject(error)
    }
  })
}

function createBlankInteractionForCompany (token, dit_adviser, interaction_type, companyId) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!companyId || !interaction_type || !token) {
        return reject('Missing parameter')
      }

      const company = await companyRepository.getDitCompany(token, companyId)
      const interaction_type_obj = getInteractionType(interaction_type)
      resolve({
        company,
        contact: null,
        interaction_type: interaction_type_obj,
        dit_adviser,
        date: new Date(),
        service: {
          id: null,
          name: null,
        },
        dit_team: {
          id: null,
          name: null,
        },
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  getInteractionType,
  getHydratedInteraction,
  createBlankInteractionForCompany,
  createBlankInteractionForContact,
}
