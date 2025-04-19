interface Step<N extends string, A extends string> {
  name: N;
  transitions: {
    [action in A]?: () => Promise<N>;
  };
  // guard before making a transition
  guard?: () => boolean;
  // send
  effects?: Array<() => void>;
}

interface Sequence<S extends Step<N, A>, N extends string, A extends string> {
  initial: N;
  final: N[];
  states: {
    [name in N]: S;
  };
}

/**
 * A generic machine
 */
class MachineProcess<S extends Step<N, A>, N extends string, A extends string> {
  
  sequence: Sequence<S, N, A>;
  head: N; // index to current state

  /**
   * @constructor
   * @param {Sequence<S, N>} sequence - A sequence of states
   */
  constructor(sequence: Sequence<S, N, A>) {
    this.sequence = sequence;
    this.head = sequence.initial;
  }

  getCurrentState() : S {
    return this.sequence.states[this.head];
  }

  async transit(action: A): Promise<void> {
    // console.log(`before: ${this.printCurrentState()}`);
    const t = this.getCurrentState().transitions[action];
    // get the transition function from current state

    if(t) {
      // TODO: what is the 'this' of transition()?
      const transition = t.bind(this);
      // get the name of the next state, change the current state index
      this.head = await transition();
    } else {
      // do nothing
    }
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

export type { Step , Sequence };
export { MachineProcess as Machine };
