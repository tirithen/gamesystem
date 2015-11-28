export default class System {
  constructor(name, components, action, each) {
    this.name = name;
    this.components = components;
    this.action = action;
    this.each = !!each;
  }

  tick(world) {
    // Get the data for the system
    let data;
    if (this.each) {
      data = this.runActionEach(world);
    } else {
      data = this.runAction(world);
    }
  }

  runActionEach(world) {
    let ids = this.getIdsMatchingRequiredComponents(
      world.ids,
      world.components
    );
    let data = this.getComponentDataForIds(ids, world.components);

    // Run the system
    this.action.apply(this, data);
  }

  runAction(world) {
    let ids = this.getIdsMatchingRequiredComponents(
      world.ids,
      world.components
    );
    let data = this.getComponentDataForIds(ids, world.components);

    // Run the system
    this.action.apply(this, [world, ids].concat(data));
  }

  getIdsMatchingRequiredComponents(worldIds, worldComponents) {
    let ids = [];

    if (!Array.isArray(worldIds) && worldIds instanceof Object) {
      worldIds = Object.keys(worldIds);
    }

    worldIds.forEach((id) => {
      let meetsRequirements = true;

      this.components.forEach((name) => {
        if (!worldComponents[name][id]) {
          meetsRequirements = false;
        }
      });

      if (meetsRequirements) {
        // Add id and Make sure that the id is returned as string
        ids.push(id.toString());
      }
    });

    return ids;
  }

  getComponentDataForIds(ids, worldComponents) {
    let data = [];

    this.components.forEach((name, nameIndex) => {
      ids.forEach((id, idIndex) => {
        if (!data[nameIndex]) {
          data[nameIndex] = [];
        }

        if (worldComponents[name] && worldComponents[name][id]) {
          data[nameIndex][idIndex] = worldComponents[name][id];
        }
      });
    });

    return data;
  }
}
/*
// datas contain all keys that have any of the names, not
// an intersection.
var datas = system.requiredComponents.map(this.indexedData)

// keys is an intersection.
var keys = this.keysMatching.apply(this, system.requiredComponents);

// No data matches this system's requirements.
if (!keys.length && system.requiredComponents.length > 0) continue;

// Prepare to be used as arguments.
datas.unshift(keys);
datas.unshift(this);
system.action.apply(system, datas);
*/
