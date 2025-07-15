import { Link, NavLink } from "react-router";
import "./Header.scss";

export default function Header() {
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
        <NavLink
          to={`${import.meta.env.BASE_URL}/login`}
          activeClassName="active"
        >
          Login
        </NavLink>
      </nav>
    </header>
  );
}
