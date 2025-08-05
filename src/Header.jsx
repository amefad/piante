import { Link } from "react-router";
import Access from "./Access";
import "./Header.scss";

export default function Header() {
  return (
    <header>
      <Link className="logo" to="/" end>
        <img src={`${import.meta.env.BASE_URL}/favicon.svg`} alt="Logo" />
        <h1>Mappa delle piante</h1>
      </Link>
      <Access />
    </header>
  );
}
