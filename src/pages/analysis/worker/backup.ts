import {
  diff, execAdb, getFileNodeList, isPath, pathRepair, speedReg,
} from '@/utils';
// import { execSync } from 'node:child_process';
import { Key, useState } from 'react';
import { BackItemType, DriverType, FileNodeType } from '@/types';
import { execSync } from 'child_process';
import { getConfig } from '@/config/useConfig';

function move(backupQueue: FileNodeType[], outputDir: string): void {
  if (backupQueue.length === 0) {
    console.log('无需备份');
    return;
  }
  backupQueue.forEach((fileN) => {
    console.log(`正在备份${fileN.fileName}`);
    try {
      const out: string = execAdb(
        `pull "${fileN.filePath}" "${outputDir + fileN.fileName}"`,
      );
      const speed: string | null = out.match(speedReg) !== null ? out.match(speedReg)![0] : '读取速度失败';
      console.log(`平均传输速度${speed}`);
    } catch (e: any) {
      console.log(`备份${fileN.fileName}失败 error:${e.message}`, 'error');
    }
  });
}
// 备份到电脑上
function backup(backupNodes:string[]|Key[]) {
  const c = getConfig();
  // setInBackup(true);
  // 判断是否有选择的节点
  // 备份选择的节点
  // 获取节点完整信息
  // eslint-disable-next-line max-len
  const curBackupNode:BackItemType[] = c.backups.filter((item:BackItemType) => backupNodes.includes(item.comment));
  const outputRootDir = c.output;
  // 判断根路径
  isPath(outputRootDir);
  curBackupNode.forEach(async (item) => {
    // 依次读取对比
    // 获取指定目录下的文件、文件夹列表
    const waitBackupFileList: FileNodeType[] = [];
    const dirPath = item.path;
    const dirList:string[] = execAdb(`shell ls -l ${dirPath}`).toString().split('\r\n').filter((i:string) => i !== '');
    // 去掉total
    dirList.shift();
    dirList.forEach((i) => {
      const splitItem: string[] = i.split(/\s+/);
      const fileName = splitItem.slice(7).join(' ');
      const fileNode: FileNodeType = {
        fileName,
        fileSize: Number(splitItem[4]) ?? 0,
        filePath: pathRepair(dirPath) + fileName,
        isDirectory: splitItem[0].startsWith('d'),
        fileMTime: splitItem.slice(5, 7).join(' '),
      };
      waitBackupFileList.push(fileNode);
    });
    // 判断导出路径是否存在
    const folderName = item.path.split('/').filter((i: string) => i !== '').at(-1);
    // 判断节点内是否有备份目录  // 拼接导出路径
    const itemRootPath = pathRepair(pathRepair(c.output) + folderName);
    const outputDir = item.output
      ? item.output && pathRepair(item.output)
      : itemRootPath;
    isPath(outputDir);
    // 获取当前目录下的文件
    // 获取当前存储空间
    const localFileNodeList = getFileNodeList(outputDir, DriverType.LOCAL);
    // 对比文件
    const diffList: FileNodeType[] = diff(localFileNodeList, waitBackupFileList);
    console.log(localFileNodeList);
    console.log(waitBackupFileList);
    console.log('diffList', diffList);
    move(diffList, outputDir);
    postMessage({ message: `${item.comment}备份完成` });
  });
}

onmessage = (e) => {
  const {
    task,
    backupNodes,
  } = e.data;
  if (task === 'backup') {
    backup(
      backupNodes,
    );
  }
};
