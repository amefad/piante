import type { APIRoute } from "astro";
// export const prerender = false;

const exampleData = {
  meta: {
    description: "Collezione dati di prova per il progetto alberi-monumentali",
  },
  data: [
    {
      lat: "45.88061",
      lng: "12.28226",
      "scientific-name": "Quercus ilex",
      circumference: "1.8",
      height: "15",
    },
    {
      lat: "45.88100",
      lng: "12.28969",
      "scientific-name": "",
      circumference: "",
      height: "14",
    },
    {
      lat: "45.88477",
      lng: "12.29379",
      "scientific-name": "Fagus sylvatica",
      circumference: "",
      height: "",
    },
    {
      lat: "45.88952",
      lng: "12.29469",
      "scientific-name": "Cupressus sempervirens",
      circumference: "1.7",
      height: "30",
    },
  ],
};

const customHeaders = new Headers({
  "Content-Type": "application/json",
});
export const GET: APIRoute = () => {
  return new Response(JSON.stringify(exampleData), { headers: customHeaders });
};
