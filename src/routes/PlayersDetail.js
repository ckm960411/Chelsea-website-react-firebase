import { useLocation } from "react-router"
import "styles/PlayersDetail.scss"
import fifaCard from "images/fifa-card.png"

function PlayersDetail(props) {
  const location = useLocation()
  const { playerName, position, backNumber, birthDate, nation, playerImg } = location.state
  return (
    <div>
      <div className="player-imgs">
        <img src={fifaCard} alt="fifa-card" className="profile-card" />
        <img src={playerImg} alt={playerName} className="player-profileImg" />
        <div className="player-name">{playerName}</div>
      </div>
      
    </div>
  )
}

export default PlayersDetail