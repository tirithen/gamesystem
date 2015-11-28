export default class System {
  constructor(name, components, action, each) {
    this.name = name;
    this.components = components;
    this.action = action;
    this.each = !!each;
  }

  tick(world) {
    // Get the data for the system
    let ids = this.getIdsMatchingRequiredComponents(
      world.ids,
      world.components
    );
    let data = this.getComponentDataForIds(ids, world.components);

    if (this.each) {
      // Run the system one time per component
      ids.forEach((id, index) => {
        // TODO: improve performance by having this array in the correct format from the start
        let row = data.map((component) => {
          return component[index];
        });

        this.action.apply(this, [world, id].concat(row));
      });
    } else {
      // Run the system
      this.action.apply(this, [world, ids].concat(data));
    }
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
        } else {
          data[nameIndex][idIndex] = undefined;
        }
      });
    });

    return data;
  }
}
