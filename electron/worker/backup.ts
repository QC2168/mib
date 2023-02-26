import Mib from '@qc2168/mib';

const { workerData, parentPort } = require('worker_threads');

const { cfg, task, params } = workerData;

let instance = null;

function post(data) {
  parentPort.postMessage(data);
}

if (task === 'backup') {
  const {
    current,
  } = cfg;
  instance = new Mib();
  instance.setDevice(current);
  try {
    if (Array.isArray(params)) {
      for (let i = 0; i < params.length; i += 1) {
        instance.start(params[i]);
      }
    } else {
      instance.start(params);
    }
    post({
      msg: '备份任务完成',
      result: true,
    });
  } catch (error) {
    post({
      msg: '备份进程出错了',
      result: false,
    });
  } finally {
    instance = null;
  }
}
