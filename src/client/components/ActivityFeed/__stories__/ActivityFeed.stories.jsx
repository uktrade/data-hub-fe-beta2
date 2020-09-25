import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Main from '@govuk-react/main'
import { SPACING } from '@govuk-react/constants'
import { ACTIVITY_TYPE_FILTERS } from '../constants'

import ActivityFeed from '../ActivityFeed'
import ActivityFeedAction from '../ActivityFeedAction'
import activityFeedFixtures from '../__fixtures__'
import datahubBackground from './images/data-hub-one-list-corp.png'
import accountsAreDueFixture from '../__fixtures__/companies_house/accounts_are_due.json'
import incorporatedFixture from '../__fixtures__/companies_house/incorporated.json'
import exportOfGoodsFixture from '../__fixtures__/hmrc/export_of_goods.json'
import interactionFixture from '../__fixtures__/interactions/interaction.json'
import investmentProjectFixture from '../__fixtures__/interactions/investment_project.json'
import serviceDeliveryFixture from '../__fixtures__/interactions/service_delivery.json'
import projectAddedFdiFixture from '../__fixtures__/investment_projects/project_added_fdi.json'
import projectAddedNonFdiFixture from '../__fixtures__/investment_projects/project_added_non_fdi.json'
import projectAddedCtiFixture from '../__fixtures__/investment_projects/project_added_cti.json'
import orderAddedFixture from '../__fixtures__/omis/order_added.json'
import completeReferralFixture from '../__fixtures__/referrals/completeReferral.json'
import outstandingReferralFixture from '../__fixtures__/referrals/outstandingReferral.json'

addDecorator(withKnobs)

/**
 * This component is used only for Storybook - to productionize your feature you'll also need to update
 * `ActivityFeedApp.jsx to reflect the changes.
 */
class ActivityFeedDemoApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activities: [],
      queryParams: {
        activityTypeFilter: ACTIVITY_TYPE_FILTERS.dataHubActivity.value,
        showDnbHierarchy: false,
      },
      isLoading: false,
      hasMore: true,
      offset: 0,
      error: false,
    }

    this.setFilterQueryParams = this.setFilterQueryParams.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
  }

  async componentDidMount() {
    await this.onLoadMore()
  }

  fetchActivities = (offset = 0, limit = 20, queryParams) => {
    const {
      allActivity,
      myActivity,
      externalActivity,
      dataHubActivity,
    } = ACTIVITY_TYPE_FILTERS

    const { activityTypeFilter } = queryParams

    const items = {
      [allActivity.value]: activityFeedFixtures,
      [myActivity.value]: [
        interactionFixture,
        completeReferralFixture,
        outstandingReferralFixture,
      ],
      [externalActivity.value]: [
        accountsAreDueFixture,
        incorporatedFixture,
        exportOfGoodsFixture,
      ],
      [dataHubActivity.value]: [
        completeReferralFixture,
        outstandingReferralFixture,
        interactionFixture,
        investmentProjectFixture,
        serviceDeliveryFixture,
        projectAddedFdiFixture,
        projectAddedNonFdiFixture,
        projectAddedCtiFixture,
        orderAddedFixture,
      ],
    }

    return new Promise((resolve) => {
      // Simulate delay.
      setTimeout(() => {
        resolve({
          activities: items[activityTypeFilter],
          offset,
          limit,
          total: 1000,
        })
      }, 1500)
    })
  }

  async onLoadMore() {
    const { offset } = this.state
    this.getActivities(offset)
  }

  getActivities = async (offset = 0) => {
    const { activities, queryParams } = this.state
    const limit = 20

    this.setState({
      isLoading: true,
    })

    try {
      const { activities: newActivities, total } = await this.fetchActivities(
        offset,
        limit,
        queryParams
      )
      const allActivities = offset
        ? activities.concat(newActivities)
        : newActivities

      this.setState({
        isLoading: false,
      })

      this.setState({
        activities: allActivities,
        hasMore: total > allActivities.length,
        offset: offset + limit,
        total,
      })
    } catch (e) {
      this.setState({
        isLoading: false,
        hasMore: false,
        error: true,
      })
    }
  }

  setFilterQueryParams(queryParams) {
    this.setState({ queryParams }, this.onFilterActivity)
  }

  async onFilterActivity() {
    this.getActivities()
  }

  render() {
    const { activities, isLoading, hasMore, error, total } = this.state
    const isEmptyFeed = activities.length === 0 && !hasMore

    const ActivityFeedActions = (
      <>
        <ActivityFeedAction text="Refer this company" link="/referral" />
        <ActivityFeedAction
          text="Add interaction"
          link="/companies/3335a773-a098-e211-a939-e4115bead28a/interactions/create"
        />
      </>
    )

    return (
      <div>
        <ActivityFeed
          sendQueryParams={this.setFilterQueryParams}
          activities={activities}
          activityTypeFilters={ACTIVITY_TYPE_FILTERS}
          totalActivities={total}
          hasMore={hasMore}
          onLoadMore={this.onLoadMore}
          isLoading={isLoading}
          actions={ActivityFeedActions}
          dnbHierarchyCount={8}
          isGlobalUltimate={true}
          isTypeFilterFlagEnabled={true}
          isGlobalUltimateFlagEnabled={true}
        >
          {isEmptyFeed && !error && <div>There are no activities to show.</div>}
          {error && <div>Error occurred while loading activities.</div>}
        </ActivityFeed>
      </div>
    )
  }
}

storiesOf('ActivityFeed', module)
  .add('Entire feed', () => <ActivityFeedDemoApp />)
  .add('Data Hub company page', () => (
    <Main>
      <GridRow>
        <GridCol>
          <img src={datahubBackground} width="960" alt="DataHub" />
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol style={{ margin: SPACING.SCALE_2 }}>
          <ActivityFeedDemoApp />
        </GridCol>
      </GridRow>
    </Main>
  ))
  .add('Empty feed', () => <ActivityFeed />)
  .add('With error', () => {
    class ActivityFeedErrorDemoApp extends ActivityFeedDemoApp {
      fetchActivities = () => {
        throw new Error('Fake error!')
      }
    }
    return <ActivityFeedErrorDemoApp />
  })
