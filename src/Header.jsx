import { Link, NavLink } from "react-router";
import { useAuth } from "./AuthContext";
import "./Header.scss";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header>
      <Link className="logo" to="/" end>
        <img src={`${import.meta.env.BASE_URL}/favicon.svg`} alt="Logo" />
        <h1>Mappa delle piante</h1>
      </Link>
      <nav>
        {user ? ( // User is logged in
          <button onClick={logout} title="Logout">
            {user.name}
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
      </nav>
    </header>
  );
}
