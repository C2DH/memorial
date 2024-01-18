import './ScrollIcon.css'

const ScrollIcon = ({ size = '40px', color = '' }) => {
  const ratio = 14.334 / 24.75
  const height = size / ratio
  color = 'var(--bs-white)'
  return (
    <div className="ScrollIcon" style={{ width: size, height: height }}>
      <svg viewBox="0 0 14.334 24.75">
        <circle class="circle-1" fill={color} cx="7.167" cy="0" r="1.2" />
        <circle class="circle-2" fill={color} cx="7.167" cy="0" r="1.2" />
        <path
          stroke={color}
          fill="transparent"
          d="M7.167,0.5C3.485,0.5,0.5,3.485,0.5,7.167v10.416c0,3.682,2.985,6.667,6.667,6.667s6.667-2.985,6.667-6.667V7.167C13.834,3.485,10.849,0.5,7.167,0.5z"
        />
      </svg>
    </div>
  )
}

export default ScrollIcon
