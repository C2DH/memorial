import { useState } from 'react'
import { PebbleColors } from '../../../constants'
import './ColorPicker.css'
import PropTypes from 'prop-types'

const ColorPicker = ({ options = PebbleColors, className = '', onChange }) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(
    Math.round(Math.random() * (options.length - 1)),
  )
  return (
    <div className={`ColorPicker ${className}`}>
      {PebbleColors.map((c, i) => (
        <button
          className={`btn btn-sm ${selectedColorIdx === i ? 'active' : ''}`}
          style={{ backgroundColor: c }}
          key={c}
          onClick={() => {
            console.debug('[ColorPicker] @click \n - selected color:', c, '\n - idx:', i)
            setSelectedColorIdx(i)
            onChange(c, i)
          }}
        ></button>
      ))}
    </div>
  )
}
ColorPicker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default ColorPicker
