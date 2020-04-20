function getType(param: unknown): string {
  const type: string = Object.prototype.toString.call(param);
  const readableType: string = type.slice(type.indexOf(' ') + 1, type.length - 1);

  return readableType;
}

function compareType(type: string, value: unknown): boolean {
  return type.toLowerCase() === getType(value).toLowerCase();
}

function isNumber(value: unknown): boolean {
  const result: unknown = (value as string).length ? Number(value) : value;

  if (Number.isNaN(result as number)) return false;
  return typeof result === 'number';
}

function isObject(value: unknown): boolean {
  return compareType('object', value);
}

function isBoolean(value: unknown): boolean {
  return typeof value === 'boolean';
}

function isBooleanSpy(value: string): boolean {
  return (value === 'true') || (value === 'false');
}

function isDefined(value: unknown): boolean {
  return (value !== undefined) && (value !== null);
}

function softRounding(num: number): number {
  return Number(num.toFixed(1));
}

function propertyFilter(obj: { [k: string]: any }, props: string[]): { [k: string]: any } {
  const result: { [k: string]: unknown } = {};

  props.forEach((prop: string) => {
    let value: unknown = obj[prop];
    let propName = prop;

    if (prop.includes(':')) {
      const firstPart = prop.split(':')[0];
      const secondPart = prop.split(':')[1];

      if (!firstPart.length) throw new SyntaxError('Invalid value');
      if (!secondPart.length) throw new SyntaxError('Invalid value');

      propName = secondPart;
      value = obj[firstPart];
    }

    isDefined(value) && (result[propName] = value);
  });

  return result;
}

function throttle(fn: Function, wait: number): () => void {
  let isThrottled = false;
  let context: unknown;
  let args: unknown[] | null;

  function wrapper(this: unknown, ...params: unknown[]): void {
    if (isThrottled) {
      args = params;
      context = this;
      return;
    }

    fn.apply(this, params);

    isThrottled = true;

    const handler = (): void => {
      isThrottled = false;

      if (args) {
        wrapper.apply(context, args);
        context = null;
        args = null;
      }
    };

    setTimeout(handler, wait);
  }

  return wrapper;
}

function debounce(fn: Function, wait: number): () => void {
  let timer: any;
  return function wrapper(...params: unknown[]): void {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...params), wait);
  };
}

function hasChild(parent: HTMLElement, child: HTMLElement): boolean {
  return Object.keys(parent.children).some((x, i: number) => parent.children[i] === child);
}

function convertSliderUnitToPercent({ min, max, value }: { [k: string]: number }): number {
  return (100 / (max - min)) * (value - min);
}

function objectReflection(a: object, b: object): object {
  const result = { ...a, ...b };

  Object.keys(a).forEach((key) => {
    !Object.prototype.hasOwnProperty.call(b, key) && delete result[key as keyof object];
  });

  return result;
}

export {
  convertSliderUnitToPercent,
  objectReflection,
  propertyFilter,
  softRounding,
  isBooleanSpy,
  isBoolean,
  isDefined,
  isNumber,
  isObject,
  hasChild,
  debounce,
  throttle,
};
