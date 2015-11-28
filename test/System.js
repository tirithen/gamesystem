let should = require('chai').should();

import System from '../System';
import World from '../World';

describe('System', () => {
  let system = new System('test', ['comp1', 'comp2'], () => {});

  it('should have property name', () => {
    system.name.should.equal('test');
  });

  it('should have property components', () => {
    system.components.should.be.an('array');
    system.components.should.have.length(2);
    system.components[0].should.equal('comp1');
    system.components[1].should.equal('comp2');
  });

  it('should have property each that default to false', () => {
    system.each.should.equal(false);
  });

  it('should have method action', () => {
    system.action.should.be.instanceof(Function);
  });

  it('should have method tick', () => {
    system.tick.should.be.instanceof(Function);
  });

  it(
    'should have possiblity to create system with property each as true',
    () => {
      let system = new System('test', ['comp1', 'comp2'], () => {}, true);
      system.components.should.be.an('array');
      system.components.should.have.length(2);
      system.components[0].should.equal('comp1');
      system.components[1].should.equal('comp2');
      system.action.should.be.instanceof(Function);
      system.each.should.equal(true);
    }
  );

  describe('#getIdsMatchingRequiredComponents', () => {
    let world = {
      components: {
        position: {
          51: {},
          1: {},
          15: {},
          83: {}
        },
        rotation: {
          3451: {},
          52: {},
          71: {},
          2: {},
          1: {},
          15: {}
        }
      },
      ids: {
        51: true,
        1: true,
        15: true,
        83: true,
        3451: true,
        52: true,
        71: true,
        2: true
      }
    };

    let requiredComponents = ['position', 'rotation'];

    it('should return an array of ids that has all required components', () => {
      let system = new System('test', requiredComponents, () => {}, true);
      let ids = system.getIdsMatchingRequiredComponents(
        world.ids,
        world.components
      );

      ids.should.be.an.instanceof(Array);
      ids.length.should.equal(2);
      ids.should.contain('1');
      ids.should.contain('15');
    });

    it('should also be possible to use an array with ids as input', () => {
      let idsArray = [51, 1, 15, 83, 3451, 52, 71, 2];
      let system = new System('test', requiredComponents, () => {}, true);
      let ids = system.getIdsMatchingRequiredComponents(
        idsArray,
        world.components
      );

      ids.should.be.an.instanceof(Array);
      ids.length.should.equal(2);
      ids.should.contain('1');
      ids.should.contain('15');
    });
  });

  describe('#getComponentDataForIds', () => {
    let world = {
      components: {
        rotation: {
          3451: 23466,
          52: 7542,
          71: 4561,
          2: 7264,
          1: 27452,
          15: 7755
        },
        position: {
          51: 542,
          1: 345235,
          15: 23,
          83: 2
        }
      },
      ids: {
        51: true,
        1: true,
        15: true,
        83: true,
        3451: true,
        52: true,
        71: true,
        2: true
      }
    };

    let requiredComponents = ['position', 'rotation'];
    let ids = [15, 1];

    it(
      'should return data from all ids that has all required components',
      () => {
        let system = new System('test', requiredComponents, () => {}, true);
        let data = system.getComponentDataForIds(ids, world.components);

        data.should.be.an.instanceof(Array);
        data[0].should.be.an.instanceof(Array);
        data[0][0].should.equal(23);
        data[0][1].should.equal(345235);
        data[1].should.be.an.instanceof(Array);
        data[1][0].should.equal(7755);
        data[1][1].should.equal(27452);
      }
    );
  });

  describe('#tick', () => {
    it(
      'should have functionality to tick a system into a new state so that it' +
      ' updates component data',
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

    it(
      'should have functionality to tick an "each system" into a new state ' +
      'so that it updates component data',
      () => {
        let world = new World();

        world.addComponentType('distance', (component, options) => {
          component.distance = options.distance;
        });

        world.addSystem({
          name: 'distanceUpdate',
          components: ['distance'],
          each: true,
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
});
