'use strict';

var ps = require('ps-node');
var procpid = require('proc-pid')();
var put = require('101/put');
var pick = require('101/pick');
var async = require('async');

function getDockerPid (cb) {
  ps.lookup({
    command: process.env.LOOKUP_CMD,
    arguments: process.env.LOOKUP_ARGS || '',
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
}

function getDockerInfo (pid, cb) {
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
}

async.waterfall([
  getDockerPid,
  getDockerInfo
], function (err, data) {
  if (err) {
    return console.error(JSON.stringify({error: err.message}));
  }

  console.log(JSON.stringify({info: data}));
});

module.exports.getDockerPid = getDockerPid;
module.exports.getDockerInfo = getDockerInfo;
