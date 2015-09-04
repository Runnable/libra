'use strict';

var async = require('async');
var ps = require('ps-node');
var procpid = require('proc-pid')();
var put = require('101/put');
var pick = require('101/pick');

module.exports = InfoFetcher;

function InfoFetcher () {  }

/**
 * gets pid of process based on LOOKUP_CMD and LOOKUP_ARGS
 * @param  {Function} cb (err, pid)
 */
InfoFetcher._getProcessPid = function  (cb) {
  ps.lookup({
    command: process.env.LOOKUP_CMD,
    arguments: process.env.LOOKUP_ARGS,
    psargs: 'ux'
  }, function (err, processes) {
    if (err) {
      return cb(new Error('ps lookup failed'));
    }

    if (processes.length !== 1) {
      return cb(new Error('unable to get process'));
    }
    cb(null, processes[0].pid);
  });
};


/**
 * looks at /proc and gets io and status info
 * @param  {number}   pid pid of process to get info for
 * @param  {Function} cb (err, dataObject)
 */
InfoFetcher._getProcessInfo = function (pid, cb) {
  procpid.pid(pid, function (err, data) {
    if (err || !data) {
      return cb(new Error('proc lookup failed'));
    }

    var statusData = ['FDSize', 'VmPeak', 'VmSize', 'VmHWM', 'VmRSS',
      'VmData', 'VmStk', 'VmExe', 'VmPTE', 'Threads',
      'voluntary_ctxt_switches', 'nonvoluntary_ctxt_switches'];

    var out = put(pick(data.status, statusData), data.io);

    cb(null, out);
  });
};

/**
 * performs actual fetching of process information
 * @return {null} null
 */
InfoFetcher.fetch = function (cb) {
  async.waterfall([
    InfoFetcher._getProcessPid,
    InfoFetcher._getProcessInfo
  ], function (err, data) {
    if (err) {
      console.error(JSON.stringify({error: err.message}));
    } else {
      console.log(JSON.stringify({info: data}));
    }

    cb();
  });
};
