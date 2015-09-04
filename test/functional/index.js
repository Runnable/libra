'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var after = lab.after;
var afterEach = lab.afterEach;
var before = lab.before;
var beforeEach = lab.beforeEach;
var Code = require('code');
var expect = Code.expect;
var os = require('os');
var syncExec = require('sync-exec');
var path = require('path');

describe('libra functional test', function () {
  it('should return error for no match', function(done) {
    var index = path.resolve(__dirname, '../../', 'index.js');
    var out = syncExec('node ' + index);
    expect(out.stdout).to.equal('');
    expect(JSON.parse(out.stderr).error).to.equal('unable to get process');
    expect(out.status).to.equal(0);
    done();
  });

  if (os.platform() === 'darwin') {
    it('CANT RUN ON OSX: should return data for match');
  } else {
    it('should return data for match', function(done) {
      var index = path.resolve(__dirname, '../../', 'index.js');
      var out = syncExec('LOOKUP_CMD=node LOOKUP_ARGS=--testArgs node ' +
          index + ' --testArgs');
      expect(out.stderr).to.equal('');
      expect(JSON.parse(out.stdout).info).to.exist();
      expect(out.status).to.equal(0);
      done();
    });
  }
});