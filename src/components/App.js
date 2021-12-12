import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import AppRouter from "components/Router";
import { authService } from "fireBase";
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import "styles/App.scss";

function App() {
  const [init, setInit] = useState(false)
  const [isLogin, setIsLogin] = useState(false);
  const [userObj, setUserObj] = useState(false)
  const [modalShow, setModalShow] = useState(false);

  // 로그아웃 하는 함수
  const onLogOutClick = () => {
    const ok = window.confirm('로그아웃 하시겠습니까?')
    if (ok) {
      setIsLogin(false)
      authService.signOut()
      setModalShow(false)
    } else return
  }

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLogin(true)
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
          updateProfile: (args) => updateProfile(user, args)
        })
      } else {
        setIsLogin(false)
      }
      setInit(true)
    })
  }, [])

  const refreshUser = () => {
    const user = authService.currentUser
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      updateProfile: (args) => updateProfile(user, args)
    })
  }
  
  return (
    <>
      {init ? <AppRouter
        refreshUser={refreshUser}
        userObj={userObj}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setModalShow={setModalShow}
        onLogOutClick={onLogOutClick}
      /> : "Initializing...💙" }
      
      {isLogin ? null : (
        <LoginModal
          setIsLogin={setIsLogin}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      )}
    </>
  );
}

export default App;
