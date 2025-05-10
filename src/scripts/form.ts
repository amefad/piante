// import type { Arbor, Species } from "../consts";
import {
  addNewLayerToTrees,
  registerClickFunc,
  cleanFormLayer,
} from "../scripts/use-map";
import { tryPostPlant } from "./api-calls";
import { Machine, type Step, type Sequence } from "./form-machine";
// import type { TreePlant } from "src/consts";

interface InputControlStep {
  id: string;
  type: string;
  required?: boolean;
}

interface FormStep extends Step<FormStepNames, FormStepActions> {
  description: string;
  // TODO dataset -> enum
  dataSet: number;
  //
  inputs?: InputControlStep[];
  // TODO hold the data gathered from all the steps visited until now
  data?: any;
  isValid?: boolean;
  // TODO name is
}

// type FormStepNames = keyof typeof formSequence.states;
type FormStepNames =
  | "location"
  | "feedback"
  | "error"
  | "species"
  | "dimensions";
type FormStepActions = "prev" | "next";

/**
 *
 * @param {number} lat latitude in decimal
 * @param {number} lng longitude in decimal
 */
function fillInputOnClick(lat: number, lng: number) {
  console.log(`clicked: ${lat}, ${lng}`);
  // Dispatch synthetic input events
  if (inputLat) {
    // inputLat.value = String(lat).slice(0, 8);
    inputLat.valueAsNumber = lat;
    inputLat.dispatchEvent(new Event("input", { bubbles: true }));
  }
  if (inputLng) {
    // inputLng.value = String(lng).slice(0, 8);
    inputLng.valueAsNumber = lng;
    inputLng.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

let unregisterClickMap: () => void;

// References
const arborForm = document.getElementById("arbor-form") as HTMLFormElement;
const inputLat = arborForm.elements.namedItem("latitude") as HTMLInputElement;
const inputLng = arborForm.elements.namedItem("longitude") as HTMLInputElement;
// get only the right inputs
const inputs = Array.from(arborForm.getElementsByTagName("input")).filter(
  (control) =>
    control instanceof HTMLInputElement &&
    control.classList.contains("js-submit")
);

// action buttons
const actionButtons = Array.from(
  arborForm.getElementsByClassName("action-button")
);
// NOTE: button elements are shared by all the steps
const prevButton = document.getElementById(
  "js-prev-button"
) as HTMLButtonElement;
const nextButton = document.getElementById(
  "js-next-button"
) as HTMLButtonElement;
const closeButton = document.getElementById(
  "js-close-button"
) as HTMLButtonElement;
const submitButton = document.getElementById(
  "js-submit-button"
) as HTMLButtonElement;
const endButton = document.getElementById("js-end-button") as HTMLButtonElement;

// const nextButtonSpan = nextButton.querySelector("span")!;
// const closeButtonSpan = closeButton.querySelector("span")!;

// FAB button, open a new form wizard
const addTreeButton = document.getElementById("add-tree-button");
const formDialog = document.getElementById("form-dialog") as HTMLDialogElement;

// declare the machine
let formMachine: Machine<FormStep, FormStepNames, FormStepActions>;
// machine sequence description
const formSequence: Sequence<FormStep, FormStepNames, FormStepActions> = {
  initial: "location",
  final: ["feedback", "error"],
  states: {
    location: {
      name: "location",
      description: "Coordinates of the plant",
      dataSet: 1,
      inputs: [
        {
          id: "lat",
          type: "number",
          required: true,
        },
        {
          id: "lng",
          type: "number",
          required: true,
        },
      ],
      data: {},
      isValid: false,
      transitions: {
        next: async function () {
          unregisterClickMap();
          return "species";
        },
      },
    },
    species: {
      name: "species",
      description: "Scientific name of the plant",
      dataSet: 2,
      inputs: [
        {
          id: "scientific-name",
          type: "text",
        },
      ],
      data: {},
      isValid: false,
      transitions: {
        prev: async function () {
          unregisterClickMap = registerClickFunc(fillInputOnClick);
          return "location";
        },
        next: async function () {
          return "dimensions";
        },
      },
    },
    dimensions: {
      name: "dimensions",
      description: "Dimensions of the plant",
      dataSet: 3,
      inputs: [
        // TODO plural
        { type: "number", id: "circumference" },
        { type: "number", id: "height" },
      ],
      data: {},
      isValid: false,
      transitions: {
        // submit
        next: async function () {
          let postPlantResult;
          const newPlantData = getFormData();
          console.log(newPlantData);

          // submit has side effects
          // NOTE: need to wait to get the next state
          try {
            postPlantResult = await tryPostPlant(newPlantData);
          } catch (error) {
            // this is a network/parsing/... error
            console.log(`tryPostPlant::catched::${error}`);
            // ...
          }
          console.table(postPlantResult);
          arborForm.reset();
          cleanFormLayer();
          // if ("lat" in postPlantresult && "lng" in postPlantresult) {
          // WARN why does not ts complain?
          // }
          if (postPlantResult.message) {
            console.log(postPlantResult.message);
            return "error";
          }
          addNewLayerToTrees(postPlantResult);
          return "feedback";
        },
        prev: async function () {
          return "species";
        },
      },
    },
    feedback: {
      name: "feedback",
      description: "Response from server",
      dataSet: 4,
      transitions: {}, // after sending you cant go back or forth
    },
    error: {
      name: "error",
      description: "Error on submitting to server",
      dataSet: 5,
      transitions: {}, // after sending you cant go back or forth
      // TODO make possible to change something
    },
  },
};

/**
 * data rendering flow: EVENT -> HANDLER -> MACHINE -> VIEW
 *
 * @param action a string representing the action name associated to the button
 * originated event
 */
async function handleButtonAction(action: string) {
  // note: user is able to click on a button iff
  // he is allowed to take the action associated to the button
  switch (action) {
    case "prev": {
      await formMachine.transit("prev");
      break;
    }
    // submit is an alias for next (form machine)
    case "next":
    case "submit": {
      // TODO this would be a guard in a machine<FormState>
      if (computeStateValidity()) {
        await formMachine.transit("next");

        // TODO this might be not the right place for apply focus
        // when prev or next apply focus to dialog (the first input is 1 tab away)
        // formDialog.focus(); ***
        // WARN: updateFormView is sync
        // updateFormView(); ***
        // else {
        //   console.log(
        //     `machine.transition() >>
        // 		 transition from ${this.currentState.name} on ${actionKey}
        // 		 is not defined or the state validity is ${this.currentState.isValid}`
        //   );
        // }
      } else {
        console.log(
          `handleButtonAction >> cant go next, validity is ${computeStateValidity()}`
        );
      }
      break;
    }
    // end is an alias for close (dialog machine)
    case "close":
    case "end": {
      if (
        formMachine.getCurrentState().name === "location" &&
        unregisterClickMap
      ) {
        unregisterClickMap();
      }
      // reset inputs values
      cleanFormLayer();
      arborForm.reset();
      // close dialog
      formDialog.close("dialog closed on dismiss");
      // Exit the current machine (doesnt transition to another state)
      // change the machine with a new one
      formMachine = new Machine(formSequence);
      // show the add button
      addTreeButton?.classList.toggle("hidden");
      console.log(`handled action ${action}`);
      break;
    }
    default: {
      console.log("handleButtonAction() >> action not recognized");
    }
  }
  // call
  updateFormView();
}

/**
 *
 * @returns {boolean} The validity of the current step calculated from inputs/data
 */
function computeStateValidity(): boolean {
  //
  // currently checking the validity of ALL the fields
  // belonging to the current state/step
  // TODO get inputs names from machine states, get the data inputs from html
  // WARN leaflet has a hidden input field -> log something
  if (formMachine) {
    const currentStepElement = arborForm.querySelector(
      `div.step[data-step="${formMachine.getCurrentState().dataSet}"]`
    );
    const descendantInputs = currentStepElement
      ? Array.from(currentStepElement.getElementsByTagName("input"))
      : [];
    return descendantInputs.every((input) => {
      // NOTE the required attribute is not permitted on inputs with the
      // readonly attribute specified.
      // need manual check that it is not empty
      if (input.readOnly) {
        return (
          (input.value.length > 0 || input.valueAsNumber) &&
          input.validity.valid
        );
      }
      return input.validity.valid;
    });
  }
  // TODO if here there is an error
  return false;
}

/**
 *
 */
function updateFormView() {
  // Step Fieldset
  // get all step boxes available in the DOM
  const steps = Array.from(
    arborForm.getElementsByClassName("step")
  ) as HTMLElement[];

  // display only the current step according to formMachine state
  steps.forEach((step) => {
    if (
      Number.parseInt(`${step.dataset["step"]}`) ===
      formMachine.getCurrentState().dataSet
    ) {
      // current step
      step.classList.add("js-step-enabled");
    } else {
      // not current step
      step.classList.remove("js-step-enabled");
    }
  });

  // Action Buttons
  // restrict the action a user can take

  // function buttonsTable(step: string) {
  switch (formMachine.getCurrentState().name) {
    case "location": {
      prevButton.disabled = true;
      nextButton.disabled = false;
      closeButton.disabled = false;
      submitButton.disabled = true;
      endButton.disabled = true;
      break;
    }
    case "species": {
      prevButton.disabled = false;
      nextButton.disabled = false;
      closeButton.disabled = false;
      submitButton.disabled = true;
      endButton.disabled = true;
      break;
    }
    case "dimensions": {
      prevButton.disabled = false;
      nextButton.disabled = true;
      closeButton.disabled = false;
      submitButton.disabled = false;
      endButton.disabled = true;
      break;
    }
    case "feedback": {
      prevButton.disabled = true;
      nextButton.disabled = true;
      closeButton.disabled = true;
      submitButton.disabled = true;
      endButton.disabled = false;
      break;
    }
    case "error": {
      prevButton.disabled = true;
      nextButton.disabled = true;
      closeButton.disabled = true;
      submitButton.disabled = true;
      endButton.disabled = false;
      break;
    }

    default:
      break;
  }
  if (!computeStateValidity()) {
    nextButton.disabled = true;
    submitButton.disabled = true;
  }
}

/**
 * Get the input data directly from the form elements (not from the machine)
 * TODO get from the machine, do not need formdata
 */
function getFormData() {
  let data: any = {};
  for (const controlElem of arborForm.elements) {
    if (
      // get only the right inputs
      controlElem instanceof HTMLInputElement &&
      controlElem.classList.contains("js-submit")
    ) {
      if (controlElem.value) {
        data[controlElem.name] = controlElem.value;
      }
    }
  }
  return data;
}

/*
 {
"number": 123,
"latitude": 45.8851066,
"longitude": 12.2921521,
"circumferences": [50, 25, 33],
"height": 25.5,
"common-name": "Quercia",
"scientific-name": "Quercus ilex",
"user-id": 2
}
 */

// dont highlight field with value missing
inputs.forEach((input) => {
  // valueMissing is true if the element has a required attribute, but no value,
  if (input.validity.valueMissing) {
    input.classList.add("value-missing");
  }
});

// event listeners
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    // TODO check leading whitespace
    logEvent(e);
    // after writing something remove "missing" class
    if (input.validity.valid) {
      input.classList.remove("value-missing");
    } else {
      if (!input.classList.contains("value-missing")) input.reportValidity();
    }
    // check if ALL the inputs in the current step are valid
    // TODO check only the firing input
    console.log(computeStateValidity());
    updateFormView();
  });
  input.addEventListener("change", (e) => {
    logEvent(e);
    if (input.validity.valid) {
      input.classList.remove("value-missing");
    }
  });
  input.addEventListener("blur", (e) => {
    logEvent(e);
    // if (!input.validity.valid) {
    //   input.classList.remove("value-missing");
    // }
  });
});

//
addTreeButton?.addEventListener("click", (e: Event) => {
  // open form dialog
  formDialog.show();
  const thisButton = e.currentTarget as HTMLButtonElement;
  console.log(`form:: ${thisButton.id}`);

  // hide the button when dialog is open
  thisButton.classList.toggle("hidden");
  unregisterClickMap = registerClickFunc(fillInputOnClick);
  // create a new instance of machine to handle the form
  formMachine = new Machine(formSequence);
  // render ui based on machine state
  updateFormView();
});

actionButtons.forEach((button) => {
  button.addEventListener("click", (e: Event) => {
    // TODO prevent default
    const target = e.target as HTMLButtonElement;
    // if clicked on children of button
    const targetAncestor = target.closest(
      ".action-button"
    ) as HTMLButtonElement;
    if (targetAncestor) {
      const targetAction = targetAncestor.dataset.action as string;
      console.log(`clicked on ${target} action: ${targetAction}`);
      // is async but do not await
      handleButtonAction(targetAction);
      return;
    }
    console.log(`error: no ancestor found`);
    return;
  });
});

// ----
function logEvent(e: Event) {
  const elem = e.currentTarget as HTMLInputElement;
  console.log(
    `event: ${e.type.toUpperCase()}, id: ${elem.id}, value: ${elem.value}, valid: ${elem.validity.valid}`
  );
}

// TODO whitespace only not use for data
// function transformTo(formData: FormData) {
//   let arbor: Arbor = {
//     location: { lat: 0, lng: 0 },
//   };
//   let species: Species = {
//     scientificName: "non disponibile",
//   };
//   for (const [k, v] of formData.entries()) {
//     console.log(`key: ${k}, value: ${v}`);
//     switch (k) {
//       case "lat":
//         arbor.location.lat = Number(v);
//         break;
//       case "lng":
//         arbor.location.lng = Number(v);
//         break;
//       case "scientific-name":
//         species.scientificName = v as string;
//         break;
//       case "circumference":
//       case "diameter":
//       case "height":
//         // have the same name of object props
//         arbor[k] = { unitOfMeasure: "m", value: Number(v) };
//         break;
//       default:
//         break;
//     }
//   }
//   // include (a copy) of species
//   return { ...arbor, species: { ...species } };
// }
