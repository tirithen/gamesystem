export default function drawCircle(
  world,
  entityIds,
  positions,
  radiuses
) {
  let canvas = world.getComponentDataFor('canvas', 'canvas');
  let context = canvas.context;

  entityIds.forEach((id, index) => {
    let position = positions[index];
    let radius = radiuses[index].radius;

    context.beginPath();
    context.arc(
      position.x - radius, position.y - radius, radius, 0, Math.PI * 2, true
    );
    context.closePath();
    context.fill();
  });
}

drawCircle.components = [
  'position',
  'radius'
];
