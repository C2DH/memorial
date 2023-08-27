import React from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import '../styles/components/OrderByDropdown.css'

const OrderByDropdown = ({
  values = [], // array of [{value:'abc', label:''}]
  defaultTitle = '',
  selectedValue = '',
  onChange,
  disabled = false,
  id = 'dropdown-basic-button',
  size = 'sm',
  variant = 'outline-dark',
  className = '',
}) => {
  const { t } = useTranslation()
  const selectedLabel = values.find((d) => d.value === selectedValue)
  return (
    <DropdownButton
      className={`OrderByDropdown ${className}`}
      disabled={disabled}
      id={id}
      onChange={onChange}
      title={selectedLabel ? t(selectedLabel.label) : defaultTitle}
      variant={variant}
      size={size}
    >
      {values.map((item) => (
        <Dropdown.Item
          key={item.value}
          active={selectedValue === item.value}
          onClick={() => onChange(item)}
        >
          <span>{t(item.label ?? item.value)}</span>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

export default OrderByDropdown
