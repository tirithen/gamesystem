export default function playerControlPosition(
  world,
  entityId,
  position
) {
  let speed = 50;
  let action = world.getComponentDataFor('playerActions', 'playerInput').action;

  if (action.up) {
    position.y -= speed * world.deltaTimeSeconds;
  }

  if (action.down) {
    position.y += speed * world.deltaTimeSeconds;
  }

  if (action.left) {
    position.x -= speed * world.deltaTimeSeconds;
  }

  if (action.right) {
    position.x += speed * world.deltaTimeSeconds;
  }
}

playerControlPosition.each = true;

playerControlPosition.components = [
  'position',
  'playerControlled'
];
