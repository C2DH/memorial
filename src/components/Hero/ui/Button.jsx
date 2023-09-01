import './styles/button.css'

export const Button = ({ text = 'Button', variant = 'light', ...props }) => {
  const variantsClassName = 'button--variant-' + variant

  return (
    <div className={'button ' + variantsClassName} {...props}>
      {text}
    </div>
  )
}
