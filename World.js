import System from './System';

export default class World {
  constructor() {
    this.components = {};
    this.componentTypes = {};
    this.labels = {};
    this.ids = [];
    this.systems = [];
    this.lastId = 1;
  }

  addComponentType(name, initializer) {
    if (this.componentTypes[name]) {
      console.warn(
        'Component type "' + name + '" was added already, overriding it'
      );
    }

    this.componentTypes[name] = initializer;
  }

  addComponentForId(id, name, data) {
    if (!this.ids[id]) {
      throw new Error('The provided id "' + id + '" is not registered');
    }

    this.components[name] = this.components[name] || {};
    this.components[name][id] = this.components[name][id] || {};

    if (this.componentTypes[name]) {
      this.componentTypes[name](this.components[name][id], data || {});
    } else {
      console.log(
        'Component type "' + name + '" is not registered, assuming label'
      );
      this.labels[name] = true;
    }
  }

  generateNewId(suggestedId) {
    let id;

    if (suggestedId && !this.ids[suggestedId]) {
      this.ids[suggestedId] = true;
      id = suggestedId;
    } else if (suggestedId) {
      console.warn(
        'The requested id "' + suggestedId + '" was taken, generating a new one'
      );
    }

    if (!id) {
      while (this.ids[this.lastId]) {
        this.lastId += 1;
      }

      id = this.lastId;
      this.ids[id] = true;
    }

    return id;
  }

  addEntity(data) {
    let id = this.generateNewId(data.id);
    delete data.id;

    Object.keys(data).forEach((name) => {
      this.addComponentForId(id, name, data[name]);
    });

    return id;
  }

  addSystem(name, requiredComponents, action) {
    this.systems.push(new System(name, requiredComponents, action));
  }
}
