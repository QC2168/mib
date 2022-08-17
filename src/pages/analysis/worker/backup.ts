import {
  diff,
  execAdb,
  getFileNodeList,
  isPath,
  pathRepair,
  speedReg,
  log,
} from '@/utils';
// import { execSync } from 'node:child_process';
import { Key, useState } from 'react';
import { BackItemType, DriverType, FileNodeType } from '@/types';
import { execSync } from 'child_process';
import { getConfig } from '@/config/useConfig';
import { pathExistsSync, remove } from 'fs-extra';

function move(
  backupQueue: FileNodeType[],
  outputDir: string,
  devices: string,
): void {
  if (backupQueue.length === 0) {
    console.log('无需备份');
    return;
  }
  backupQueue.forEach((fileN) => {
    console.log(`正在备份${fileN.fileName}`);
    try {
      const out: string = execAdb(
        `pull "${fileN.filePath}" "${outputDir + fileN.fileName}"`,
        devices,
      );
      const speed: string | null = out.match(speedReg) !== null ? out.match(speedReg)![0] : '读取速度失败';
      console.log(`平均传输速度${speed}`);
    } catch (e: any) {
      console.log(`备份${fileN.fileName}失败 error:${e.message}`, 'error');
    }
  });
}

const moveFolder = (source: string, target: string, devices: string): void => {
  console.log(`正在备份文件夹${source}`);
  try {
    const out: string = execAdb(`pull "${source}" "${target}"`, devices);
    const speed: string | null = out.match(speedReg) !== null ? out.match(speedReg)![0] : '读取速度失败';
    console.log(`平均传输速度${speed}`);
  } catch (e: any) {
    console.log(`备份文件夹${source}失败 error:${e.message}`, 'error');
  }
};

// 备份到电脑上
function backup(backupNodes: string[] | Key[], devices: string) {
  const c = getConfig();
  // setInBackup(true);
  // 判断是否有选择的节点
  // 备份选择的节点
  // 获取节点完整信息
  // eslint-disable-next-line max-len
  const curBackupNode: BackItemType[] = c.backups.filter((item: BackItemType) => backupNodes.includes(item.comment));
  const outputRootDir = c.output;
  // 判断根路径
  isPath(outputRootDir);
  curBackupNode.forEach(async (item) => {
    // 判断导出路径是否存在
    const folderName = item.path
      .split('/')
      .filter((i: string) => i !== '')
      .at(-1);
    // 判断节点内是否有备份目录  // 拼接导出路径
    const itemRootPath = pathRepair(pathRepair(c.output) + folderName);
    const outputDir = item.output
      ? item.output && pathRepair(item.output)
      : itemRootPath;

    // 全量备份直接移动文件夹
    if (item.full) {
      // 不文件对比，直接备份
      // 判断导出目录是否存在文件夹，有则删除再移动
      if (pathExistsSync(outputDir)) {
        remove(outputDir.replace(/\/$/, '')).then(() => {
          moveFolder(item.path, outputDir, devices);
        });
      }
    }
    // 依次读取对比
    // 获取指定目录下的文件、文件夹列表
    // 判断路径是否存在
    isPath(outputDir);
    const waitBackupFileList: FileNodeType[] = [];
    const dirPath = item.path;
    const dirList: string[] = execAdb(`shell ls -l ${dirPath}`, devices)
      .toString()
      .split('\r\n')
      .filter((i: string) => i !== '');
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

    // 获取当前目录下的文件
    // 获取当前存储空间
    const localFileNodeList = getFileNodeList(outputDir, DriverType.LOCAL);
    // 对比文件
    const diffList: FileNodeType[] = diff(
      localFileNodeList,
      waitBackupFileList,
    );
    console.log(localFileNodeList);
    console.log(waitBackupFileList);
    console.log('diffList', diffList);
    move(diffList, outputDir, devices);

    postMessage({ message: `${item.comment}备份完成` });
  });
}

onmessage = (e) => {
  const { task, backupNodes, devices } = e.data;
  if (task === 'backup') {
    backup(backupNodes, devices);
  }
};
