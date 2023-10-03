import '../styles/components/CoverItems.css'

const CoverItems = ({ covers = [], size = 120, style, ...rest }) => {
  const pictureStyle = (i) => {
    const neg = i % 2 === 0 ? -1 : 1
    const theta = i * neg * 5 + Math.random() * neg * 5
    return {
      transform: `translate3d(-10px, -50%, 0) rotate(${theta}deg)`,
    }
  }
  return (
    <ol className="CoverItems" style={{ minWidth: size, ...style }} {...rest}>
      {covers.map((doc, i) => {
        const thumbnailResolution = doc.data.resolutions?.thumbnail?.url
        return (
          <picture key={doc.id} style={pictureStyle(i)}>
            <img src={thumbnailResolution} alt={doc.type} style={{ width: size }} />
          </picture>
        )
      })}
    </ol>
  )
}

export default CoverItems
