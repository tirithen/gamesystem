// TODO: write tests

export default function playerInput(component, options) {
  function keydown(event) {
    let actionName = options.bind[event.which];
    component.action[event.which] = true;

    if (actionName && !component.action[actionName]) {
      component.action[actionName] = Date.now();
    }

    console.log('Keyup', actionName, component.action[actionName], component.action[event.witch]);
  }

  function keyup(event) {
    let actionName = options.bind[event.which];
    delete component.action[event.which];

    if (actionName) {
      delete component.action[actionName];
    }

    console.log('Keydown', actionName, component.action[event.witch]);
  }

  component.action = {};

  let target = options && options.target ? options.target : document;

  target.addEventListener('keydown', keydown, false);
  target.addEventListener('keyup', keyup, false);
}
