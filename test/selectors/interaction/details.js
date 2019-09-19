exports.interaction = {
  actions: {
    completeInteraction: ({ companyId, interactionId }) => `[href="/companies/${companyId}/interactions/${interactionId}/complete"]`,
    editInteraction: ({ companyId, interactionId }, theme, kind) => `[href="/companies/${companyId}/interactions/${interactionId}/edit/${theme}/${kind}"]`,
    back: ({ companyId }) => `[href="/companies/${companyId}/interactions/"]`,
  },
  whyCanINotComplete: '[data-auto-id="interactionDetailsWhyCanINotComplete"]',
}

exports.serviceDelivery = {
  company: 'tr:nth-child(1)',
  contacts: 'tr:nth-child(2)',
  service: 'tr:nth-child(3)',
  notes: 'tr:nth-child(4)',
  dateOfInteraction: 'tr:nth-child(5)',
  ditAdviser: 'tr:nth-child(6)',
  communicationChannel: 'tr:nth-child(7)',
  documents: 'tr:nth-child(8)',
}
