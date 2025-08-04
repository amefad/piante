import { Link } from "react-router";
import Map from "./Map";
import "./MapPage.scss";

export default function MapPage() {
  return (
    <>
      <Map active={true} />
      <Link to="/login" className="login">
        Login
      </Link>
    </>
  );
}
