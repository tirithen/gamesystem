import position from '../../../example/componentTypes/position';
import World from '../../../World';

describe('componentTypes', () => {
  describe('position', () => {
    let component = {};
    position(component, {x: 6, z: 3});

    it(
      'should create a position object and default zero when value is missing',
      () => {
        component.should.be.instanceof(Object);
        component.x.should.equal(6);
        component.y.should.equal(0);
        component.z.should.equal(3);
      }
    );

    it('should add component position to entity', () => {
      let world = new World();
      world.addComponentType(position);
      world.addEntity({position: {x: 12, y: 3}});
      world.components.position[1].x.should.equal(12);
      world.components.position[1].y.should.equal(3);
      world.components.position[1].z.should.equal(0);
    });
  });
});
