import useSWR from "swr";

import fetcher from "../libs/fetcher";

export function useData(userId) {
  let url;
  if (userId) {
    url = `${import.meta.env.BASE_URL}/api/plants?user=${userId}&last=3`;
  } else {
    url = `${import.meta.env.BASE_URL}/api/plants`;
  }
  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    plants: data,
    isLoading,
    isError: error,
  };
}
