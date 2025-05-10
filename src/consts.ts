export const SITE_TITLE = "Piante";
export const SITE_DESCRIPTION = "Mappatura collaborativa del verde pubblico";

export interface User {
  id?: number;
  name: string;
  email: string;
}

export interface Image {
  id: number;
  "file-path": string;
}

export interface TreePlant {
  id?: number;
  number?: number;
  latitude: number;
  longitude: number;
  height?: number;
  circumference?: number;
  "common-name"?: string;
  "scientific-name"?: string;
  date?: string;
  user: User;
  images?: Image[];
}

