interface State {
  name: string;
  transitions: {
    [name: string]: () => Promise<string>;
  };
  // guard before making a transition
  guard?: () => boolean;
  // send
  effects?: Array<() => void>;
}

interface Sequence<S extends State> {
  initial: string;
  final: string[];
  states: {
    [name: string]: S;
  };
}

/**
 * A generic machine
*/
class Machine<S extends State> {
  sequence: Sequence<S>;
  // aka index to current state
  indexToCurrentState: string;

  /**
   * @constructor
   * @param {Sequence<S>} sequence - A sequence made from states of type S
   */
  constructor(sequence: Sequence<S>) {
    this.sequence = sequence;
    this.indexToCurrentState = sequence.initial;
  }

  getCurrentState() {
    return this.sequence.states[this.indexToCurrentState];
  }

  async transit(name: string) {
    // console.log(`before: ${this.printCurrentState()}`);

    // get the transition named 'name' from current state
    const transition = this.getCurrentState().transitions[name].bind(this)

    // get the name of the next state, change the current state index
    // TODO: what is the 'this' of transition()?
    this.indexToCurrentState = await transition();
    // console.log(`after: ${this.printCurrentState()}`);
  }

  isCurrentInitial() {
    return this.sequence.initial === this.getCurrentState().name;
  }

  isCurrentFinal() {
    return this.sequence.final.includes(this.getCurrentState().name);
  }

  printCurrentState() {
    return JSON.stringify(this.getCurrentState(), null, 2);
  }
}

export type { State, Sequence };
export { Machine };
