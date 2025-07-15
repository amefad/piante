export default function Home() {
  return (
    <>
      <h2>Mappa delle piante</h2>
      <p>
        Applicazione web per visualizzare e gestire una mappa del verde pubblico
        e privato a Conegliano (Treviso).
      </p>
      <p>
        <a href={`${import.meta.env.BASE_URL}/test`}>
          Interfaccia minima con le API
        </a>
      </p>
    </>
  );
}
