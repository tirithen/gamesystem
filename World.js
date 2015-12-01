'use strict';

import System from './System';

export default class World {
  constructor() {
    this.components = {};
    this.componentTypes = {};
    this.labels = {};
    this.ids = {};
    this.systems = [];
    this.lastId = 1;
    this.entitiesToDestroy = {};
    this.time = 0;
    this.timeSeconds = 0;
    this.deltaTime = 0;
    this.deltaTimeSeconds = 0;
  }

  tick(deltaTime) {
    // Update the world time
    this.deltaTime = deltaTime;
    this.time += deltaTime;
    this.deltaTimeSeconds = this.deltaTime / 1000;
    this.timeSeconds = this.time / 1000;

    // Actually destroy queued keys, to avoid undefined components
    // during the tick in which they are destroyed.
    Object.keys(this.entitiesToDestroy).forEach((id) => {
      this.immediatelyDestroyEntity(id);
    });

    // Run the systems
    this.systems.forEach((system) => {
      system.tick(this);
    });
  }

  addComponentType(nameOrInitializer, initializer) {
    let name = '';

    if (
      typeof nameOrInitializer === 'string' &&
      initializer instanceof Function
    ) {
      name = nameOrInitializer;
    } else if (nameOrInitializer instanceof Function) {
      name = nameOrInitializer.name;
      initializer = nameOrInitializer;
    } else {
      throw new Error(
        'addComponentType requires first argument as named function or first ' +
        'argument as string and second as a function'
      );
    }

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

  addSystem(objectOrFunction) {
    if (objectOrFunction instanceof Function) {
      objectOrFunction.action = objectOrFunction;
    }

    this.systems.push(new System(
      objectOrFunction.name,
      objectOrFunction.components,
      objectOrFunction.action,
      objectOrFunction.each
    ));
  }

  destroyEntity(id) {
    if (!this.ids[id]) {
      throw new Error('There is no registered entity with the id "' + id + '"');
    }

    this.entitiesToDestroy[id] = true;
  }

  getComponentDataFor(id, componentTypeName) {
    if (!this.components[componentTypeName]) {
      throw new Error(
        'Component type "' + componentTypeName + '" is not registered'
      );
    }

    if (!this.components[componentTypeName][id]) {
      throw new Error(
        'No data for id "' + id + '" and component type ' +
        '"' + componentTypeName + '"'
      );
    }

    return this.components[componentTypeName][id];
  }

  immediatelyDestroyEntity(id) {
    // TODO: make sure to properly delete any instances related to the entity
    //       but are registered in external frameworks like THREE.js
    // Run destroyEntity to make sure that it is properly marked for deletion
    this.destroyEntity(id);

    delete this.ids[id];
    delete this.entitiesToDestroy[id];

    Object.keys(this.components).forEach((name) => {
      delete this.components[name][id];
    });
  }
}
