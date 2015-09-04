'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var afterEach = lab.afterEach;
var beforeEach = lab.beforeEach;
var Code = require('code');
var expect = Code.expect;

var sinon = require('sinon');
var infoFetcher = require('../../lib/info-fetcher.js');

describe('index.js unit test', function () {
  beforeEach(function(done) {
    sinon.stub(infoFetcher, 'fetch');
    done();
  });

  afterEach(function(done) {
    infoFetcher.fetch.restore();
    done();
  });

  it('should call fetch', function(done) {
    infoFetcher.fetch.returns();
    require('../../index.js');
    expect(infoFetcher.fetch.called).to.be.true();
    done();
  });
}); // end index.js unit test