import testAsset from "./assets/react.svg";
export function Home() {
  return (
    <>
      <h1>Mappa delle piante</h1>
      <p>
        <a href={`${import.meta.env.BASE_URL}/test`}>
          Interfaccia minima con le API
        </a>
      </p>
      {/* test assets path, can be deleted */}
      <img src={testAsset} style={{ width: "80px", height: "80px" }} />
    </>
  );
}
