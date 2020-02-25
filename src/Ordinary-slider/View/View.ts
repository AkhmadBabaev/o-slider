import Observable from '../Observable/Observable';
import Track from './Track/Track';

import { TrackOptions } from './Track/Interfaces';
import { State } from '../Model/Interfaces';

import { isDefined, propertyFilter } from '../helpers/helpers';

class View extends Observable {
  private options: State;

  private root: HTMLElement;

  private track: Track;

  constructor(rootElem: HTMLElement, options: State) {
    super();

    this.root = rootElem;
    this.options = options;
    this.applyState = this.applyState.bind(this);

    this.handlePositionChanged = this.handlePositionChanged.bind(this);
    this.init();
  }

  private init(): void {
    this.root.innerHTML = '';
    this.root.classList.add('o-slider');
    this.root.addEventListener('positionChanged', this.handlePositionChanged as EventListener);

    this.handleTrack();
  }

  public applyState(options: Partial<State>): void {
    this.options = { ...this.options, ...options };

    const hasMin: boolean = isDefined(options.min);
    const hasMax: boolean = isDefined(options.max);
    const hasPosition: boolean = isDefined(options.position);
    const hasTip: boolean = isDefined(options.tip);
    const hasBar: boolean = isDefined(options.bar);

    const isTrackUpdated: boolean = hasMin || hasMax || hasPosition || hasTip || hasBar;
    isTrackUpdated && this.handleTrack(options, 'update');
  }

  private handlePositionChanged(event: CustomEvent): void {
    const { position } = event.detail;
    this.notify({ position });
  }

  private handleTrack(options?: {}, todo?: string): void {
    const storage = (options || this.options) as { [x: string]: unknown };
    const isInit = !isDefined(todo);
    const isUpdate = todo === 'update';

    const propsList: string[] = ['min', 'max', 'position', 'tip', 'bar'];
    const props: Partial<TrackOptions> = propertyFilter(storage, propsList);

    isInit
      && (props.parent = this.root)
      && (this.track = new Track(props as TrackOptions));

    isUpdate && this.track.update(props);
  }
}

export default View;
