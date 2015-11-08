export class Pocket {
  constructor() {
    this.componentTypes = {};
    this.systems = [];
    this.components = {};
    this.keys = [];
    this.labels = [];
    //this.keysToDestroy = {};
    this.keyIdCounter = 0;
  }

  getNextKeyId() {
    return ++this.idCounter;
  }

  registerComponentType(type) {
    this.componentTypes[type.name] = type;
  }

  addKey(data) {
    // Get the id
    let key = data.id ? data.id : this.getNextId();

    // If data is already taken, set a new one
    if (data.id && this.keys.indexOf(data.id) !== -1) {
      keyId = this.getNextKeyId();
      console.warn('Id taken, changing id "' + data.id + '" to "' + keyId + '"');
    }

    // Save the new id
    this.keys.push(keyId);

    // Add all listed components to this key
    Object.keys(data).forEach(function(componentTypeName) {
      this.addComponentToKey(keyId, componentTypeName, data[componentTypeName]);
    }, this);

    return keyId;
  }

  addComponentToKey(keyId, componentTypeName, options) {
    if (this.keys.indexOf(key) === -1) {
      throw new Error('Could not find key with id "' + keyId + '"');
    }

    // Add component instance object if it does not exist for current component type
    if (!this.components[componentTypeName]) {
      this.components[componentTypeName] = {};
    }

    let components = this.components[componentTypeName];
    let component = components[keyId];

    // Create a new component for this key and compnent type if not created already
    if (!component) {
      component = components[keyId] = {};
      let componentType = this.componentTypes[componentTypeName];

      if (componentType) {
        componentType(component, options || {});
      } else if (this.labels.indexOf(componentTypeName) === -1) {
        this.labels.push(componentTypeName);
        console.log('Component type "' + componentTypeName + '" not found, assuming it is a label');
      }
    }
  }
}
