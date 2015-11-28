export default function canvas(component) {
  component.canvas = document.createElement('canvas');
  document.body.appendChild(component.canvas);
  component.context = component.canvas.getContext('2d');
  component.center = {x: 0, y: 0};

  window.addEventListener('resize', (function resize() {
    component.canvas.width = window.innerWidth;
    component.canvas.height = window.innerHeight;
    component.width = component.canvas.width;
    component.height = component.canvas.height;
    component.center.x = component.canvas.width / 2;
    component.center.y = component.canvas.height / 2;

    return resize;
  }()));
}
