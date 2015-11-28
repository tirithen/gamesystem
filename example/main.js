import World from '../World';

// Components
import playerInput from './componentTypes/playerInput';
import position from './componentTypes/position';

// Entities
import playerAvatar from './entities/playerAvatar';

// Systems
import playerControlPosition from './systems/playerControlPosition';

// Create the world
let world = new World();

// Add component types
world.addComponentType(playerInput);
world.addComponentType(position);

// Add systems
world.addSystem(playerControlPosition);

// Bind keyboard keys
world.addEntity({
  id: 'playerActions',
  playerInput: {
    bind: {
      27: 'HALT',
      32: 'SHOOT',
      37: 'LEFT',
      39: 'RIGHT',
      38: 'UP',
      68: 'DEBUG'
    }
  }
});

// Add the player avatar
world.addEntity(playerAvatar);

console.log('world', world);
