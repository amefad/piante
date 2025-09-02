import useSWR from "swr";
// import { useSWRConfig } from "swr";

import fetcher from "../libs/fetcher";

export function useData(userId) {
  let url;
  if (userId) {
    url = `${import.meta.env.BASE_URL}/api/plants?user=${userId}&last=3`;
  } else {
    url = `${import.meta.env.BASE_URL}/api/plants`;
  }
  // For now, use a value of 10s to help with debugging.
  const { data, error, isLoading } = useSWR(url, fetcher, { dedupingInterval: 10000 });

  // debug
  // const { cache } = useSWRConfig();
  // console.log(cache);

  return {
    plants: data,
    isLoading,
    isError: error,
  };
}
