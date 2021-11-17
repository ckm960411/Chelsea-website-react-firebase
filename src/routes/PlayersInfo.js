import AddPlayerForm from "components/AddPlayerForm";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  getDoc,
  getDocs,
  doc,
  query,
  where,
  collection,
} from "@firebase/firestore";
import { dbService } from "fireBase";
import "styles/PlayersInfo.scss";
import chelseaLogoMd from "images/chelsea-logo-300.png"
import fifaCard from "images/fifa-card.png"

function PlayersInfo({ userObj }) {
  const searchPlayerRef = useRef()
  const [search, setSearch] = useState("");
  const [searchedObj, setSearchedObj] = useState({});
  const [playerDocId, setPlayerDocId] = useState("");
  const [editing, setEditing] = useState(false)

  const onChange = (event) => {
    setSearch(event.target.value);
  };

  // 특정 선수를 검색하는 함수
  const onSearchPlayer = async (searchWord) => {
    const playersRef = collection(dbService, "playersInfo");
    const q = query(playersRef, where("playerName", "==", searchWord));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length < 1) {
      alert(
        "원하는 선수 정보를 찾지 못 했습니다. 정확한 선수 풀네임을 입력하세요!"
      );
      setSearchedObj({});
      setPlayerDocId("")
      setEditing(false)
      searchPlayerRef.current.value = ""
      return;
    }
    querySnapshot.forEach((document) => {
      const playersObj = {
        ...document.data(),
        id: document.id,
      };
      setPlayerDocId(document.id);

      const playerDocRef = doc(dbService, "playersInfo", playersObj.id);
      getDoc(playerDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          setSearchedObj({ ...docSnap.data() });
        }
      });
    });
  };
  const onSearch = (event) => {
    event.preventDefault();
    onSearchPlayer(search);
  };

  useEffect(() => {
    searchPlayerRef.current.value = ""
  }, [editing])

  return (
    <div className="info__container">
      <div className="form__bg">
        <img
          src={chelseaLogoMd}
          alt="chelsea-logo"
          className="form__logo"
        />
        <form className="editing__form" onSubmit={onSearch}>
          <input
            type="text"
            ref={searchPlayerRef}
            value={search}
            onChange={onChange}
            placeholder="Search your player here"
            className="editing__form-input"
          />
          <button className="editing__form-searchBtn">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
        <div className="form__form-container">
          <img
            src={fifaCard}
            alt="player-card"
            className="playerCard-form"
          />
          <AddPlayerForm
            userObj={userObj}
            searchedObj={searchedObj}
            search={search}
            playerDocId={playerDocId}
            setPlayerDocId={setPlayerDocId}
            editing={editing}
            setEditing={setEditing}
          />
        </div>
      </div>
    </div>
  );
}

export default PlayersInfo;
