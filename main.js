import {World} from './World.js';
import {keyboardState} from './componentTypes/keyboardState.js';
import {position} from './componentTypes/position.js';
import {radius} from './componentTypes/radius.js';

let world = new World();

world.registerComponentType(keyboardState);
//world.registerComponentType(position);
//world.registerComponentType(radius);

world.addEntry({
  position: {
    x: Math.random() * 100,
    y: Math.random() * 100
  },
  radius: {
    radius: 10
  }
});

console.log('world', world);
