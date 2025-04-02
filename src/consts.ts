// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
export const SITE_TITLE = "Alberi Monumentali";
export const SITE_DESCRIPTION = "Censimento degli alberi monumentali in città";

export type Species = {
  scientificName: string;
  altName?: Array<{
    loc: string;
    commonNames: string[];
  }>;
  wikidataRef?: string;
};

export type Measure = {
  value: number;
  unitOfMeasure: "mm" | "cm" | "m";
};

export type Arbor = {
  species?: Species;
  // leafCycle?: "deciduous" | "evergreen" | "semi_deciduous" | "semi_evergreen";
  // leafType?: "broadleaved" | "needleleaved";
  circumference?: Measure;
  diameter?: Measure;
  height?: Measure;
  crownDiameter?: Measure;
  location: {
    lat: number;
    lng: number;
  };
};

const exampleSpecies: Species = {
  scientificName: "Quercus ilex",
  altName: [
    {
      loc: "EN",
      commonNames: ["holm Oak"],
    },
    {
      loc: "IT",
      commonNames: ["leccio", "elce"],
    },
    { loc: "FR", commonNames: ["Chêne vert"] },
  ],
  wikidataRef: "q1234",
};

const exampleArbor: Arbor = {
  species: exampleSpecies,
  height: { unitOfMeasure: "m", value: 10 },
  location: { lat: 0.45, lng: 4.55 },
};

const exampleArbor2: Arbor = {
  // leafCycle: "evergreen",
  // leafType: "broadleaved",
  circumference: { unitOfMeasure: "cm", value: 50 },
  location: { lat: 0.45, lng: 4.55 },
};
