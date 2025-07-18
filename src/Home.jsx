import { Link } from "react-router";
import Page from "./Page";
import Map from "./Map";
import "./Home.scss";

export default function Home() {
  return (
    <Page title="Mappa delle piante">
      <p>
        Applicazione web per visualizzare e gestire una mappa del verde pubblico e privato a
        Conegliano (Treviso).
      </p>
      <p>
        <a href={`${import.meta.env.BASE_URL}/test`}>Interfaccia minima con le API</a>
      </p>
      <Link to="/map">
        <Map />
      </Link>
    </Page>
  );
}
