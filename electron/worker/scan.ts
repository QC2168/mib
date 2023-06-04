const {
  workerData,
  parentPort,
} = require('worker_threads');

const {
  params,
} = workerData;

const instance = null;

function post(data) {
  parentPort.postMessage(data);
}
