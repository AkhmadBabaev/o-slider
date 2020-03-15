import Thumb from './Thumb';
import Toggler from '../Templates/Toggler/Toggler';

import { ThumbOptions } from './Interfaces';

import { hasChild, testHasInstance } from '../../helpers/helpers';

const options: ThumbOptions = {
  parent: document.body,
  isEnabled: true,
  vertical: false,
  min: 0,
  max: 100,
  value: 0,
  ratio: 3,
  tip: true,
};

const thumb = new Thumb(options);

describe('Thumb', () => {
  test('is an instance of class Toggler',
    () => testHasInstance(thumb, Toggler));

  test('should be added to parent', () => {
    expect(hasChild(thumb.getOptions().parent, thumb.getElement())).toBe(true);
  });

  describe('Position', () => {
    test('should be set as left if vertical is false', async () => {
      thumb.update({ value: 5 });

      await new Promise((res) => requestAnimationFrame(() => res()));
      expect(thumb.getElement().style.left).toBe('5%');
    });

    test('should be set as bottom if vertical is false', async () => {
      thumb.update({ vertical: true, value: 5 });

      await new Promise((res) => requestAnimationFrame(() => res()));
      expect(thumb.getElement().style.bottom).toBe('5%');
    });
  });

  test('contains element tip', () => {
    const isFounded = !!thumb.getElement().querySelector('.o-slider__tip');
    expect(isFounded).toBe(true);
  });
});
