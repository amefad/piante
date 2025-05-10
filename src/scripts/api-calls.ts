import type { UserData } from "./user-manager";

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
 * @returns {(input?: { data?: T, resourceId?: string }) => Promise<unknown>}
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
function createApiCall(params: ApiCallParams) {
  return async ({
    data,
    resourceId,
  }: {
    data?: any;
    resourceId?: string;
  } = {}): Promise<{ code: string; payload: any }> => {
    console.log(data);

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
    if (params.method === "POST" && data) {
      options.body = JSON.stringify(data);
    }

    try {
      const url = resourceId
        ? `${params.baseUrl}/${resourceId}`
        : params.baseUrl;
      // TODO query path
      const response = await fetch(url, options);
      // Check for HTTP errors but do not throw
      if (!response.ok) {
        console.log(`api-calls:: ${response.url} says ${response.status}`);
      }
      // Parse and return the JSON response regardless of http code
      return await response.json();
      // {message: ...} | { ... }
    } catch (error) {
      // This is a network/parsing/... error
      console.error("api-call::failed:", error);
      throw error;
    }
  };
}

// export const getAllPlants = createApiCall({
//   method: "GET",
//   baseUrl: "./api/plants",
// });

// export const getPlantWithId = async (resourceId: string) =>
//   createApiCall({
//     method: "GET",
//     baseUrl: import.meta.env.DEV ? "/data-example/alberi.json" : "./api/plants",
//   })({ resourceId });

// export const registerUser = async (userCredentials: string[]) =>
//   createApiCall({
//     method: "POST",
//     baseUrl: "./api/users",
//   })({ data: userCredentials });

/**
 * Retrieves the complete list of plants.
 *
 * This API call performs a GET request to the "./api/plants" endpoint.
 * It is designed to fetch an array of TreePlant objects.
 *
 * @returns A promise that resolves to an array of TreePlant objects.
 * @throws A network/parsing/ecc Error
 */
export async function getAllPlants() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch("./api/plants", options);
    // Check for HTTP errors but do not throw
    if (!response.ok) {
      console.log(`api-calls:: ${response.url} says ${response.status}`);
    }
    // Parse and return the JSON response regardless of http code
    return await response.json();
    // {message: ...} | [{...},{...}]
  } catch (error) {
    // This is a network/parsing/... error
    console.error("api-call::failed:", error);
    throw error;
  }
}

export async function tryPostPlant(plantData: string[]) {
  const userData = localStorage.getItem("user-data");
  if (!userData) {
    return;
  }
  const user = JSON.parse(userData) as UserData;
  const {id } = user
  const payload = { "user-id": id, ...plantData };
  console.table(payload);
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch("./api/plants", options);
    // Check for HTTP errors but do not throw
    if (!response.ok) {
      console.log(`api-calls::tryPostPlant says ${response.status}`);
    }
    // Parse and return the JSON response regardless of http code
    return await response.json();
    // {message: ...} | { user }
  } catch (error) {
    // This is a network/parsing/... error
    console.error("api-call::tryPostPlant failed:", error);
    throw error;
  }
}

/** */
export async function tryLoginUser(userLoginCredentials: string[]) {
  console.table(userLoginCredentials);

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userLoginCredentials),
  };

  try {
    const response = await fetch("./api/session", options);
    // Check for HTTP errors but do not throw
    if (!response.ok) {
      console.log(`api-calls::tryLoginUser says ${response.status}`);
    }
    // Parse and return the JSON response regardless of http code
    return await response.json();
    // {message: ...} | { user }
  } catch (error) {
    // This is a network/parsing/... error
    console.error("api-call::tryLoginUser failed:", error);
    throw error;
  }
}

/** */
export async function tryRegisterUser(userRegisterCredentials: string[]) {
  console.table(userRegisterCredentials);

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userRegisterCredentials),
  };

  try {
    const response = await fetch("./api/users", options);
    // Check for HTTP errors but do not throw
    if (!response.ok) {
      console.log(`api-calls::tryRegisterUser says ${response.status}`);
    }
    // Parse and return the JSON response regardless of http code
    return await response.json();
    // {message: ...} | { token: ... }
  } catch (error) {
    // This is a network/parsing/... error
    console.error("api-call::tryRegisterUser failed:", error);
    throw error;
  }
}
