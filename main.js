import {Pocket} from './Pocket.js';
import {keyboardState} from './componentTypes/keyboardState.js';
import {position} from './componentTypes/position.js';
import {radius} from './componentTypes/radius.js';

let pocket = new Pocket();

pocket.registerComponentType(keyboardState);
pocket.registerComponentType(position);
pocket.registerComponentType(radius);

pocket.addKey({
  position: {
    x: Math.random() * 100,
    y: Math.random() * 100
  },
  radius: {
    radius: 10
  }
});

console.log('pocket', pocket);
