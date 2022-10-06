import downsize from 'downsize'
import { VectorIcon } from './SvgIcons'
import '../styles/components/PeopleCard.css'
import { useStore } from '../store'

const PeopleCard = (props) => {
  const selectedPebble = useStore((state) => state.selectedPebble)
  if (!selectedPebble) {
    return null
  }
  return (
    <div className="PeopleCard">
      <img src={props.src}></img>
      <div className="Wrapper">
        <h3
          dangerouslySetInnerHTML={{
            __html: downsize(selectedPebble.title, { characters: 50, append: '&hellip;' }),
          }}
        />
        <span>Pebble was created on 12.05.2023</span>
        <p>Jeanne Lukmanski was born in 1920 in Cornellà de Llobregregat (Spain).</p>
      </div>
      <div className="Read_More">
        <b>
          <VectorIcon></VectorIcon>Read this story
        </b>
      </div>
    </div>
  )
}

export default PeopleCard
