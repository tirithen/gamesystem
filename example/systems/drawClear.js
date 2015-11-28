export default function drawClear(world) {
  let canvas = world.getComponentDataFor('canvas', 'canvas');
  let context = canvas.context;

  context.clearRect(0, 0, canvas.width, canvas.height);
}

drawClear.components = [
  'canvas'
];
