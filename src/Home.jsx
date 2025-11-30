import { Link } from "react-router";
import Page from "./Page";
import Map from "./Map";
import "./Home.scss";
import PlantList from "./PlantsList";

export default function Home() {
  const plantsLimit = 3; // todo: this doesn't feel right but for now it works.

  return (
    <Page className="homepage">
      <p>
        Applicazione web per visualizzare e gestire una mappa del verde pubblico e privato a
        Conegliano (Treviso).
      </p>
      {/* todo: warning! this can be null (shows nothing) if no user is currently logged-in */}
      <PlantList limitTo={plantsLimit} />
      <p>
        <a href={`${import.meta.env.BASE_URL}/test/index.html`}>Interfaccia minima con le API</a>
      </p>
      <Link to="/map">
        {/* always show something: if a user is logged show his plants otherwise show all plants */}
        <Map limitTo={plantsLimit} />
      </Link>
    </Page>
  );
}
