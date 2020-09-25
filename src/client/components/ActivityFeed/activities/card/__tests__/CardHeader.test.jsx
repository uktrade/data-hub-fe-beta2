import React from 'react'
import { mount } from 'enzyme/build'
import { GREY_1 } from 'govuk-colours'

import CardHeader from '../CardHeader'
import { SOURCE_TYPES } from '../../../constants'
import Badge from '../../../../badge/Badge'

describe('CardHeader', () => {
  describe('when no props are passed', () => {
    test('should not render anything', () => {
      const wrapper = mount(<CardHeader />)
      expect(wrapper.text()).toContain('')
    })
  })

  describe('when all props are passed', () => {
    test('should render the entire card header', () => {
      const wrapper = mount(
        <CardHeader
          startTime="1879-01-05T06:53:47"
          company={{ name: 'Test company' }}
          blockText="Test block text"
          subHeading="Test subheading text"
          heading="Test heading text"
          badge={{ text: 'Test badge', borderColour: 'red' }}
        />
      )

      expect(wrapper.text()).toContain('05 Jan 1879')
      expect(wrapper.text()).toContain('Test company')
      expect(wrapper.text()).toContain('Test block text')
      expect(wrapper.text()).toContain('Test subheading text')
      expect(wrapper.text()).toContain('Test heading text')
      expect(wrapper.text()).toContain('Test badge')
      expect(wrapper.find(Badge)).toHaveStyleRule('border', '2px solid red')
    })
  })

  describe('when sourceType is external', () => {
    test('should render gray block text', () => {
      const wrapper = mount(
        <CardHeader
          blockText="Test block text"
          sourceType={SOURCE_TYPES.external}
        />
      )

      expect(wrapper.find('h3')).toHaveStyleRule('background-color', GREY_1)
      expect(wrapper.text()).toContain('Test block text')
    })
  })
})
