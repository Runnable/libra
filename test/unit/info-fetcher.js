'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var afterEach = lab.afterEach;
var beforeEach = lab.beforeEach;
var Code = require('code');
var expect = Code.expect;

var put = require('101/put');
var sinon = require('sinon');
var ps = require('ps-node');
var procpid = require('proc-pid');
var InfoFetcher = require('../../lib/info-fetcher.js');

describe('info-fetcher.js unit test', function () {
  describe('_getProcessPid', function() {
    beforeEach(function(done) {
      sinon.stub(ps, 'lookup');
      done();
    });

    afterEach(function(done) {
      ps.lookup.restore();
      done();
    });

    it('should error if lookup failed', function(done) {
      ps.lookup.yields(new Error('knights of the round'));

      InfoFetcher._getProcessPid(function (err) {
        expect(err).to.exist();
        done();
      });
    });

    it('should error if 0 process found', function(done) {
      ps.lookup.yields(null, []);

      InfoFetcher._getProcessPid(function (err) {
        expect(err).to.exist();
        done();
      });
    });

    it('should error if more then one', function(done) {
      ps.lookup.yields(null, ['1', '2']);

      InfoFetcher._getProcessPid(function (err) {
        expect(err).to.exist();
        done();
      });
    });

    it('should return pid', function(done) {
      ps.lookup.yields(null, [{pid: 9999}]);

      InfoFetcher._getProcessPid(function (err, pid) {
        expect(err).to.not.exist();
        expect(pid).to.equal(9999);
        done();
      });
    });
  }); // end _getProcessPid

  describe('_getProcessInfo', function() {
    var testPid = 9999;

    beforeEach(function(done) {
      sinon.stub(procpid.ProcPidReader.prototype, 'pid');
      done();
    });

    afterEach(function(done) {
      procpid.ProcPidReader.prototype.pid.restore();
      done();
    });

    it('should error if getting data failed', function(done) {
      procpid.ProcPidReader.prototype.pid.yields(new Error('knights of the round'));

      InfoFetcher._getProcessInfo(testPid, function (err) {
        expect(err).to.exist();
        done();
      });
    });

    it('should error if no data returned', function(done) {
      procpid.ProcPidReader.prototype.pid.yields(null, null);

      InfoFetcher._getProcessInfo(testPid, function (err) {
        expect(err).to.exist();
        done();
      });
    });

    it('should return data', function(done) {
      var testIo = {
        ioTest: 'data'
      };

      var testStatus = {
        FDSize: '1',
        VmPeak: '2',
        VmSize: '3',
        VmHWM: '4',
        VmRSS: '5',
        VmData: '6',
        VmStk: '7',
        VmExe: '8',
        VmPTE: '9',
        Threads: '10',
        voluntary_ctxt_switches: '11',
        nonvoluntary_ctxt_switches: '12'
      };

      procpid.ProcPidReader.prototype.pid.yields(null, {
        io: testIo,
        status: testStatus
      });

      var testData = put(testStatus, testIo);

      InfoFetcher._getProcessInfo(testPid, function (err, data) {
        expect(err).to.not.exist();
        expect(data).to.deep.equal(testData);
        done();
      });
    });
  }); // end _getProcessInfo
  describe('fetch', function() {
    beforeEach(function(done) {
      sinon.stub(InfoFetcher, '_getProcessPid');
      sinon.stub(InfoFetcher, '_getProcessInfo');
      sinon.stub(console, 'log');
      sinon.stub(console, 'error');
      done();
    });

    afterEach(function(done) {
      InfoFetcher._getProcessPid.restore();
      InfoFetcher._getProcessInfo.restore();
      console.log.restore();
      console.error.restore();
      done();
    });

    it('should print error if _getProcessPid failed', function(done) {
      InfoFetcher._getProcessPid.yieldsAsync(new Error('meteor storm'));

      InfoFetcher.fetch(function () {
        expect(console.error.withArgs('{"error":"meteor storm"}').called)
          .to.be.true();
        done();
      });
    });

    it('should print error if _getProcessInfo failed', function(done) {
      InfoFetcher._getProcessPid.yieldsAsync();
      InfoFetcher._getProcessInfo.yieldsAsync(new Error('meteor storm'));

      InfoFetcher.fetch(function () {
        expect(console.error.withArgs('{"error":"meteor storm"}').called)
          .to.be.true();
        expect(console.log.called).to.be.false();
        done();
      });
    });

    it('should print data if all good', function(done) {
      InfoFetcher._getProcessPid.yieldsAsync();
      InfoFetcher._getProcessInfo.yieldsAsync(null, { summon: 'anima' });

      InfoFetcher.fetch(function () {
        expect(console.error.called).to.be.false();
        expect(console.log.withArgs('{"info":{"summon":"anima"}}').called)
          .to.be.true();
        done();
      });
    });
  }); // end fetch
}); // end info-fetcher.js unit test