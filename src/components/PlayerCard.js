import { Link } from "react-router-dom"
import "styles/PlayerCard.scss"
import fifaCard from "images/fifa-card.png"

function PlayerCard(props) {
  const { id, playerName, backNumber, position, birthDate, nation, playerImg } = props
  return (
    <Link
      to={`/players/${id}`}
      state={{ playerName, backNumber, position, birthDate, nation, playerImg }}
      className="player__card"
    >
      <div className="playerCard__container">
        <img src={fifaCard} alt="fifa-card" className="playerCard__fifa-card" />
        <div className={`profile ${position}`}>
          <img className="profile__img" src={playerImg} alt={playerName} />
          <div className="profile__description">
            <h1 className="profile__name">{playerName}</h1>
            <div className="profile__num">{backNumber}</div>
          </div>
        </div>
      </div>
      
    </Link>
  )
}

export default PlayerCard