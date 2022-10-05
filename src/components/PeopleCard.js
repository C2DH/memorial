import VectorIcon from './svg/VectorIcon'
import '../styles/components/PeopleCard.css'

const PeopleCard = (props) => {
  return (
    <div className="PeopleCard">
      <img src={props.src}></img>
      <div className="Wrapper">
        <h3>Jeanne Lukmanski</h3>
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
