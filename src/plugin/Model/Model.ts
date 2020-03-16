import Observable from '../Observable/Observable';
import defaultState from './defaultState';

import { State, PState } from './Interfaces';

import {
  isObject, isBoolean, isNumber,
  isDefined, softRounding, objectReflection,
} from '../helpers/helpers';

class Model extends Observable {
  private state: State = defaultState;

  private temporaryState: State;

  private changes: PState;

  constructor(options: PState = {}) {
    super();

    this.setState = this.setState.bind(this);
    Object.keys(options).length && this.setState(options, false);
  }

  public setState(properties: PState, notify = true): void {
    // no arguments
    if (!arguments.length) throw new Error('setState has not arguments');

    // wrong type of the first argument
    if (!isObject(properties)) throw new TypeError('The first setState argument is not an object');

    // no properties for change
    if (!Object.keys(properties).length) throw new Error('seState got an empty object');

    // wrong the second argument
    if (!isBoolean(notify)) throw new TypeError('The second setState argument is not a boolean');

    // notify about unnecessary arguments
    if (arguments.length > 2) console.warn('setState should contain no more than 2 arguments');

    // storage of changed properties
    this.changes = objectReflection(this.getState(), properties);

    // check and correct types of changes properties
    this.validateChanges();

    // Delete duplicated values from changes properties
    this.deleteDuplicates();

    // temporary storage contained old state and current changes
    this.temporaryState = { ...this.getState(), ...this.changes } as State;

    // handle gotten properties
    Object.keys(this.changes).forEach((key) => this.handleProperty(key));

    // sort values From|To in changes and temporary state
    this.sortFromTo();

    // notify subscribers about state changes
    Object.keys(this.changes).length && notify && this.notify(this.changes);

    // set as state
    this.state = this.temporaryState;

    // this is no longer necessary
    delete this.temporaryState;
    delete this.changes;
  }

  public getState(): State {
    return this.state;
  }

  public reset(): void {
    Object.keys(this.state).forEach((key) => {
      !Object.prototype.hasOwnProperty.call(defaultState, key)
        && delete this.state[key as keyof State];
    });

    this.setState(defaultState);
  }

  private handleMin(): void {
    let { min } = this.temporaryState;
    const {
      max, step, from, to,
    } = this.temporaryState;

    const isGreaterThanFrom = min > from;
    const isGreaterThanTo = min > (to as number);
    const gap = max - min;

    min >= max && (min = max - 1);
    min = softRounding(min);

    this.changes.min = min;
    this.temporaryState.min = min;

    // update related properties
    const isStepUpdated = isDefined(this.changes.step);
    const isFromUpdated = isDefined(this.changes.from);
    const isToUpdated = isDefined(this.changes.from);

    !isStepUpdated && (step > gap) && this.handleStep();
    !isFromUpdated && isGreaterThanFrom && this.handleFrom();
    !isToUpdated && isGreaterThanTo && this.handleTo();
  }

  private handleMax(): void {
    let { max } = this.temporaryState;
    const {
      min, step, from, to,
    } = this.temporaryState;

    const isLessThanFrom = max < from;
    const isLessThanTo = max < (to as number);
    const gap = max - min;

    max <= min && (max = min + 1);
    max = softRounding(max);

    this.changes.max = max;
    this.temporaryState.max = max;

    // update related properties
    const isStepUpdated = isDefined(this.changes.step);
    const isFromUpdated = isDefined(this.changes.from);
    const isToUpdated = isDefined(this.changes.to);

    !isStepUpdated && (step > gap) && this.handleStep();
    !isFromUpdated && isLessThanFrom && this.handleFrom();
    !isToUpdated && isLessThanTo && this.handleTo();
  }

  private handleStep(): void {
    let { step } = this.temporaryState;
    const { min, max } = this.temporaryState;
    const gap = max - min;

    step <= 0 && (step = 0.5);
    step > gap && (step = gap);
    step = softRounding(step);

    this.changes.step = step;
    this.temporaryState.step = step;

    // update related property
    const isFromUpdated = isDefined(this.changes.from);
    const isToUpdated = isDefined(this.changes.to);

    !isFromUpdated && this.handleFrom();
    !isToUpdated && this.handleTo();
  }

  private handleValue(param: number): number {
    let value = param;
    const { min, max, step } = this.temporaryState;
    const remainder = (value - min) % step;

    if (remainder !== 0) {
      const halfStep = step / 2;
      value = (halfStep > remainder)
        ? value - remainder // below point
        : value - remainder + step; // above point
    }

    value < min && (value = min);
    value > max && (value = max);
    return softRounding(value);
  }

  private handleFrom(): void {
    const from = this.handleValue(this.temporaryState.from);

    this.changes.from = from;
    this.temporaryState.from = from;
  }

  private handleTo(): void {
    if (!this.temporaryState.range) return;
    const to = this.handleValue(this.temporaryState.to as number);

    this.changes.to = to;
    this.temporaryState.to = to;
  }

  private handleRange(): void {
    if (!this.temporaryState.range || isDefined(this.temporaryState.to)) return;

    const to = this.handleValue(this.temporaryState.max);

    this.changes.to = to;
    this.temporaryState.to = to;
  }

  private validateChanges(): void {
    Object.keys(this.changes).forEach((prop) => {
      const value = this.changes[prop as keyof State];

      switch (prop) {
        case 'from':
        case 'to':
        case 'step':
        case 'min':
        case 'max':
          if (!isNumber(value)) throw new TypeError(`${prop} is not number`);
          if (!Number.isFinite(value as number)) throw new Error(`${prop} is Infinity`);
          this.changes[prop] = Number(value);
          break;

        case 'tip':
        case 'bar':
        case 'range':
        case 'vertical':
          if (!isBoolean(value)) throw new TypeError(`${prop} is not a boolean`);
          break;

        default: throw new Error(`${prop} is non existed property`);
      }
    });
  }

  private handleProperty(property: string): void {
    switch (property) {
      case 'range': this.handleRange(); break;
      case 'from': this.handleFrom(); break;
      case 'to': this.handleTo(); break;
      case 'min': this.handleMin(); break;
      case 'max': this.handleMax(); break;
      case 'step': this.handleStep(); break;
      default: break;
    }
  }

  private deleteDuplicates(): void {
    Object.keys(this.changes).forEach((key) => {
      const value = this.changes[key as keyof State];
      this.getState()[key as keyof State] === value && delete this.changes[key as keyof State];
    });
  }

  private sortFromTo(): void {
    if (!this.temporaryState.range) return;

    const values = [this.temporaryState.from, this.temporaryState.to as number];
    values.sort((a, b) => a - b);

    [this.changes.from, this.changes.to] = values;
    this.temporaryState = { ...this.temporaryState, ...this.changes };
  }
}

export default Model;
