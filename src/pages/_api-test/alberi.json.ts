import type { APIRoute } from "astro";
// export const prerender = false;

const exampleData = {
  meta: {
    description: "Collezione dati di prova per il progetto alberi-monumentali",
  },
  data: [
    {
      latitude: "45.88061",
      longitude: "12.28226",
      "scientific-name": "Quercus ilex",
      circumference: "1.8",
      height: "15",
    },
    {
      latitude: "45.88100",
      longitude: "12.28969",
      "scientific-name": "",
      circumference: "",
      height: "14",
    },
    {
      latitude: "45.88477",
      longitude: "12.29379",
      "scientific-name": "Fagus sylvatica",
      circumference: "",
      height: "",
    },
    {
      latitude: "45.88952",
      longitude: "12.29469",
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
