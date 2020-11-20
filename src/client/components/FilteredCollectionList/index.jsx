/* eslint-disable react/no-array-index-key */
// this is because there isn't necessarily a unique id to use as the key

import React from 'react'
import PropTypes from 'prop-types'

import { GridRow, GridCol } from 'govuk-react'
import Task from '../../../client/components/Task'

import {
  CollectionSort,
  CollectionItem,
  RoutedPagination,
  FilteredCollectionHeader,
} from '../../components'

const FilteredCollectionList = ({
  results = [],
  itemsPerPage = 10,
  sortOptions = null,
  taskProps,
  count = 0,
  isComplete,
  children,
  collectionName,
  activePage = 1,
  selectedAdvisers,
  selectedSectors,
  estimatedLandDateBefore,
  estimatedLandDateAfter,
}) => {
  const totalPages = Math.ceil(count / itemsPerPage)
  return (
    <GridRow>
      {children}
      <GridCol setWidth="two-thirds">
        <article>
          {isComplete && (
            <FilteredCollectionHeader
              totalItems={count}
              collectionName={collectionName}
              selectedAdvisers={selectedAdvisers}
              selectedSectors={selectedSectors}
              estimatedLandDateBefore={estimatedLandDateBefore}
              estimatedLandDateAfter={estimatedLandDateAfter}
            />
          )}
          {sortOptions && (
            <CollectionSort sortOptions={sortOptions} totalPages={count} />
          )}
          <Task.Status {...taskProps}>
            {() =>
              isComplete && (
                <>
                  {results.map((item, i) => (
                    <CollectionItem {...item} key={i} />
                  ))}
                  <RoutedPagination
                    qsParamName="page"
                    totalPages={totalPages}
                    activePage={activePage}
                  />
                </>
              )
            }
          </Task.Status>
        </article>
      </GridCol>
    </GridRow>
  )
}

FilteredCollectionList.propTypes = {
  taskProps: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    progressMessage: PropTypes.string,
    startOnRender: PropTypes.shape({
      payload: PropTypes.shape({
        page: PropTypes.string,
        filters: PropTypes.object,
        search: PropTypes.string,
      }).isRequired,
      onSuccessDispatch: PropTypes.string,
    }).isRequired,
  }),
  isComplete: PropTypes.bool,
  children: PropTypes.node,
  collectionName: PropTypes.string,
  router: PropTypes.shape({
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired,
    }),
  }),
  maxItemsToDownload: PropTypes.number,
}

export default FilteredCollectionList
