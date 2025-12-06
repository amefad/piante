import useSWR from "swr";
import fetcher from "../libs/fetcher";
// debug
// import { useSWRConfig } from "swr";

export function usePlants(queryPath = "") {
  let url = `${import.meta.env.BASE_URL}/api/plants${queryPath}`;

  // debug: can help setting `dedupingInterval` (default is 2s)
  const { data, isLoading, error } = useSWR(url, fetcher);

  // debug
  // const { cache } = useSWRConfig();
  // console.log(cache);

  return {
    plants: data,
    isLoading,
    error,
  };
}
