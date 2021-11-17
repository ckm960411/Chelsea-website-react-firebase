import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import PlayerCard from "components/PlayerCard";
import { dbService } from "fireBase";
import { useEffect, useState } from "react";
import "styles/Players.scss"

function Players() {
  const [players, setPlayers] = useState([])
  const [allPlayers, setAllPlayers] = useState([])

  useEffect(() => {
    const collectDocRef = collection(dbService, "playersInfo") // firebase 컬렉션 레퍼런스 생성
    const queryInstance = query(collectDocRef, orderBy("backNumber", "asc"))
    onSnapshot(queryInstance, (snapshot) => {
      const playersArray = snapshot.docs.map((doc) => ({
        id: doc.id, // doc.id 는 한개 문서의 id 를 말함
        ...doc.data(), // doc.data() 에는 position, playerName 과 같은 필드정보가 담김
      }))
      setPlayers(playersArray)
      setAllPlayers(playersArray)
    })
    return () => {
      setPlayers([])
      setAllPlayers([])
    }
  }, [])
  const fillAllPosition = () => setPlayers(allPlayers)
  const filterByPosition = (e) => {
    let newArray = []
    allPlayers.map(player => {
      if(player.position === e.target.innerText) {
        newArray.push(player)
      }
    })
    setPlayers(newArray)
  }
  return (
    <div className="players__container">
      <div className="position__btns">
        <button onClick={fillAllPosition} className="position__btn position__all">All position</button>
        <button onClick={filterByPosition} className="position__btn position__gk">GoalKeeper</button>
        <button onClick={filterByPosition} className="position__btn position__df">Defender</button>
        <button onClick={filterByPosition} className="position__btn position__mf">Midfielder</button>
        <button onClick={filterByPosition} className="position__btn position__fw">Forward</button>
      </div>
      <div className="players">
        {players && players.map(player => {
          return (
            <PlayerCard
              key={player.id}
              id={player.backNumber}
              backNumber={player.backNumber}
              playerName={player.playerName}
              position={player.position}
              birthDate={player.birthDate}
              nation={player.nation}
              playerImg={player.attachmentURL}
            />
          );
        })}
      </div>
    </div>
  )
}

export default Players