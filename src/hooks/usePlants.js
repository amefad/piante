import useSWR from "swr";
import fetcher from "../libs/fetcher";
// debug
// import { useSWRConfig } from "swr";

export function usePlants(userId, limitTo) {
  let url;
  if (!userId) {
    url = `${import.meta.env.BASE_URL}/api/plants`;
  } else if (!limitTo) {
    url = `${import.meta.env.BASE_URL}/api/plants?user=${userId}`;
  } else {
    url = `${import.meta.env.BASE_URL}/api/plants?user=${userId}&last=${limitTo}`;
  }
  // debug: can help setting `dedupingInterval` (default is 2s)
  const { data, error, isLoading } = useSWR(url, fetcher);

  // debug
  // const { cache } = useSWRConfig();
  // console.log(cache);

  return {
    plants: data,
    isLoading,
    isError: error,
  };
}
