import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { updateProfile } from "@firebase/auth";
import { authService, dbService, storageService } from "fireBase";
import "styles/Profile.scss";
import chelseaLogoMd from "images/chelsea-logo-300.png";
import profileCard from "images/profile-card.png";
import anonymous from "images/anonymous2.png";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "@firebase/storage";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "@firebase/firestore";

function Profile({ userObj, setIsProfile, refreshUser }) {
  const fileInputRef = useRef();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profileImg, setProfileImg] = useState(userObj.photoURL);

  useEffect(() => {
    setIsProfile(true);
    return () => {
      setIsProfile(false);
    }
  }, []);
  useEffect(() => setProfileImg(userObj.photoURL), [userObj])

  const onChange = (event) => setNewDisplayName(event.target.value);
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader(); // MDN FileReader API
    reader.onloadend = (finishiedEvent) => {
      setProfileImg(finishiedEvent.currentTarget.result);
    };
    reader.readAsDataURL(theFile);
  };

  const clearAttachment = async () => {
    const urlRef = ref(storageService, userObj.photoURL);
    await deleteObject(urlRef)
      .then(() => alert("사진이 정상적으로 삭제되었습니다."))
      .catch((err) => console.log(err));
  };
  const onClearAttachment = async () => {
    const ok = window.confirm("사진 첨부를 취소하시겠습니까>");
    if (ok === false) return;
    if (userObj.photoURL !== null) { // 기존의 photoURL 이 있다면 storage 에서 지우고 프로필에서도 url 을 지워줌
      clearAttachment()
        .then(async () => {
          await updateProfile(authService.currentUser, { photoURL: "", })
          const userCollectDocRef = collection(dbService, "users")
          const q = query(userCollectDocRef, where("userUid", "==", authService.currentUser.uid))
          const querySnapshot = await getDocs(q)
          querySnapshot.forEach( async (document) => {
            const userDocRef = doc(dbService, "users", document.id)
            await updateDoc(userDocRef, {
              userPhotoURL: ""
            })
          })
        })
    }
    setProfileImg(null);
    fileInputRef.current.value = null;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName && newDisplayName !== "") {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      }).then( async () => {
        alert('닉네임 업데이트 성공!')
        // firestore 'users' 컬렉션에 유저 닉네임 업데이트
        const userCollectDocRef = collection(dbService, "users")
        const q = query(userCollectDocRef, where("userUid", "==", authService.currentUser.uid))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach( async (document) => {
          const userDocRef = doc(dbService, "users", document.id)
          await updateDoc(userDocRef, {
            userDisplayName: newDisplayName
          })
        })
      })
      refreshUser()
    }
    // storage 에 프로필 이미지 저장
    if (profileImg === userObj.photoURL) return
    if (profileImg) {
      const attachmentRef = ref(
        storageService,
        `profileImg__${userObj.uid}/${uuidv4()}`
      );
      await uploadString(attachmentRef, profileImg, "data_url");
      const profileImgURL = await getDownloadURL(attachmentRef);
      await updateProfile(authService.currentUser, {
        photoURL: profileImgURL,
      }).then( async () => {
        alert('프로필 이미지 업데이트 성공!')
        // firestore 'users' 컬렉션에 유저 프로필 이미지 URL 업데이트
        const userCollectDocRef = collection(dbService, "users")
        const q = query(userCollectDocRef, where("userUid", "==", authService.currentUser.uid))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach( async (document) => {
          const userDocRef = doc(dbService, "users", document.id)
          await updateDoc(userDocRef, {
            userPhotoURL: profileImgURL
          })
        })
      });
    }
    refreshUser();
  };
  
  return (
    <div className="profile__container">
      <div className="profile__form-bg">
        <img
          src={chelseaLogoMd}
          alt="chelsea-logo"
          className="profile__form-logo"
        />
        <h3 className="profile__title">Update Your Profile Here!</h3>
        <div className="profile__form-container">
          <img
            src={profileCard}
            alt="player-card"
            className="profileCard-form"
          />
          {profileImg ? null : (
            <img
              src={anonymous}
              alt="profile-default"
              className="profile-default"
            />
          )}

          <form className="profile__form-editForm" onSubmit={onSubmit}>
            <h6 className="displayName__title">Your Nickname</h6>
            <input
              name="newDisplayName"
              value={newDisplayName === null ? "" : newDisplayName}
              onChange={onChange}
              type="text"
              placeholder="Your nickname"
              className="editForm"
            />
            <label htmlFor="attach-profileImg" className="editForm attach-Img">
              <FontAwesomeIcon icon={faPlus} className="font-icon" />
              Add Your Profile Image
            </label>
            <input
                id="attach-profileImg"
                ref={fileInputRef}
                onChange={onFileChange}
                type="file"
                style={{ display: "none" }}
              />
              {profileImg && (
                <div className="profileImg__attach">
                  <img src={profileImg} alt="myUploadedImg" />
                  <div className="profileImg__clear">
                    <FontAwesomeIcon
                      icon={faTimes}
                      onClick={onClearAttachment}
                    />
                  </div>
                </div>
              )}
            <input type="submit" value="Update Profile" className="updateBtn" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
