'use strict';

import World from '../../World';

// Components
import playerInput from './componentTypes/playerInput';
import canvas from './componentTypes/canvas';
import position from './componentTypes/position';
import radius from './componentTypes/radius';

// Entities
import playerAvatar from './entities/playerAvatar';

// Systems
import drawClear from './systems/drawClear';
import drawCircle from './systems/drawCircle';
import playerControlPosition from './systems/playerControlPosition';

// Create the world
let world = new World();

// Add component types
world.addComponentType(playerInput);
world.addComponentType(canvas);
world.addComponentType(position);
world.addComponentType(radius);

// Add entities
world.addEntity({id: 'canvas', 'canvas': undefined});
world.addEntity(playerAvatar);

// Add systems
world.addSystem(drawClear);
world.addSystem(drawCircle);
world.addSystem(playerControlPosition);

// Bind keyboard keys
world.addEntity({
  id: 'playerActions',
  playerInput: {
    bind: {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    }
  }
});

// Start the world
let lastTime = Date.now();
function tick() {
  let currentTime = Date.now();
  let deltaTime = currentTime - lastTime;
  world.tick(deltaTime);
  lastTime = currentTime;
  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);

// Output debug data
setInterval(() => {
  let position = world.getComponentDataFor('playerAvatar', 'position');
  console.log('position', position.x, position.y);
}, 1000);
