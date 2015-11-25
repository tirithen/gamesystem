import World from './World.js';
import keyboardState from './componentTypes/keyboardState.js';
import position from './componentTypes/position.js';

let world = new World();

world.addComponentType(keyboardState);
world.addComponentType(position);

world.addEntity(
  {
    position: {
      x: Math.random() * 100,
      y: Math.random() * 100
    }
  }
);

console.log('world', world);
