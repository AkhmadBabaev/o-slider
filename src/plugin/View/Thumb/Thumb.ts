import Simple from '../Templates/Simple/Simple';
import Tip from '../Tip/Tip';

import { ThumbOptions } from './Interfaces';
import { TipOptions } from '../Tip/Interfaces';

import {
  isDefined, convertValueUnitToPercent, throttle,
} from '../../helpers/helpers';

class Thumb extends Simple<ThumbOptions> {
  private tip: Tip;

  constructor(options: ThumbOptions) {
    super(options);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.init();
  }

  protected init(): void {
    this.createElement('div', { class: 'o-slider__thumb' });
    this.element.addEventListener('mousedown', this.handleMouseDown);

    this.handleTip();
    this.setPosition();

    this.options.parent.append(this.element);
  }

  public update(options: Partial<ThumbOptions>): void {
    super.update(options);

    const hasValue: boolean = isDefined(options.value);
    const hasRatio: boolean = isDefined(options.ratio);
    const hasTip: boolean = isDefined(options.tip);

    const isPositionUpdated = hasValue || hasRatio;
    isPositionUpdated && this.setPosition();

    const isTipUpdated = hasValue || hasTip;
    isTipUpdated && this.handleTip(options, 'update');
  }

  private setPosition(): void {
    const { value, min, max } = this.options;
    const left = convertValueUnitToPercent({ min, max, value });

    requestAnimationFrame(() => {
      this.element.style.left = left;
    });
  }

  private handleMouseDown(mouseDownEvent: MouseEvent): void {
    const currentTarget = mouseDownEvent.currentTarget as HTMLElement;
    const target = mouseDownEvent.target as HTMLElement;
    const { offsetX, which } = mouseDownEvent;

    const isLeftClick: boolean = which === 1;
    if (!isLeftClick) return;

    currentTarget.classList.add('o-slider__thumb_active');
    document.body.classList.add('o-slider-grabbed');

    const { min, ratio, parent } = this.options;

    const width: number = target.clientWidth;
    const shiftX: number = offsetX - (width / 2);
    const parentX: number = parent.getBoundingClientRect().x;

    let handleMouseMove = ({ clientX }: MouseEvent): void => {
      const position: number = clientX - parentX - shiftX;
      const value: number = position / ratio + min;

      this.element.dispatchEvent(new CustomEvent('positionChanged', {
        bubbles: true,
        detail: { value },
      }));
    };

    handleMouseMove = throttle(handleMouseMove, 40);

    const handleMouseUp = (): void => {
      currentTarget.classList.remove('o-slider__thumb_active');
      document.body.classList.remove('o-slider-grabbed');

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    mouseDownEvent.preventDefault();
  }

  private handleTip(options?: {}, todo?: string): void {
    const storage = (options || this.options) as { [k: string]: unknown };
    const props: Partial<TipOptions> = {};
    const isInit = !isDefined(todo);
    const isUpdate = todo === 'update';

    isDefined(storage.tip) && (props.isEnabled = storage.tip as boolean);
    isDefined(storage.value) && (props.text = storage.value as string);

    isInit
      && (props.parent = this.element)
      && (this.tip = new Tip(props as TipOptions));

    isUpdate && this.tip.update(props);
  }
}

export default Thumb;
