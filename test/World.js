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
    world.ids.should.be.an('array');
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

  describe('#addComponentType', () => {
    let world = new World();
    let initializer = (component, options) => {
      component.name = options.name;
    };

    it('should have functionality to add a component type', () => {
      world.addComponentType.should.be.instanceof(Function);
      world.addComponentType('name', initializer);
      world.componentTypes.name.should.equal(initializer);
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

  describe('#addSystem', () => {
    let world = new World();

    it('should have functionality to add a system', () => {
      world.addSystem.should.be.instanceof(Function);
      world.addSystem('testsystem', ['name'], () => {});
      world.systems[0].name.should.equal('testsystem');
      world.systems[0].requiredComponents.should.be.an('array');
      world.systems[0].requiredComponents[0].should.equal('name');
      world.systems[0].action.should.be.instanceof(Function);
    });
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
