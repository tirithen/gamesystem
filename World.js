import System from './System';

export default class World {
  constructor() {
    this.components = {};
    this.componentTypes = {};
    this.labels = {};
    this.ids = [];
    this.systems = [];
    this.lastId = 1;
    this.entitiesToDestroy = {};
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

    // If the value is not an object, wrap it with one
    if (data && !(data instanceof Object)) {
      let value = data;
      data = {};
      data[name] = value;
    }

    // Add branches to the component tree
    this.components[name] = this.components[name] || {};
    this.components[name][id] = this.components[name][id] || {};

    // Run object through the component type function
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

  destroyEntity(id) {
    if (!this.ids[id]) {
      throw new Error('There is no registered entity with the id "' + id + '"');
    }

    this.entitiesToDestroy[id] = true;
  }

  immediatelyDestroyEntity(id) {
    // TODO: make sure to properly delete any instances related to the entity but are registered in external frameworks like THREE.js
    // Run destroyEntity to make sure that it is properly marked for deletion
    this.destroyEntity(id);

    delete this.ids[id];
    delete this.entitiesToDestroy[id];

    Object.keys(this.components).forEach((name) => {
      delete this.components[name][id];
    });
  }
}
