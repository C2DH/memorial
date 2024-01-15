const ScrollIcon = ({ size = '40px', color = '' }) => {
  const ratio = 14.334 / 24.75
  const height = size / ratio
  color = 'var(--bs-white)'
  return (
    <>
      <style>
        {`.experience-start .ScrollIcon {
              opacity: 1;
          }
          .ScrollIcon {
            position: absolute;
            bottom: 10%;
            transform: translateX(calc(50vw - 20px));
            z-index: 1;
            opacity: 0;
          }
          .circle-1, .circle-2 {
            animation: scroll 2s infinite linear;
            opacity: 0;
          }

          .circle-2{
            animation-delay: 1s;
          }

          @keyframes scroll {
            0% {
              cy: 4;
              opacity: 0;
            }
            45%, 55% {
              opacity: 1;
              cy: 9;
            }
            100% {
              cy: 14;
              opacity: 0;
            }
          }`}
      </style>
      <div className="ScrollIcon" style={{ width: size, height: height }}>
        <svg viewBox="0 0 14.334 24.75">
          <circle class="circle-1" fill={color} cx="7.167" cy="6" r="1.2" />
          <circle class="circle-2" fill={color} cx="7.167" cy="6" r="1.2" />
          <path
            stroke={color}
            fill="transparent"
            d="M7.167,0.5C3.485,0.5,0.5,3.485,0.5,7.167v10.416c0,3.682,2.985,6.667,6.667,6.667s6.667-2.985,6.667-6.667V7.167C13.834,3.485,10.849,0.5,7.167,0.5z"
          />
        </svg>
      </div>
    </>
  )
}

export default ScrollIcon
