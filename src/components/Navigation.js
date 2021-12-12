import { useNavigate } from "react-router";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "styles/Navigation.scss";
import chelseaLogo from "images/chelsea-logo.png"
import anonymous from "images/anonymous2.png"

function Navigation({ isLogin, setModalShow, isProfile, onLogOutClick, userObj }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar__container">
      <img
        src={chelseaLogo}
        alt="chelsea-logo"
        className="navbar__nav-logo"
      />
      <ul className="navbar__navLinks">
        <li className="navbar__navLink">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar__navLink">
          <Link to="/players">Players</Link>
        </li>
        <li className="navbar__navLink">
          <Link to="/playersinfo">Players Info</Link>
        </li>
      </ul>
      <form className="navbar__form">
        <input
          className="navbar__input inputForm"
          type="text"
          placeholder="search here.."
        />
        <button className="navbar__input inputBtn">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>

      {isLogin ? (
        <>
          {isProfile ? (
            <button
              onClick={() => {
                onLogOutClick();
                navigate("/");
              }}
              className="loginBtn logout"
            >
              Log out
            </button>
          ) : (
            <Link to="/profile">
              <img src={userObj.photoURL ? userObj.photoURL : anonymous } alt="profile-img" className="nav__profileImg" />
            </Link>
          )}
        </>
      ) : (
        <button onClick={() => setModalShow(true)} className="loginBtn login">
          Log in
        </button>
      )}
    </nav>
  );
}

export default Navigation;
