import type { TreePlant } from "src/consts";

interface ApiCallParams {
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  baseUrl: string;
  tokenRequired?: boolean;
  minRole?: string; // adimn, editor, public, invalid
}

/**
 * Creates and returns a function to perform an API call with the specified parameters.
 *
 * @template T - The expected type of the response data.
 * @param {ApiCallParams} params - The configuration parameters for the API call, including the base URL and HTTP method.
 * @returns {(input?: { data?: T, resourceId?: string }) => Promise<T>}
 *          A function that takes an optional input with data and resourceId, performs the API fetch,
 *          and returns a Promise resolving to data of type T.
 *
 * @remarks
 * The returned async function constructs the request options, handles HTTP errors, and parses the JSON response.
 * Additional token-based authentication or body handling may be added by uncommenting and customizing
 * the related sections in the code.
 *
 * @example
 * const apiCall = createApiCall<MyResponseType>({ baseUrl: "https://api.example.com/item", method: "GET" });
 * apiCall({ resourceId: "123" })
 *   .then(response => console.log(response))
 *   .catch(error => console.error("Error fetching item:", error));
 */
function createApiCall<T>(params: ApiCallParams) {
  return async ({
    data,
    resourceId,
  }: {
    data?: T;
    resourceId?: string;
  } = {}): Promise<T> => {
    const options: RequestInit = {
      method: params.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // If the request requires token, pull it from storage or a global config.
    // if (config.tokenRequired) {
    //   const token = localStorage.getItem("authToken"); // Or wherever your token is stored
    //   if (token) {
    //     options.headers["Authorization"] = `Bearer ${token}`;
    //   } else {
    //     throw new Error("Token is required, but not available");
    //   }
    // }
    // Include a body if applicable (skip for GET requests)
    // if (config.method !== "GET" && data) {
    //   options.body = JSON.stringify(data);
    // }

    try {
      const url = resourceId
        ? `${params.baseUrl}/${resourceId}`
        : params.baseUrl;
      // TODO query path
      const response = await fetch(url, options);

      // Check for HTTP errors
      if (!response.ok) {
        throw new Error();
      }

      // Parse and return the JSON response
      return await response.json();
    } catch (error) {
      // Here you could integrate logging, user notifications, etc.
      console.error("API call failed:", error);
      throw error;
    }
  };
}

/**
 * Retrieves the complete list of plants.
 *
 * This API call performs a GET request to the "./api/plants" endpoint.
 * It is designed to fetch an array of TreePlant objects.
 *
 * @returns A promise that resolves to an array of TreePlant objects.
 */
export const getAllPlants = createApiCall<TreePlant[]>({
  method: "GET",
  // baseUrl: import.meta.env.DEV ? "/data-example/alberi.json" : "./api/plants",
  baseUrl: "./api/plants",
});

export const getPlantWithId = async (resourceId: string) =>
  createApiCall<TreePlant>({
    method: "GET",
    baseUrl: import.meta.env.DEV ? "/data-example/alberi.json" : "./api/plants",
  })({ resourceId });
