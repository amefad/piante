import type { APIRoute } from "astro";
// export const prerender = false;

const exampleData = {
  meta: {
    description: "Collezione dati di prova per il progetto alberi-monumentali",
  },
  data: [
    {
      "id": 5,
      "number": 123,
      "latitude": 45.8851066,
      "longitude": 12.2921521,
      "height": 15,
      "circumferences": [
        50
      ],
      "common-name": "Quercia",
      "scientific-name": "Quercus ilex",
      "date": "2025-03-16 11:24:39",
      "user": 3,
      "images": [
        {
          "id": 4,
          "file-path": "../uploads/picture.jpg"
        }
      ]
    },
    {
      "id": 6,
      "number": 99,
      "latitude": 45.883334,
      "longitude": 12.29414,
      "height": 15,
      "circumferences": [
        44,
        33,
        22
      ],
      "common-name": "Olmo",
      "scientific-name": "Olmus ìlex",
      "date": "2025-03-16 17:12:21",
      "user": {
        "id": 2,
        "name": "amedeo",
        "email": "fame@libero.it"
      },
      "images": [
        {
          "id": 1,
          "file-path": "../uploads/picture.jpg"
        },
        {
          "id": 2,
          "file-path": "../uploads/schema.jpg"
        }
      ]
    },
    {
      "id": 7,
      "number": 65535,
      "latitude": 45.886529,
      "longitude": 12.301374,
      "height": 23.8,
      "circumferences": [
        12,
        67
      ],
      "common-name": "Alberello",
      "scientific-name": "Alberellius Albus",
      "date": "2025-03-16 17:44:04",
      "user": {
        "id": 1,
        "name": "Michele Salvador",
        "email": "bluelettrico@iol.it"
      },
      "images": [
        {
          "id": 7,
          "file-path": "../uploads/IMG20250123142008.jpg"
        }
      ]
    },
    {
      "id": 10,
      "number": 89,
      "latitude": 45.89385,
      "longitude": 12.29483,
      "height": 18.7,
      "circumferences": [
        60
      ],
      "common-name": "Abete Bianco / Suriname",
      "scientific-name": "Abies Alba",
      "date": "2025-03-17 21:04:57",
      "user": {
        "id": 2,
        "name": "amedeo",
        "email": "fame@libero.it"
      },
      "images": []
    },
    {
      "id": 13,
      "number": 748,
      "latitude": 45.8853066,
      "longitude": 12.2931521,
      "height": 15.5,
      "circumferences": [
        75,
        56
      ],
      "common-name": "Puppo",
      "scientific-name": "Pantofìnùs 🤓",
      "date": "2025-03-22 18:45:34",
      "user": 4,
      "images": [
        {
          "id": 5,
          "file-path": "../uploads/picture.jpg"
        },
        {
          "id": 6,
          "file-path": "../uploads/schema.jpg"
        }
      ]
    }
  ],
};

const customHeaders = new Headers({
  "Content-Type": "application/json",
});
export const GET: APIRoute = () => {
  return new Response(JSON.stringify(exampleData), { headers: customHeaders });
};
