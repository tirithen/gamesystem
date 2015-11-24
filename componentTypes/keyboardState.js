// TODO: write tests

export default function keyboardState(component, options) {
  function keydown(event) {
    component.pressed[event.keyCode] = true;
    console.log('Keydown', event.keyCode);
  }

  function keyup(event) {
    component.pressed[event.keyCode] = false;
    console.log('Keyup', event.keyCode);
  }

  component.pressed = {};

  let target = options && options.target ? options.target : document;

  target.addEventListener('keydown', keydown, false);
  target.addEventListener('keyup', keyup, false);
}
