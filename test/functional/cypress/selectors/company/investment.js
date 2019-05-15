module.exports = {
  tabs: {
    investmentProjects: '[data-auto-id="bodyMainContent"] li:nth-child(1)',
    largeCapitalProfile: '[data-auto-id="bodyMainContent"] li:nth-child(2)',
    growthCapitalProfile: '[data-auto-id="bodyMainContent"] li:nth-child(3)',
  },
  subHeading: '[data-auto-id="bodyMainContent"] h2',
  createAProfile: '[data-auto-id="bodyMainContent"] button',
  investorDetails: {
    incompleteFields: '[data-auto-id=investorDetails] .incomplete-fields',
    summary: '[data-auto-id=investorDetails] summary',
    edit: '[data-auto-id=investorDetailsEdit]',
    save: '[data-auto-id=investorDetailsSave]',
    investorType: '[data-auto-id=investorType]',
    globalAssetsUnderManagement: '[data-auto-id=globalAssetsUnderManagement]',
    investableCapital: '[data-auto-id=investableCapital]',
    investorDescription: '[data-auto-id=investorDescription]',
    requiredChecks: {
      cleared: '[data-auto-id=requiredChecks] #conducted-1',
      clearedDay: '[data-auto-id=requiredChecksCleared] #cleared-day',
      clearedMonth: '[data-auto-id=requiredChecksCleared] #cleared-month',
      clearedYear: '[data-auto-id=requiredChecksCleared] #cleared-year',
      issuesIdentified: '[data-auto-id=requiredChecks] #conducted-2',
      notYetChecked: '[data-auto-id=requiredChecks] #conducted-3',
      notRequired: '[data-auto-id=requiredChecks] #conducted-4',
      adviser: {
        placeHolder: '#conditional-conducted-1 .multiselect__tags',
        textInput: '#conditional-conducted-1 .multiselect__input',
        selectedOption: '#conditional-conducted-1 .multiselect__single',
      },
    },
    taskList: {
      investorType: {
        name: '[data-auto-id="investorDetails"] ul > li:nth-child(1) .task-list__item-name',
        complete: '[data-auto-id="investorDetails"] ul > li:nth-child(1) .task-list__item-complete',
        incomplete: '[data-auto-id="investorDetails"] ul > li:nth-child(1) .task-list__item-incomplete',
      },
      globalAssetsUnderManagement: {
        name: '[data-auto-id="investorDetails"] ul > li:nth-child(2) .task-list__item-name',
        complete: '[data-auto-id="investorDetails"] ul > li:nth-child(2) .task-list__item-complete',
        incomplete: '[data-auto-id="investorDetails"] ul > li:nth-child(2) .task-list__item-incomplete',
      },
      investableCapital: {
        name: '[data-auto-id="investorDetails"] ul > li:nth-child(3) .task-list__item-name',
        complete: '[data-auto-id="investorDetails"] ul > li:nth-child(3) .task-list__item-complete',
        incomplete: '[data-auto-id="investorDetails"] ul > li:nth-child(3) .task-list__item-incomplete',
      },
      investorDescription: {
        name: '[data-auto-id="investorDetails"] ul > li:nth-child(4) .task-list__item-name',
        complete: '[data-auto-id="investorDetails"] ul > li:nth-child(4) .task-list__item-complete',
        incomplete: '[data-auto-id="investorDetails"] ul > li:nth-child(4) .task-list__item-incomplete',
      },
      requiredChecks: {
        name: '[data-auto-id="investorDetails"] ul > li:nth-child(5) .task-list__item-name',
        complete: '[data-auto-id="investorDetails"] ul > li:nth-child(5) .task-list__item-complete',
        completeDate: '[data-auto-id="investorDetails"] ul > li:nth-child(5) span:nth-child(3)',
        adviser: '[data-auto-id="investorDetails"] ul > li:nth-child(5) span:nth-child(4)',
        incomplete: '[data-auto-id="investorDetails"] ul > li:nth-child(5) .task-list__item-incomplete',
      },
    },
  },
  investorRequirements: {
    incompleteFields: '[data-auto-id=investorRequirements] .incomplete-fields',
    summary: '[data-auto-id=investorRequirements] summary',
    edit: '[data-auto-id=investorRequirementsEdit]',
    save: '[data-auto-id=investorRequirementsSave]',
    dealTicketSize: {
      upTo49Million: '[data-auto-id=dealTicketSizes] #dealTicketSizes-1',
      fiftyTo99Million: '[data-auto-id=dealTicketSizes] #dealTicketSizes-2',
      oneHundredTo249Million: '[data-auto-id=dealTicketSizes] #dealTicketSizes-3',
      twoHundredFiftyTo499Million: '[data-auto-id=dealTicketSizes] #dealTicketSizes-4',
      fiveHundredTo999Million: '[data-auto-id=dealTicketSizes] #dealTicketSizes-5',
      oneBillionPlus: '[data-auto-id=dealTicketSizes] #dealTicketSizes-6',
    },
    taskList: {
      dealTicketSize: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(1) .task-list__item-name',
        incomplete: '[data-auto-id=investorRequirements] ul > li:nth-child(1) .task-list__item-incomplete',
        upTo49Million: '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(2)',
        fiftyTo99Million: '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(3)',
        oneHundredTo249Million: '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(4)',
        twoHundredFiftyTo499Million: '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(5)',
        fiveHundredTo999Million: '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(6)',
        oneBillionPlus: '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(7)',
      },
      assetClassesOfInterest: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(2) .task-list__item-name',
        incomplete: '[data-auto-id=investorRequirements] ul > li:nth-child(2) .task-list__item-incomplete',
      },
      typesOfInvestment: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(3) .task-list__item-name',
        incomplete: '[data-auto-id=investorRequirements] ul > li:nth-child(3) .task-list__item-incomplete',
      },
      minimumReturnRate: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(4) .task-list__item-name',
        incomplete: '[data-auto-id=investorRequirements] ul > li:nth-child(4) .task-list__item-incomplete',
      },
      timeHorizonTenor: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(5) .task-list__item-name',
        incomplete: '[data-auto-id=investorRequirements] ul > li:nth-child(5) .task-list__item-incomplete',
      },
      restrictionsConditions: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(6) .task-list__item-name',
        incomplete: '[data-auto-id=investorRequirements] ul > li:nth-child(6) .task-list__item-incomplete',
      },
      constructionRisk: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(7) .task-list__item-name',
        incomplete: '[data-auto-id=investorRequirements] ul > li:nth-child(7) .task-list__item-incomplete',
      },
      minimumEquityPercentage: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(8) .task-list__item-name',
        incomplete: '[data-auto-id=investorRequirements] ul > li:nth-child(8) .task-list__item-incomplete',
      },
      desiredDealRole: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(9) .task-list__item-name',
        incomplete: '[data-auto-id=investorRequirements] ul > li:nth-child(9) .task-list__item-incomplete',
      },
    },
  },
  location: {
    incompleteFields: '[data-auto-id=location] .incomplete-fields',
    summary: '[data-auto-id=location] summary',
    edit: '[data-auto-id=locationEdit]',
    save: '[data-auto-id=locationSave]',
    taskList: {
      ukLocationsOfInterest: {
        name: '[data-auto-id=location] ul > li:nth-child(1) .task-list__item-name',
        incomplete: '[data-auto-id=location] ul > li:nth-child(1) .task-list__item-incomplete',
      },
      otherCountriesTheInvestorIsConsidering: {
        name: '[data-auto-id=location] ul > li:nth-child(2) .task-list__item-name',
        incomplete: '[data-auto-id=location] ul > li:nth-child(2) .task-list__item-incomplete',
      },
      notesOnInvestorsLocationPreferences: {
        name: '[data-auto-id=location] ul > li:nth-child(3) .task-list__item-name',
        incomplete: '[data-auto-id=location] ul > li:nth-child(3) .task-list__item-incomplete',
      },
    },
  },
}
