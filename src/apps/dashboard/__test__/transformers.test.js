const { formatDistanceToNowStrict, parseISO } = require('date-fns')
const {
  formatHelpCentreAnnouncements,
} = require('../../../../src/apps/dashboard/transformers')
const { omit } = require('lodash')

describe('#formatHelpCentreAnnouncements', () => {
  const mockData = {
    count: 3,
    articles: [
      {
        id: 360001431697,
        url: 'https://helpcentre.com/api/v2/help_center/en-gb/articles/360001431697-Recording-policy-feedback-on-Data-Hub.json',
        html_url:
          'https://helpcentre.com/hc/en-gb/articles/360001431697-Recording-policy-feedback-on-Data-Hub',
        author_id: 7837434105,
        comments_disabled: true,
        draft: false,
        promoted: false,
        position: 0,
        vote_sum: 0,
        vote_count: 0,
        section_id: 360000018069,
        created_at: '2019-04-18T15:24:32Z',
        updated_at: '2019-04-18T15:24:35Z',
        name: 'Recording policy feedback on Data Hub',
        title: 'Recording policy feedback on Data Hub',
      },
      {
        id: 360001412918,
        url: 'https://helpcentre.com/api/v2/help_center/en-gb/articles/360001412918-Improvements-to-company-data-in-Data-Hub-April-2019.json',
        html_url:
          'https://helpcentre.com/hc/en-gb/articles/360001412918-Improvements-to-company-data-in-Data-Hub-April-2019',
        author_id: 17979367345,
        created_at: '2019-04-15T09:42:05Z',
        updated_at: '2019-04-18T14:30:29Z',
        name: 'Improvements to company data in Data Hub - April 2019',
        title: 'Improvements to company data in Data Hub - April 2019',
        source_locale: 'en-gb',
        locale: 'en-gb',
        outdated: false,
        outdated_locales: [],
        edited_at: '2019-04-18T14:30:29Z',
      },
      {
        id: 360001345138,
        url: 'https://helpcentre.com/api/v2/help_center/en-gb/articles/360001345138-Recording-multiple-DIT-advisers-against-interactions.json',
        html_url:
          'https://helpcentre.com/hc/en-gb/articles/360001345138-Recording-multiple-DIT-advisers-against-interactions',
        author_id: 9903012689,
        comments_disabled: true,
        vote_count: 0,
        section_id: 360000018069,
        created_at: '2019-04-03T12:16:23Z',
        updated_at: '2019-04-18T14:27:50Z',
        name: 'Recording multiple DIT advisers against interactions',
        title: 'Recording multiple DIT advisers against interactions',
        edited_at: '2019-04-18T14:27:50Z',
        label_names: [],
      },
    ],
    sort_by: 'position',
    sort_order: 'asc',
  }

  const expected = [
    {
      heading: 'Recording policy feedback on Data Hub',
      link: 'https://helpcentre.com/hc/en-gb/articles/360001431697-Recording-policy-feedback-on-Data-Hub',
      date: `${formatDistanceToNowStrict(
        parseISO(mockData.articles[0].created_at),
        {
          addSuffix: true,
        }
      )}`,
    },
    {
      heading: 'Improvements to company data in Data Hub - April 2019',
      link: 'https://helpcentre.com/hc/en-gb/articles/360001412918-Improvements-to-company-data-in-Data-Hub-April-2019',
      date: `${formatDistanceToNowStrict(
        parseISO(mockData.articles[1].created_at),
        {
          addSuffix: true,
        }
      )}`,
    },
    {
      heading: 'Recording multiple DIT advisers against interactions',
      link: 'https://helpcentre.com/hc/en-gb/articles/360001345138-Recording-multiple-DIT-advisers-against-interactions',
      date: `${formatDistanceToNowStrict(
        parseISO(mockData.articles[2].created_at),
        {
          addSuffix: true,
        }
      )}`,
    },
  ]
  context('Successful API response', () => {
    beforeEach(() => {
      this.transformed = formatHelpCentreAnnouncements({ data: mockData })
    })
    it('should format Help centre articles', () => {
      expect(this.transformed).to.deep.equal(expected)
    })
  })

  context('malformed api responses', () => {
    it('should return empty array', () => {
      expect(formatHelpCentreAnnouncements({ data: {} })).to.deep.equal([])
      expect(formatHelpCentreAnnouncements({ data: undefined })).to.deep.equal(
        []
      )
      expect(formatHelpCentreAnnouncements({ data: [] })).to.deep.equal([])
      expect(
        formatHelpCentreAnnouncements(omit(expected, ['articles']))
      ).to.deep.equal([])
    })
  })
})
