import { Machine, type Step, type Sequence } from "./form-machine";
import { tryLoginUser } from "./api-calls";
import { getCurrentUser, unsetCurrentUser } from "./user-manager";

interface InputControlStepLL {
  id: string;
  type: string;
  required?: boolean;
}

interface FormStepLL extends Step<FormStepNamesLL, FormStepActionsLL> {
  description: string;
  dataSet: number;
  inputs?: InputControlStepLL[];
  data?: any;
  isValid?: boolean;
}

type FormStepNamesLL = "credentials" | "feedback" | "error";
type FormStepActionsLL = "prev" | "next";

// References
const loginForm = document.getElementById("login-form") as HTMLFormElement;
// get only the right inputs
const inputs = Array.from(loginForm.getElementsByTagName("input")).filter(
  (control) =>
    control instanceof HTMLInputElement &&
    control.classList.contains("js-submit")
);

// action buttons
const actionButtons = Array.from(
  loginForm.getElementsByClassName("action-button")
);
// NOTE: button elements are shared by all the steps
const prevButton = document.getElementById(
  "js-login-prev-button"
) as HTMLButtonElement;
const nextButton = document.getElementById(
  "js-login-next-button"
) as HTMLButtonElement;
const closeButton = document.getElementById(
  "js-login-close-button"
) as HTMLButtonElement;
const submitButton = document.getElementById(
  "js-login-submit-button"
) as HTMLButtonElement;
const endButton = document.getElementById(
  "js-login-end-button"
) as HTMLButtonElement;

// const nextButtonSpan = nextButton.querySelector("span")!;
// const closeButtonSpan = closeButton.querySelector("span")!;

// FAB button, open a new form wizard
const loginButton = document.getElementById("js-login-button");
const loginDialog = document.getElementById(
  "login-dialog"
) as HTMLDialogElement;

// declare the machine
let loginMachine: Machine<FormStepLL, FormStepNamesLL, FormStepActionsLL>;
// machine sequence description
const loginSequence: Sequence<FormStepLL, FormStepNamesLL, FormStepActionsLL> =
  {
    initial: "credentials",
    final: ["feedback", "error"],
    states: {
      credentials: {
        name: "credentials",
        description: "Coordinates of the plant",
        dataSet: 1,
        inputs: [
          {
            id: "email",
            type: "email",
            required: true,
          },
          {
            id: "password",
            type: "password",
            required: true,
          },
        ],
        data: {},
        isValid: false,
        transitions: {
          // submit
          next: async function () {
            let loginResult;
            const credentials = getFormData();
            try {
              loginResult = (await tryLoginUser(credentials)) as any;
            } catch (error: any) {
              // this is a network/parsing/... error
              console.log(`login::next::catched::${error}`);
              // ...
            }
            loginForm.reset();
            if (loginResult.message) {
              console.log(loginResult.message);
              return "error";
            }
            console.log("Login OK");
            console.table(loginResult);
            localStorage.setItem("user-data", JSON.stringify(loginResult));
            console.log("storage");
            console.table(getCurrentUser());
            return "feedback";
          },
        },
      },
      feedback: {
        name: "feedback",
        description: "Response from server",
        dataSet: 2,
        transitions: {}, // after sending you cant go back or forth
      },
      error: {
        name: "error",
        description: "Error on submitting to server",
        dataSet: 3,
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
      await loginMachine.transit("prev");
      break;
    }
    // submit is an alias for next (form machine)
    case "next":
    case "submit": {
      // TODO this would be a guard in a machine<FormState>
      if (computeStateValidity()) {
        await loginMachine.transit("next");
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
      loginForm.reset();
      // close dialog
      loginDialog.close("login dialog closed on dismiss");
      // Exit the current machine (doesnt transition to another state)
      // change the machine with a new one
      loginMachine = new Machine(loginSequence);
      // show the add button
      loginButton?.classList.toggle("hidden");
      console.log(`login:: handled action ${action}`);
      break;
    }
    default: {
      console.log("login:: handleButtonAction() >> action not recognized");
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
  if (loginMachine) {
    const currentStepElement = loginForm.querySelector(
      `div.step[data-step="${loginMachine.getCurrentState().dataSet}"]`
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
    loginForm.getElementsByClassName("step")
  ) as HTMLElement[];

  // display only the current step according to formMachine state
  steps.forEach((step) => {
    if (
      Number.parseInt(`${step.dataset["step"]}`) ===
      loginMachine.getCurrentState().dataSet
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
  switch (loginMachine.getCurrentState().name) {
    case "credentials": {
      prevButton.disabled = true;
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
  for (const controlElem of loginForm.elements) {
    if (
      // get only the right inputs
      controlElem instanceof HTMLInputElement &&
      controlElem.classList.contains("js-submit")
    ) {
      data[controlElem.name] = controlElem.value;
    }
  }
  return data;
}

/* always return an object */
// async function mockLogin() {

//   return result;
// }

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
loginButton?.addEventListener("click", (e: Event) => {
  // open form dialog
  loginDialog.show();
  const thisButton = e.currentTarget as HTMLButtonElement;
  console.log(`login:: ${thisButton.id}`);

  // hide the button when dialog is open
  thisButton.classList.toggle("hidden");
  // create a new instance of machine to handle the form
  loginMachine = new Machine(loginSequence);
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
