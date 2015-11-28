let should = require('chai').should();

import World from '../World';

describe('World', () => {
  let world = new World();

  it('should have property components', () => {
    world.components.should.be.an('object');
  });

  it('should have property componentTypes', () => {
    world.componentTypes.should.be.an('object');
  });

  it('should have property ids', () => {
    world.ids.should.be.an('object');
  });

  it('should have property lastId', () => {
    world.lastId.should.be.a('number');
  });

  it('should have property labels', () => {
    world.labels.should.be.an('object');
  });

  it('should have property systems', () => {
    world.systems.should.be.an('array');
  });

  it('should have property entitiesToDestroy', () => {
    world.entitiesToDestroy.should.be.an('object');
  });

  it('should have property time', () => {
    world.time.should.be.a('number');
  });

  it('should have property deltaTime', () => {
    world.deltaTime.should.be.a('number');
  });

  it('should have property deltaTimeSeconds', () => {
    world.deltaTimeSeconds.should.be.a('number');
  });

  describe('#addComponentType', () => {
    let world = new World();

    it('should have functionality to add an anonymous component type', () => {
      let componentTypeAnonymous = (component, options) => {
        component.name = options.name;
      };

      world.addComponentType.should.be.instanceof(Function);
      world.addComponentType('name', componentTypeAnonymous);
      world.componentTypes.name.should.equal(componentTypeAnonymous);
    });

    it('should have functionality to add a named component type', () => {
      let componentTypeNamed = function name2(component, options) {
        component.name = options.name;
      };

      world.addComponentType.should.be.instanceof(Function);
      world.addComponentType(componentTypeNamed);
      world.componentTypes.name2.should.equal(componentTypeNamed);
    });
  });

  describe('#addComponentForId', () => {
    let world = new World();
    world.addComponentType('name', (component, options) => {
      component.name = options.name;
    });

    world.ids[123] = true;

    it('should have functionality to add a component to an entity', () => {
      world.addComponentForId.should.be.instanceof(Function);
      world.addComponentForId(123, 'name', {name: 'testname'});
      world.components.name[123].name.should.equal('testname');
    });

    it('should throw error when using invalid id', () => {
      world.addComponentForId.should.be.instanceof(Function);
      (() => {
        world.addComponentForId(123456789, 'name', {name: 'testname'});
      }).should.throw(Error);
    });

    it(
      'should add label whenever a not registered component type name is used',
      () => {
        world.addComponentForId.should.be.instanceof(Function);
        world.addComponentForId(123, 'testlabel');
        world.labels.testlabel.should.equal(true);
      }
    );
  });

  describe('#generateNewId', () => {
    it('should have functionality to generate unique ids', () => {
      let world = new World();

      world.generateNewId.should.be.instanceof(Function);
      let id = world.generateNewId();
      world.ids[id].should.equal(true);
      world.lastId.should.equal(1);
      world.ids[2] = true;
      id = world.generateNewId();
      world.lastId.should.equal(3);
      id = world.generateNewId(3);
      world.lastId.should.equal(4);
    });
  });

  describe('#addEntity', () => {
    it(
      'should have functionality to add an entity without object properties',
      () => {
        let world = new World();
        world.addComponentType('name', (component, options) => {
          component.name = options.name;
        });

        world.addEntity.should.be.instanceof(Function);

        let id = world.addEntity({name: 'testname'});

        id.should.equal(1);
        world.ids[1].should.equal(true);
        world.components.name[1].name.should.equal('testname');
      }
    );

    it(
      'should have functionality to add an entity with object properties',
      () => {
        let world = new World();
        world.addComponentType('name', (component, options) => {
          component.name = options.name;
        });

        world.addEntity.should.be.instanceof(Function);

        let id = world.addEntity({name: {name: 'testname'}});

        id.should.equal(1);
        world.ids[1].should.equal(true);
        world.components.name[1].name.should.equal('testname');
      }
    );

    it('should increment next id counter', () => {
      let world = new World();
      world.ids[2] = true;
      world.addEntity({});
      world.addEntity({});
      world.addEntity({});

      Object.keys(world.ids).length.should.equal(4);
      world.lastId.should.equal(4);
    });
  });

  describe('#getComponentDataFor', () => {
    let world = new World();

    world.addComponentType(function name(component, options) {
      component.name = options.name;
    });

    world.addEntity({name: 'testname123'});

    it('should have functionality to get data for single component', () => {
      let data = world.getComponentDataFor(1, 'name');
      data.should.be.instanceof(Object);
      data.name.should.equal('testname123');
    });
  });

  describe('#tick', () => {
    it('should have tick method', () => {
      let world = new World();
      world.tick.should.be.instanceof(Function);
    });

    it('should have functionality to update time and deltaTime on tick', () => {
      let world = new World();
      world.time.should.equal(0);
      world.deltaTime.should.equal(0);
      world.tick(16);
      world.time.should.equal(16);
      world.deltaTime.should.equal(16);
      world.tick(12);
      world.time.should.equal(28);
      world.deltaTime.should.equal(12);
    });

    it(
      'should have functionality to update timeSeconds and deltaTimeSeconds ' +
      'on tick',
      () => {
        let world = new World();
        world.timeSeconds.should.equal(0);
        world.deltaTimeSeconds.should.equal(0);
        world.tick(16 * 1000);
        world.timeSeconds.should.equal(16);
        world.deltaTimeSeconds.should.equal(16);
        world.tick(12 * 1000);
        world.timeSeconds.should.equal(28);
        world.deltaTimeSeconds.should.equal(12);
      }
    );

    it(
      'should have functionality clean up entities marked for destruction on ' +
      'each tick',
      () => {
        let world = new World();
        world.addEntity({id: 123});
        world.destroyEntity(123);
        world.ids[123].should.equal(true);
        world.tick();
        true.should.equal(!world.ids[123]);
      }
    );

    it(
      'should have functionality to tick the world into a new state so that ' +
      'an "each system" updates component data',
      () => {
        let world = new World();

        world.addComponentType('distance', (component, options) => {
          component.distance = options.distance;
        });

        world.addSystem({
          name: 'distanceUpdate',
          components: ['distance'],
          each: true,
          action: (world, entityId, distance) => {
            distance.distance += 10 * world.deltaTimeSeconds;
          }
        });

        world.addEntity({
          id: 'distanceEntity1',
          distance: 10
        });

        world.addEntity({
          id: 'distanceEntity2',
          distance: 35
        });

        let distance;
        distance = world.getComponentDataFor('distanceEntity1', 'distance');
        distance.distance.should.equal(10);
        distance = world.getComponentDataFor('distanceEntity2', 'distance');
        distance.distance.should.equal(35);
        world.tick(1000);
        distance = world.getComponentDataFor('distanceEntity1', 'distance');
        distance.distance.should.equal(20);
        distance = world.getComponentDataFor('distanceEntity2', 'distance');
        distance.distance.should.equal(45);
        world.tick(5000);
        distance = world.getComponentDataFor('distanceEntity1', 'distance');
        distance.distance.should.equal(70);
        distance = world.getComponentDataFor('distanceEntity2', 'distance');
        distance.distance.should.equal(95);
      }
    );

    it(
      'should have functionality to tick the world into a new state so that ' +
      'a system updates component data',
      () => {
        let world = new World();

        world.addComponentType('distance', (component, options) => {
          component.distance = options.distance;
        });

        world.addSystem({
          name: 'distanceUpdate',
          components: ['distance'],
          action: (world, entityIds, distances) => {
            distances.forEach((distance) => {
              distance.distance += 10 * world.deltaTimeSeconds;
            });
          }
        });

        world.addEntity({
          id: 'distanceEntity1',
          distance: 10
        });

        world.addEntity({
          id: 'distanceEntity2',
          distance: 35
        });

        let distance;
        distance = world.getComponentDataFor('distanceEntity1', 'distance');
        distance.distance.should.equal(10);
        distance = world.getComponentDataFor('distanceEntity2', 'distance');
        distance.distance.should.equal(35);
        world.tick(1000);
        distance = world.getComponentDataFor('distanceEntity1', 'distance');
        distance.distance.should.equal(20);
        distance = world.getComponentDataFor('distanceEntity2', 'distance');
        distance.distance.should.equal(45);
        world.tick(5000);
        distance = world.getComponentDataFor('distanceEntity1', 'distance');
        distance.distance.should.equal(70);
        distance = world.getComponentDataFor('distanceEntity2', 'distance');
        distance.distance.should.equal(95);
      }
    );
  });

  describe('#addSystem', () => {
    it('should have functionality to add a system from function', () => {
      let world = new World();
      world.addSystem.should.be.instanceof(Function);

      function testsystem() {}
      testsystem.components = ['name'];

      world.addSystem(testsystem);
      world.systems[0].name.should.equal('testsystem');
      world.systems[0].components.should.be.an('array');
      world.systems[0].components.length.should.equal(1);
      world.systems[0].components[0].should.equal('name');
      world.systems[0].action.should.be.instanceof(Function);
      world.systems[0].action.should.equal(testsystem);
      world.systems[0].each.should.equal(false);
    });

    it('should have functionality to add a system from object', () => {
      let world = new World();
      world.addSystem.should.be.instanceof(Function);
      let system = {
        name: 'distanceUpdate',
        components: ['distance'],
        action: (world, entityId, distance) => {
          distance.distance += 10 * world.deltaTimeSeconds;
        }
      };
      world.addSystem(system);
      world.systems[0].name.should.equal('distanceUpdate');
      world.systems[0].components.should.be.an('array');
      world.systems[0].components.length.should.equal(1);
      world.systems[0].components[0].should.equal('distance');
      world.systems[0].action.should.be.instanceof(Function);
      world.systems[0].action.should.equal(system.action);
      world.systems[0].each.should.equal(false);
    });

    it(
      'should have functionality to add a system for each component from ' +
      'function',
      () => {
        let world = new World();
        world.addSystem.should.be.instanceof(Function);

        function testsystem() {}
        testsystem.components = ['name'];
        testsystem.each = true;

        world.addSystem(testsystem);
        world.systems[0].name.should.equal('testsystem');
        world.systems[0].components.should.be.an('array');
        world.systems[0].components.length.should.equal(1);
        world.systems[0].components[0].should.equal('name');
        world.systems[0].action.should.be.instanceof(Function);
        world.systems[0].action.should.equal(testsystem);
        world.systems[0].each.should.equal(true);
      }
    );

    it(
      'should have functionality to add a system for each component ' +
      'from object',
      () => {
        let world = new World();
        world.addSystem.should.be.instanceof(Function);
        let system = {
          name: 'distanceUpdate',
          components: ['distance'],
          each: true,
          action: (world, entityId, distance) => {
            distance.distance += 10 * world.deltaTimeSeconds;
          }
        };
        world.addSystem(system);
        world.systems[0].name.should.equal('distanceUpdate');
        world.systems[0].components.should.be.an('array');
        world.systems[0].components.length.should.equal(1);
        world.systems[0].components[0].should.equal('distance');
        world.systems[0].action.should.be.instanceof(Function);
        world.systems[0].action.should.equal(system.action);
        world.systems[0].each.should.equal(true);
      }
    );
  });

  describe('#destroyEntity', () => {
    let world = new World();

    it('should have functionality to mark entity for destruction', () => {
      world.destroyEntity.should.be.instanceof(Function);
      let id = world.addEntity({});
      (() => {
        world.destroyEntity(id);
      }).should.not.throw(Error);
      world.entitiesToDestroy[id].should.equal(true);
    });

    it(
      'should throw an error when trying to destroy non existent entity',
      () => {
        world.destroyEntity.should.be.instanceof(Function);
        let id = 123;
        (() => {
          world.destroyEntity(id);
        }).should.throw(Error);
        should.not.exist(world.entitiesToDestroy[id]);
      }
    );
  });

  describe('#immediatelyDestroyEntity', () => {
    let world = new World();

    world.addComponentType('name', (component, options) => {
      component.name = options.name;
    });

    it('should have functionality to destroy existing entity data', () => {
      world.immediatelyDestroyEntity.should.be.instanceof(Function);
      let id = world.addEntity({name: 'testname'});
      (() => {
        world.immediatelyDestroyEntity(id);
      }).should.not.throw(Error);
      should.not.exist(world.ids[id]);
      should.not.exist(world.components.name[id]);
    });

    it(
      'should throw an error when trying to destroy non existent entity',
      () => {
        world.immediatelyDestroyEntity.should.be.instanceof(Function);
        let id = 123;
        (() => {
          world.immediatelyDestroyEntity(id);
        }).should.throw(Error);
        should.not.exist(world.ids[id]);
      }
    );
  });
});
