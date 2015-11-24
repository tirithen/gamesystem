let should = require('chai').should();

import System from '../System';

describe('System', () => {
  let system = new System('test', ['comp1', 'comp2'], () => {});

  it('should have property name', () => {
    system.name.should.equal('test');
  });

  it('should have property requiredComponents', () => {
    system.requiredComponents.should.be.an('array');
    system.requiredComponents.should.have.length(2);
    system.requiredComponents[0].should.equal('comp1');
    system.requiredComponents[1].should.equal('comp2');
  });

  it('should have property action', () => {
    system.action.should.be.instanceof(Function);
  });
});
