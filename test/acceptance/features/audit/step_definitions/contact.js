const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { merge, set } = require('lodash')

defineSupportCode(({ Given, Then, When }) => {
  const Message = client.page.Message()
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const ContactList = client.page.ContactList()
  const AuditContact = client.page.AuditContact()
  const AuditList = client.page.AuditList()
  const InvestmentStage = client.page.InvestmentStage()

  Given(/^I archive an existing contact record$/, async function () {
    await Company
      .navigate()
      .findCompany(this.fixtures.company.foreign.name)
    await ContactList
      .click('@contactsTab')
    await AuditList.section.lastContactInList
      .getText('@header', (result) => set(this.state, 'contactName', result.value))
      .click('@header')
    await InvestmentStage
      .click('@archiveButton')
    await AuditContact
      .click('@archiveReason')
      .submitForm('form')
    await Message
      .verifyMessage('success')
  })

  When(/^the contact has ([0-9]) fields edited for audit$/, async function (count) {
    await Contact
      .getText('@firstCompanyFromList', (result) => set(this.state, 'contactName', result.value))
      .click('@firstCompanyFromList')

    await AuditContact
      .editContactDetails({}, count, (contact) => {
        set(this.state, 'contact', merge({}, this.state.contact, contact))
      })
  })

  When(/^I search for this Contact record$/, async function () {
    await Company
      .navigate()
      .findCompany(this.state.contactName)
    await ContactList
      .click('@contactsTab')
    await Contact
      .click('@firstCompanyFromList')
    await AuditContact
      .getText('@userName', (result) => set(this.state, 'username', result.value))
  })

  When(/^I navigate to Audit History tab$/, async function () {
    await AuditContact
      .click('@auditHistoryTab')
  })

  When(/^I archive this contact record$/, async function () {
    await InvestmentStage
      .click('@archiveButton')
    await AuditContact
      .click('@archiveReason')
      .submitForm('form')
    await Message
      .verifyMessage('success')
  })

  When(/^I unarchive this contact record$/, async function () {
    await AuditContact
      .click('@unarchiveAnContactButton')
    await Message
      .verifyMessage('success')
  })

  Then(/^I see the name of the person who made the recent contact record changes$/, async function () {
    await AuditContact
      .getText('@userName', (result) => set(this.state, 'username', result.value))

    await AuditList.section.firstAuditInList
      .assert.containsText('@adviser', this.state.username)
  })

  Then(/^I see the date time stamp when the recent contact record changed$/, async function () {
    const today = format(new Date(), 'D MMM YYYY')
    await AuditList.section.firstAuditInList
      .assert.containsText('@header', today)
  })

  Then(/^I see the total number of changes occurred recently on this contact record$/, async function () {
    await AuditList.section.firstAuditInList
      .assert.containsText('@changeCount', '2 changes')
  })

  Then(/^I see the field names that were recently changed$/, async function () {
    await AuditList.section.firstAuditInList
      .assert.containsText('@fields', 'Phone number')
  })

  Then(/^I see the details who archived the contact$/, async function () {
    await AuditContact
      .getText('@userName', (result) => set(this.state, 'username', result.value))

    await AuditList.section.firstAuditInList
      .assert.containsText('@adviser', this.state.username)
  })

  Then(/^I see the details who unarchived the contact$/, async function () {
    await AuditContact
      .getText('@userName', (result) => set(this.state, 'username', result.value))

    await AuditList.section.firstAuditInList
      .assert.containsText('@adviser', this.state.username)
  })
})
