import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "./AuthContext";
import Page from "./Page";
import Map from "./Map";
import "./Home.scss";

export default function Home() {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.BASE_URL}/api/plants?user=${user.id}&last=3`)
        .then((response) => response.json())
        .then((data) => setPlants(data));
    }
  }, [user]);

  return (
    <Page className="homepage">
      {user ? (
        <>
          {plants.length == 0 ? (
            <p>
              <strong>{user.name}</strong>, a quanto pare non hai inserito nessuna pianta.
            </p>
          ) : (
            <>
              <h2>Ultime piante inserite da {user.name}</h2>
              <section>
                {plants.map((plant) => (
                  <article key={plant.id}>
                    <h3>
                      {plant["common-name"]} ({plant["scientific-name"]})
                    </h3>
                    <p>
                      ID {plant.id}
                      <br />
                      Numero {plant.number}
                      <br />
                      Circonferenze {plant.circumferences.join(", ")} cm
                      <br />
                      Altezza {plant.height} m<br />
                      Data {plant.date}
                    </p>
                    {plant.images.map((image) => (
                      <img
                        key={image.id}
                        src={`${import.meta.env.BASE_URL}/uploads/thumbnail/${image["file-name"]}`}
                      />
                    ))}
                  </article>
                ))}
              </section>
            </>
          )}
        </>
      ) : (
        <>
          <h2>Mappa delle piante</h2>
          <p>
            Applicazione web per visualizzare e gestire una mappa del verde pubblico e privato a
            Conegliano (Treviso).
          </p>
        </>
      )}
      <p>
        <a href={`${import.meta.env.BASE_URL}/test`}>Interfaccia minima con le API</a>
      </p>
      <Link to="/map">
        <Map />
      </Link>
    </Page>
  );
}
