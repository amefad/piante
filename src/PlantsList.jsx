export default function PlantList({ data, user }) {
  return (
    <>
      {data.isError && <div>failed to load</div>}
      {data.isLoading && <div>loading...</div>}
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
                <article key={plant.id}>
                  <h3>
                    {plant.commonName} ({plant.scientificName})
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
