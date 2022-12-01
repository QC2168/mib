import { Key } from 'react';
import { getConfig } from '@/config/useConfig';
import { BackItemType } from '@/types';
import {
  isPath,
  isPathAdb,
  pathRepair,
  backup as mibBackup,
} from '@qc2168/mib';

// 备份到电脑上
function run(backupNodes: string[] | Key[]) {
  const c = getConfig();
  // 判断是否有选择的节点
  // 备份选择的节点
  // 获取节点完整信息
  // eslint-disable-next-line max-len
  const curBackupNode: BackItemType[] = c.backups.filter((item: BackItemType) => backupNodes.includes(item.comment));
  const outputRootDir = c.output;
  // 判断根路径
  isPath(outputRootDir);
  // 遍历备份节点
  curBackupNode.forEach(async (item) => {
    // 判断导出路径是否存在
    const folderName = item.path
      .split('/')
      .filter((i: string) => i !== '')
      .at(-1);
    const backupDir = pathRepair(item.path);
    // 判断节点内是否有备份目录  // 拼接导出路径
    const itemRootPath = pathRepair(pathRepair(c.output) + folderName);
    const outputDir = item.output
      ? item.output && pathRepair(item.output)
      : itemRootPath;

    // 判断备份路径是否存在
    if (!isPathAdb(backupDir)) {
      postMessage({ message: `备份路径:${backupDir} 不存在已跳过` });
    } else {
      // 判断导出路径
      isPath(outputDir);
      mibBackup(backupDir, outputDir, item.full);
      postMessage({ message: `备份完成 ${item.comment} ` });
    }
  });
}

onmessage = (e) => {
  const { task, backupNodes, devices } = e.data;
  console.log('work', { task, backupNodes, devices });
  if (task === 'backup') {
    run(backupNodes);
    postMessage({ message: 'done' });
  }
};
