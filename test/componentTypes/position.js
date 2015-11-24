import position from '../../componentTypes/position';

describe('componentTypes', () => {
  describe('position', () => {
    let component = {};
    position(component, {x: 6, z: 3});

    it(
      'should create a position object and default zero when value is missing',
      () => {
        component.position.should.be.instanceof(Object);
        component.position.x.should.equal(6);
        component.position.y.should.equal(0);
        component.position.z.should.equal(3);
      }
    );
  });
});
