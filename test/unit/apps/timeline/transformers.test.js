const { transformTimelineToListItem } = require('~/src/apps/timeline/transformers')

describe('Timeline transformers', () => {
  context('when called with a valid source', () => {
    beforeEach(() => {
      this.actual = transformTimelineToListItem({
        data_source_label: 'Companies House (Companies)',
        datetime: '2017-02-04T00:00:00Z',
        description: 'Returns next due date',
      })
    })

    it('should transform the response to a timeline list item', () => {
      expect(this.actual).to.deep.equal({
        type: 'timeline',
        name: '4 Feb 2017',
        contentMetaModifier: 'stacked',
        meta: [
          {
            label: 'Source',
            value: 'Companies House (Companies)',
          },
          {
            label: 'Description',
            value: 'Returns next due date',
          },
        ],
      })
    })
  })

  context('when called for an unknown source', () => {
    beforeEach(() => {
      this.actual = transformTimelineToListItem({
        data_source: 'xyz',
        datetime: '2017-02-04T00:00:00Z',
        description: 'Returns next due date',
      })
    })

    it('should transform the response to a timeline list item without a source', () => {
      expect(this.actual).to.deep.equal({
        type: 'timeline',
        name: '4 Feb 2017',
        contentMetaModifier: 'stacked',
        meta: [
          {
            label: 'Source',
            value: undefined,
          },
          {
            label: 'Description',
            value: 'Returns next due date',
          },
        ],
      })
    })
  })

  context('when called with no source', () => {
    beforeEach(() => {
      this.actual = transformTimelineToListItem({
        datetime: '2017-02-04T00:00:00Z',
        description: 'Returns next due date',
      })
    })

    it('should transform the response to a timeline list item without a source', () => {
      expect(this.actual).to.deep.equal({
        type: 'timeline',
        name: '4 Feb 2017',
        contentMetaModifier: 'stacked',
        meta: [
          {
            label: 'Source',
            value: undefined,
          },
          {
            label: 'Description',
            value: 'Returns next due date',
          },
        ],
      })
    })
  })
})
