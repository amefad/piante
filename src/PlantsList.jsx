import { useNavigate } from "react-router";

export default function PlantList({ data, user }) {
  const navigate = useNavigate();

  return (
    <>
      {data.error && <p className="error">{data.error.message}</p>}
      {data.isLoading && <p>Loading...</p>}
      {data.plants?.length === 0 ? (
        <p>
          <strong>{user.name}</strong>, a quanto pare non hai inserito nessuna pianta.
        </p>
      ) : (
        <>
          <h2>Ultime piante inserite da {user.name}</h2>
          <section>
            {data.plants &&
              data.plants.map((plant) => (
                <article key={plant.id} onClick={() => navigate(`/plant/${plant.id}`)}>
                  <h3>{plant.species.scientificName}</h3>
                  {plant.species.commonName}
                  <br />
                  <mark>{plant.species.warning}</mark>
                  <p>
                    ID {plant.id}
                    <br />
                    Numero {plant.number}
                    <br />
                    Diametri {plant.diameters.join(", ")} cm
                    <br />
                    Altezza {plant.height} m<br />
                    Data {plant.date}
                  </p>
                  {plant.images.map((image) => (
                    <img
                      key={image.id}
                      src={`${import.meta.env.BASE_URL}/uploads/thumbnail/${image.fileName}`}
                    />
                  ))}
                </article>
              ))}
          </section>
        </>
      )}
    </>
  );
}
