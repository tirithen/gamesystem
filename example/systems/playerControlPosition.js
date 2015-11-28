export default function playerControlPosition(
  world,
  entityId,
  position
) {
  let action = world.getComponentDataFor('playerActions', 'playerInput').action;
  console.log('action', action);
}

playerControlPosition.each = true;

playerControlPosition.components = [
  'playerInput',
  'position',
  'playerControlled'
];
