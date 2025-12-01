import { Link } from "react-router";
import Page from "./Page";
import Map from "./Map";
import "./Home.scss";
import PlantList from "./PlantsList";
import { usePlants } from "./hooks/usePlants";
import { useAuth } from "./AuthContext";

export default function Home() {
  const { user } = useAuth();
  const plantsLimit = 3;
  let query = "";
  if (user) {
    query = `?user=${user.id}&last=${plantsLimit}`;
  }
  const data = usePlants(query);

  return (
    <Page className="homepage">
      {user ? (
        <PlantList data={data} user={user} />
      ) : (
        <p>
          Applicazione web per visualizzare e gestire una mappa del verde pubblico e privato a
          Conegliano (Treviso).
        </p>
      )}
      <p>
        <a href={`${import.meta.env.BASE_URL}/test/index.html`}>Interfaccia minima con le API</a>
      </p>
      <Link to="/map">
        <Map data={data} />
      </Link>
    </Page>
  );
}
