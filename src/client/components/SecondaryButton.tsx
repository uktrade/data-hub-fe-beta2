import { TEXT_COLOUR, GREY_3 } from 'govuk-colours'
import Button, {ButtonProps} from '@govuk-react/button'
import React from 'react'

const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <Button
    ref={ref}
    buttonColour={GREY_3}
    buttonTextColour={TEXT_COLOUR}
    {...props}
  />
))

export default SecondaryButton
