import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { dbService, storageService } from "fireBase";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, doc, updateDoc } from "@firebase/firestore";
import "styles/AddPlayerForm.scss";

function AddPlayerForm(props) {
  const {
    userObj,
    searchedObj,
    playerDocId,
    setPlayerDocId,
    editing,
    setEditing,
  } = props;
  const fileInputRef = useRef();
  const selectPositionRef = useRef();
  const [playerName, setPlayerName] = useState("");
  const [position, setPosition] = useState("");
  const [backNumber, setBackNumber] = useState(0);
  const [birthDate, setBirthDate] = useState("");
  const [nation, setNation] = useState("");
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    if (searchedObj.playerName) {
      setPlayerName(searchedObj.playerName);
      setPosition(searchedObj.position);
      selectPositionRef.current.value = searchedObj.position;
      setBackNumber(searchedObj.backNumber);
      setBirthDate(searchedObj.birthDate);
      setNation(searchedObj.nation);
      setAttachment(searchedObj.attachmentURL);
      setEditing(true);
    } else {
      selectPositionRef.current.value = "";
    }
    return () => {
      setPlayerName("");
      setPosition("");
      setBackNumber(0);
      setBirthDate("");
      setNation("");
      setAttachment("");
      setEditing(false);
    };
  }, [searchedObj, setEditing]);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "name") setPlayerName(value);
    if (name === "position") {
      if (value === "") return;
      setPosition(value);
    }
    if (name === "backNumber") {
      if (value < 0) return;
      setBackNumber(value);
    }
    if (name === "birthDate") setBirthDate(value);
    if (name === "nation") setNation(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader(); // MDN FileReader API
    reader.onloadend = (finishiedEvent) => {
      setAttachment(finishiedEvent.currentTarget.result);
    };
    reader.readAsDataURL(theFile);
  };
  const clearAttachment = async () => {
    // storage 에 저장되어 있는 사진을 찾아 지우는 함수
    const urlRef = ref(storageService, searchedObj.attachmentURL);
    await deleteObject(urlRef)
      .then(() => alert("사진이 정상적으로 삭제되었습니다."))
      .catch((err) => console.log(err));
  };
  const onClearAttachment = () => {
    const ok = window.confirm("사진 첨부를 취소하시겠습니까>");
    if (ok === false) return;
    if (editing === true && searchedObj.attachmentURL !== "") {
      clearAttachment();
    }
    setAttachment("");
    fileInputRef.current.value = null;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (attachment === "") return;

    if (editing === true) { // 기존의 선수를 수정할 때
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); // 파일경로 참조 만들기
      await uploadString(attachmentRef, attachment, "data_url"); // 참조경로로 파일 업로드하기
      const attachmentURL = await getDownloadURL(attachmentRef); // storage에 있는 파일 URL로 다운로드 받기
      const PlayerInfoRef = doc(dbService, "playersInfo", playerDocId); // 특정 선수문서 ID를 찾아서 레퍼런스 생성
      await updateDoc(PlayerInfoRef, { // 선수 정보를 업데이트
        playerName,
        position,
        backNumber: Number(backNumber),
        birthDate,
        nation,
        attachmentURL,
      }).then(() => alert("선수 정보 수정이 완료되었습니다!💙"));
    } else { // 새로운 선수를 등록할 때
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); 
      await uploadString(attachmentRef, attachment, "data_url"); 
      const attachmentURL = await getDownloadURL(attachmentRef); 
      const playersInfoObj = {
        playerName,
        position,
        backNumber: Number(backNumber),
        birthDate,
        nation,
        attachmentURL, // storage 에 저장한 파일URL을 playersInfo 컬렉션에도 저장
      };
      // player 정보 firestore 컬렉션에 저장하기
      await addDoc(collection(dbService, "playersInfo"), playersInfoObj)
        .then(() => alert("선수 정보가 성공적으로 저장되었습니다!💙"))
        .catch((err) => console.log(err.resultMessage));
    }
    // state 초기화
    onClearAllState()
  };
  const onClearAllState = () => {
    setPlayerName("");
    setBirthDate("");
    setNation("");
    setBackNumber(0);
    setPosition("");
    setAttachment("");
    setPlayerDocId("");
    setEditing(false);
    selectPositionRef.current.value = "";
    fileInputRef.current.value = "";
  }

  return (
    <div className="addInfo__form">
      <div>
        <label className="inputForm attach-input-btn" htmlFor="attach-file">
          {attachment ? "Attach Another Image" : "Attach Player's Image"}
        </label>
        <input
          id="attach-file"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="inputForm attach-input"
          style={{ display: "none" }}
        />
        {attachment && (
          <div className="attachment__attach">
            <img src={attachment} alt="myUploadedImg" />
            <div className="attachment__clear" onClick={onClearAttachment}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </div>
      <input
        name="name"
        value={playerName}
        onChange={onChange}
        type="text"
        placeholder="Add New Player's Name"
        className="inputForm name-input"
        required
      />
      <select
        ref={selectPositionRef}
        name="position"
        onChange={onChange}
        className="inputForm position-select"
        required
      >
        <option value="" defaultValue className="default-select">
          Choose Player's Position
        </option>
        <option value="GoalKeeper">GoalKeeper</option>
        <option value="Defender">Defender</option>
        <option value="Midfielder">Midfielder</option>
        <option value="Forward">Forward</option>
      </select>
      <input
        name="backNumber"
        value={backNumber}
        onChange={onChange}
        type="number"
        min="1"
        className="inputForm backNum-input"
        required
      />
      <input
        name="birthDate"
        value={birthDate}
        onChange={onChange}
        type="text"
        placeholder="Add Players's Birth Date"
        className="inputForm birthDate-input"
        required
      />
      <input
        name="nation"
        value={nation}
        onChange={onChange}
        type="text"
        placeholder="Add Players's Nation"
        className="inputForm nation-input"
        required
      />
      <input
        type="submit"
        value={editing ? "Update Information" : "Register New Player"}
        className="addForm registerBtn"
        onClick={onSubmit}
      />
      <button className="clearBtn" onClick={onClearAllState}>CLear All Text</button>
    </div>
  );
}

export default AddPlayerForm;
