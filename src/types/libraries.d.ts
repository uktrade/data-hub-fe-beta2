declare module '@govuk-react/button' {
  export interface ButtonProps extends React.ButtonHTMLAttributes<any> {
    ref?: React.ForwardedRef<HTMLButtonElement>
    icon?: React.ReactNode
    start?: boolean
    buttonColour?: string
    buttonHoverColour?: string
    buttonShadowColour?: string
    buttonTextColour?: string
  }

  type Button = React.FunctionComponent<ButtonProps>
  const Button: Button

  export default Button
}
declare module '@govuk-react/constants'
declare module '@govuk-react/heading'
declare module '@govuk-react/lib'
declare module '@govuk-react/loading-box'
declare module 'govuk-colours'