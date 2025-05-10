import { getAllPlants } from "./api-calls";
import type { TreePlant } from "src/consts";
import { addNewLayerToTrees } from "../scripts/use-map";

async function init() {
  try {
    const result = await getAllPlants();
    if (result.message) {
      throw new Error(result.message);
    } else if (Array.isArray(result)) {
      return result.forEach(addNewLayerToTrees);
    } else {
      throw new Error("formato non riconosciuto");
    }
    // array of trees
  } catch (error: any) {
    // generic error
    console.error(error.message);
  }
}

init();
