import { Modal } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { authService, dbService } from "fireBase";
import { addDoc, collection } from "@firebase/firestore";
import "styles/LoginModal.scss";
import chelseaLogo from "images/chelsea-logo-300.png"

function LoginModal({ show, onHide, setIsLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (newAccount) {
      // 계정 생성
      createUserWithEmailAndPassword(authService, email, password)
        .then( async () => {
          alert('회원가입이 완료되었습니다!💙')
          console.log(authService.currentUser)
          const newUserObj = { // 새로 가입된 회원정보를 firestore 'users' 컬렉션에 저장
            userUid: authService.currentUser.uid,
            userDisplayName: authService.currentUser.displayName,
            userPhotoURL: authService.currentUser.photoURL,
            userEmail: authService.currentUser.email
          }
          await addDoc(collection(dbService, "users"), newUserObj)
          setNewAccount(false)
        })
        .catch((err) => console.log(err.resultMessage));
    } else {
      // 로그인
      signInWithEmailAndPassword(authService, email, password)
        .then(() => {
          setIsLogin(true)
        })
        .catch((err) => console.log(err));
      
    }
  };
  const toggleAccount = () => {
    setNewAccount((prev) => !prev)
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className="auth__form-container">
        <div className="auth__container">
          <img
            src={chelseaLogo}
            alt="chelsea-logo"
            className="auth__logo"
            style={{ width: 100 }}
          />
          <h1 className="auth__header">
            {newAccount ? (
              <>
                Welcome! <br />
                Be join our Chelsea FC club
              </>
            ) : (
              <>Login your ID</>
            )}
          </h1>
          <form onSubmit={onSubmit} className="auth__form">
            <input
              name="email"
              type="text"
              placeholder="Your Email"
              required
              value={email}
              onChange={onChange}
              className="authInput"
            />
            <input
              name="password"
              type="password"
              placeholder="Your Password"
              required
              value={password}
              onChange={onChange}
              className="authInput"
            />
            <input
              type="submit"
              value={newAccount ? "Create New Account" : "Log in"}
              className="authInput authBtn"
            />
          </form>
          <button onClick={toggleAccount} className="auth__switchBtn">
            {newAccount ? "I already have my ID" : "Join us"}
          </button>
          <button onClick={onHide} className="closeBtn">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default LoginModal;
