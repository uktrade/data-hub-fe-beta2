const investmentProjectsData = require('../../../../../test/unit/data/investment/collection.json')
const {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToDisableMetaLinks,
} = require('../collection')

describe('Investment project transformers', () => {
  describe('#transformInvestmentProjectToListItem', () => {
    context('when transforming a fully populated project', () => {
      beforeEach(() => {
        this.rawItem = investmentProjectsData.results[0]
        const transformed = investmentProjectsData.results.map(
          transformInvestmentProjectToListItem
        )
        this.transformedItem = transformed[0]
      })

      it('should provide the id', () => {
        expect(this.transformedItem.id).to.equal(this.rawItem.id)
      })

      it('should provide the name', () => {
        expect(this.transformedItem.name).to.equal(this.rawItem.name)
      })

      it('should list the stage as a badge', () => {
        expect(this.transformedItem.meta[0]).to.deep.equal({
          label: 'Stage',
          type: 'badge',
          value: this.rawItem.stage,
        })
      })

      it('should list the investment type as a badge', () => {
        expect(this.transformedItem.meta[1]).to.deep.equal({
          label: 'Investment type',
          type: 'badge',
          badgeModifier: 'secondary',
          value: this.rawItem.investment_type,
        })
      })

      it('should list the investor company', () => {
        expect(this.transformedItem.meta[2]).to.deep.equal({
          label: 'Investor',
          value: this.rawItem.investor_company,
        })
      })

      it('should list the sector', () => {
        expect(this.transformedItem.meta[3]).to.deep.equal({
          label: 'Sector',
          value: this.rawItem.sector,
        })
      })

      it('should list the estimated land date as date', () => {
        expect(this.transformedItem.meta[4]).to.deep.equal({
          label: 'Estimated land date',
          type: 'dateMonthYear',
          value: this.rawItem.estimated_land_date,
          isInert: true,
        })
      })

      it('should list the project code', () => {
        expect(this.transformedItem.subTitle).to.deep.equal({
          label: 'Project code',
          value: this.rawItem.project_code,
        })
      })
    })
  })

  describe('#transformInvestmentListItemToDisableMetaLinks', () => {
    it('should mark any metaItem as inert', () => {
      const item = {
        id: '1234',
        meta: [
          {
            name: 'item',
          },
        ],
      }

      const transformedItem =
        transformInvestmentListItemToDisableMetaLinks(item)
      expect(transformedItem.meta[0].isInert).to.equal(true)
    })
  })
})
