const PauseIcon = () => {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="4" height="12" rx="2" fill="black" />
      <rect x="7" width="4" height="12" rx="2" fill="black" />
    </svg>
  )
}

const PlayIcon = () => {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.95327 6.92677L2.15327 11.3521C1.40686 11.7756 0.5 11.2376 0.5 10.4254L0.5 1.57464C0.5 0.76243 1.40686 0.224402 2.15327 0.647876L9.95327 5.07323C10.6822 5.48682 10.6822 6.51318 9.95327 6.92677Z"
        fill="black"
      />
    </svg>
  )
}

const VectorIcon = () => {
  return (
    <svg
      stroke="var(--white)"
      id="VectorIcon"
      width="13"
      height="14"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5.17627 1L10.9998 6.82353L5.17627 12.6471" stroke-width="2" />
      <path d="M0 6.82373H10.3529" stroke-width="2" />
    </svg>
  )
}

export { PauseIcon, PlayIcon, VectorIcon }
