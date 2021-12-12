import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { collection, doc, getDoc, getDocs, query, where } from "@firebase/firestore"
import { dbService } from "fireBase"
import DetailTabs from "components/DetailTabs"
import "styles/PlayersDetail.scss"
import fifaCard from "images/fifa-card.png"

function PlayersDetail({ userObj }) {
  const [playerObj, setPlayerObj] = useState({})
  const params = useParams()
  const playerId = Number(params.id)
  const { playerName, position, backNumber, birthDate, attachmentURL } = playerObj

  useEffect(() => {
    searchPlayer(playerId)
    return () => setPlayerObj({})
  }, [])
  
  const searchPlayer = async (id) => {
    const playersRef = collection(dbService, "playersInfo")
    const q = query(playersRef, where("backNumber", "==", id))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(document => {
      const docObj = {
        ...document.data(),
        id: document.id,
      }
      const playerDocRef = doc(dbService, "playersInfo", docObj.id)
      getDoc(playerDocRef).then(docSnap => {
        if (docSnap.exists()) setPlayerObj({ ...docSnap.data() })
      })
    })
  }

  return (
    <div className="detail__bg">
      <div className="detail__container">
        <div className="detail__profile-banner">

          <div className="detail__inner">
            <div className="player-imgs">
              <img src={fifaCard} alt="fifa-card" className="profile-card" />
              <img src={attachmentURL} alt={playerName} className="player-profileImg" />
              <div className="player-name">{playerName}</div>
            </div>
            <div className="detail__profile-banner-dec">
              <h1>{backNumber}</h1>
              <h1>{playerName}</h1>
            </div>
          </div>
          
        </div>
        
        <div className="detail__inner">
          <div className="detail__description">
            <div className="detail__description-sideBar">
              <h3>Side Bar</h3>
            </div>
            <div className="detail__description-tabs">
              <DetailTabs userObj={userObj} playerObj={playerObj} />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default PlayersDetail