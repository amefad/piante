export default async function fetcher(url) {
  const res = await fetch(url);

  // If the status code is not in the range 200-299, we still try to parse and throw it
  if (!res.ok) {
    const json = await res.json();
    const error = new Error(json.message || "Errore nel caricamento dei dati");
    error.status = res.status;
    throw error;
  }

  return res.json();
}
