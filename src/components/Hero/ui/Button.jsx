import './styles/button.css'

export const Button = ({ text = 'Button', variant = 'light', onClick }) => {
  const variantsClassName = 'button--variant-' + variant

  return (
    <div className={'button ' + variantsClassName} onClick={onClick}>
      {text}
    </div>
  )
}
