import { getMobileFileNodeList } from '@qc2168/mib';

function readDir(target: string) {
  const fileNodeList = getMobileFileNodeList(target);
  postMessage({ data: { fileNodeList } });
}

onmessage = (e) => {
  const {
    task,
    path
  } = e.data;
  console.log('work', {
    task,
    path
  });
  readDir(path);

};
