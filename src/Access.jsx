import { useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "./AuthContext";
import Popup from "./Popup";
import "./Access.scss";

function writeInitials(user) {
  const pieces = user.name.trim().split(" ");
  const initials = pieces.reduce((prev, current, index) => {
    if (index == 0 || index == pieces.length - 1) {
      prev = `${prev}${current.charAt(0)}`;
    }
    return prev;
  }, "");
  return initials.toUpperCase();
}

export default function Access() {
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <div id="access">
      {user ? ( // User is logged in
        <div className="avatar">
          <button
            onClick={() => setMenuVisible(true)}
            title={`Profilo di ${user.name}`}
            className="avatar-image"
          >
            {writeInitials(user)}
          </button>
          <Popup
            show={menuVisible}
            onClickOutside={() => setMenuVisible(false)}
            className="avatar-menu"
          >
            <button onClick={logout} title="Logout">
              Logout
            </button>
          </Popup>
        </div>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Registrati</NavLink>
        </>
      )}
    </div>
  );
}
