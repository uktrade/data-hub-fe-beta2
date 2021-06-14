import React from 'react'
import { connect } from 'react-redux'

import { INTERACTIONS__LOADED } from '../../../client/actions'

import { FilteredCollectionList } from '../../../client/components'

import { ID, state2props, TASK_GET_INTERACTIONS_LIST } from './state'

const InteractionCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_INTERACTIONS_LIST,
    id: ID,
    progressMessage: 'loading interactions',
    startOnRender: {
      payload,
      onSuccessDispatch: INTERACTIONS__LOADED,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="Interaction"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/interactions/export"
      entityName="interactions"
    ></FilteredCollectionList>
  )
}

export default connect(state2props)(InteractionCollection)
