import { NotFound } from "http-errors";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "routes/Home";
import Players from "routes/Players";
import PlayersDetail from "routes/PlayersDetail";
import PlayersInfo from "routes/PlayersInfo";
import Navigation from "./Navigation";
import Profile from "routes/Profile";
import { useState } from "react";

function AppRouter({
  userObj,
  isLogin,
  refreshUser,
  setModalShow,
  onLogOutClick,
}) {
  const [isProfile, setIsProfile] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Navigation
          isLogin={isLogin}
          setModalShow={setModalShow}
          isProfile={isProfile}
          onLogOutClick={onLogOutClick}
          userObj={userObj}
        />
        <div
          style={{
            position: "absolute",
            top: 80, // Navigation 높이
            width: "100%",
          }}
        >
          <Routes>
            <Route
              path="/profile"
              element={
                <Profile
                  userObj={userObj}
                  setIsProfile={setIsProfile}
                  refreshUser={refreshUser}
                />
              }
            />
            <Route
              path="/playersinfo"
              element={<PlayersInfo userObj={userObj} />}
            />
            <Route path="/players/:id" element={<PlayersDetail userObj={userObj} />} />
            <Route path="/players" element={<Players />} />
            <Route path="/" exact element={<Home />} />
            <Route element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default AppRouter;
