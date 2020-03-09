import Simple from '../Templates/Simple/Simple';
import Tip from '../Tip/Tip';

import { ThumbOptions, PThumbOptions } from './Interfaces';
import { TipOptions, PTipOptions } from '../Tip/Interfaces';

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

    this.tip = this.handleTip({ ...this.options }) as Tip;
    this.setPosition();

    this.options.parent.append(this.element);
    this.element.addEventListener('mousedown', this.handleMouseDown);
  }

  public update(options: PThumbOptions): void {
    super.update(options);

    const hasValue = isDefined(options.value);
    const hasRatio = isDefined(options.ratio);
    const hasTip = isDefined(options.tip);

    const isPositionUpdated = hasValue || hasRatio;
    const isTipUpdated = hasValue || hasTip;

    isPositionUpdated && this.setPosition();
    isTipUpdated && this.tip.update(this.handleTip(options, 'update') as PTipOptions);
  }

  private setPosition(): void {
    const { value, min, max } = this.options;
    const left = convertValueUnitToPercent({ min, max, value });

    requestAnimationFrame(() => { this.element.style.left = left; });
  }

  private handleMouseDown(mouseDownEvent: MouseEvent): void {
    const currentTarget = mouseDownEvent.currentTarget as HTMLElement;
    const target = mouseDownEvent.target as HTMLElement;
    const { offsetX, which } = mouseDownEvent;

    // if it isn't left click
    if (!(which === 1)) return;

    currentTarget.classList.add('o-slider__thumb_active');
    document.body.classList.add('o-slider-grabbed');

    const { min, ratio, parent } = this.options;

    const width = target.clientWidth;
    const shiftX = offsetX - (width / 2);
    const parentX = parent.getBoundingClientRect().x;

    let handleMouseMove = ({ clientX }: MouseEvent): void => {
      const position = clientX - parentX - shiftX;
      const value = position / ratio + min;

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

  private handleTip(
    options: { [k: string]: unknown },
    todo: 'init' | 'update' = 'init',
  ): Tip | PTipOptions {
    const props: PTipOptions = {};
    const isUpdate = todo === 'update';

    isDefined(options.tip) && (props.isEnabled = options.tip as boolean);
    isDefined(options.value) && (props.text = options.value as string);

    if (isUpdate) return props;

    props.parent = this.element;
    return new Tip(props as TipOptions);
  }
}

export default Thumb;