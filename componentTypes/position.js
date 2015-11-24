export default function position(component, options) {
  component.position = {
    x: options.x || 0,
    y: options.y || 0,
    z: options.z || 0
  };
}
