import { NavLink } from "react-router";
import { useAuth } from "./AuthContext";
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

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <div id="access">
      {user ? ( // User is logged in
        <button onClick={logout} title={`Logout ${user.name}`}>
          {writeInitials(user)}
        </button>
      ) : (
        <>
          <NavLink to="/login" activeClassName="active">
            Login
          </NavLink>
          <NavLink to="/register" activeClassName="active">
            Registrati
          </NavLink>
        </>
      )}
    </div>
  );
}
