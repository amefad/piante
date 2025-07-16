import { Link, NavLink } from "react-router";
import { useAuth } from "./AuthContext";
import "./Header.scss";

export default function Header() {
  const { token, user, logout } = useAuth();
  return (
    <header>
      <Link className="logo" to={`${import.meta.env.BASE_URL}`} end>
        <img src="/piante/favicon.svg" alt="Logo" />
        <h1>Mappa delle piante</h1>
      </Link>
      <nav>
        <NavLink
          to={`${import.meta.env.BASE_URL}`}
          end
          activeClassName="active"
        >
          Home
        </NavLink>
        {token ? ( // User is logged in
          <button onClick={logout} title="Logout">
            {user.name}
          </button>
        ) : (
          <NavLink
            to={`${import.meta.env.BASE_URL}/login`}
            activeClassName="active"
          >
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}
