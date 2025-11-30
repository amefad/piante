import { usePlants } from "./hooks/usePlants";
import { useAuth } from "./AuthContext";

export default function PlantList({ limitTo }) {
  const { user } = useAuth();
  // atm 'plants' should be only those added by the currently logged-in user
  const { plants: userPlants, isLoading, isError } = usePlants(user?.id, limitTo);

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  if (user)
    return userPlants.length === 0 ? (
      <p>
        <strong>{user.name}</strong>, a quanto pare non hai inserito nessuna pianta.
      </p>
    ) : (
      <>
        <h2>Ultime piante inserite da {user.name}</h2>
        <section>
          {userPlants.map((plant) => (
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
    );
  return null;
}
