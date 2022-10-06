import downsize from 'downsize'
import { VectorIcon } from './SvgIcons'
import '../styles/components/PeopleCard.css'
import { useStore } from '../store'

const PeopleCard = ({ debug, alt, src, ...props }) => {
  const selectedPebble = useStore((state) => state.selectedPebble)
  if (!selectedPebble) {
    return null
  }
  if (!debug) {
    return null
  }
  return (
    <div className="PeopleCard" {...props}>
      <img src={src} alt={alt}></img>

      <div className="Wrapper">
        <div className="TextWrapper">
          <h3
            dangerouslySetInnerHTML={{
              __html: downsize(selectedPebble.title, { characters: 50, append: '&hellip;' }),
            }}
          />
          <span>Pebble was created on 12.05.2023</span>
        </div>
        {/* <p>Jeanne Lukmanski was born in 1920 in Cornellà de Llobregregat (Spain).</p> */}
        <div className="Read_More">
          <b>
            <VectorIcon></VectorIcon>Read this story
          </b>
        </div>
      </div>
    </div>
  )
}

export default PeopleCard
