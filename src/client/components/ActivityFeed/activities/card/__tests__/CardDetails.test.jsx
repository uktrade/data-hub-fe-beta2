import React from 'react'
import renderer from 'react-test-renderer'
import CardDetails from '../CardDetails'

describe('CardDetails', () => {
  describe('when the details for all activities are hidden', () => {
    test('should open the card details', () => {
      const tree = renderer
        .create(
          <CardDetails
            summary="View interaction details"
            showDetails={false}
            link={{ text: 'Go to the interaction detail page', url: '#' }}
          >
            <p>children</p>
          </CardDetails>
        )
        .toJSON()

      expect(tree).toMatchSnapshot()
    })
  })

  describe('when the details for all activities are shown', () => {
    test('should open the card details', () => {
      const tree = renderer
        .create(
          <CardDetails
            summary="View interaction details"
            showDetails={true}
            link={{ text: 'Go to the interaction detail page', url: '#' }}
          >
            <p>children</p>
          </CardDetails>
        )
        .toJSON()

      expect(tree).toMatchSnapshot()
    })
  })

  describe('when link provided', () => {
    test('should render the card', () => {
      const tree = renderer
        .create(
          <CardDetails
            summary="View interaction details"
            showDetails={false}
            link={{ text: 'Go to the interaction detail page', url: '#' }}
          >
            <p>children</p>
          </CardDetails>
        )
        .toJSON()

      expect(tree).toMatchSnapshot()
    })
  })

  describe('when no link provided', () => {
    test('should still render the card', () => {
      const tree = renderer
        .create(
          <CardDetails summary="View interaction details" showDetails={false}>
            <p>children</p>
          </CardDetails>
        )
        .toJSON()

      expect(tree).toMatchSnapshot()
    })
  })
})
