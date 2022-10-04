import '../styles/components/PeopleCard.css'

const PeopleCard = (props) => {
  return (
    <div className="PeopleCard">
      <img src={props.src}></img>
      <div className="Wrapper">
        <h3>Jeanne Lukmanski</h3>
        <p>Jeanne Lukmanski was born in 1920 in Cornellà de Llobregregat (Spain).</p>
        <div className="Read_More">
          <b>Read more</b>
        </div>
      </div>
    </div>
  )
}

export default PeopleCard
