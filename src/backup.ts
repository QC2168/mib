/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */
import {
  execAdb, log,
} from "./utils";
import {
  getLocalFileNodeList, getMobileFileNodeList, diff, computeNodeListSize,
} from "./node";
import type { FileNodeType } from './node';

const speedReg: RegExp = /[0-9.]+\s(MB\/s)/;

const initData = (backupDir: string, outputDir: string) => {
  const mobileFileNodeList: FileNodeType[] = getMobileFileNodeList(backupDir);
  // 获取当前存储空间
  const localFileNodeList: FileNodeType[] = getLocalFileNodeList(outputDir);
  // 对比文件
  const diffList: FileNodeType[] = diff(localFileNodeList, mobileFileNodeList);
  return {
    mobileFileNodeList,
    localFileNodeList,
    diffList,
  };
};

const move = (backupQueue: FileNodeType[], outputDir: string): void => {
  if (backupQueue.length === 0) {
    log("无需备份");
    return;
  }
  for (const fileN of backupQueue) {
    log(`正在备份${fileN.fileName}`);
    try {
      const out: string = execAdb(
        `pull "${fileN.filePath}" "${outputDir + fileN.fileName}"`,
      );
      const speed: string | null = out.match(speedReg) !== null ? out.match(speedReg)![0] : "读取速度失败";
      log(`平均传输速度${speed}`);
    } catch (e: any) {
      log(`备份${fileN.fileName}失败 error:${e.message}`, "error");
    }
  }
};

const moveFolder = (source: string, target: string): void => {
  log(`正在备份文件夹${source}`);
  try {
    const out: string = execAdb(`pull "${source}" "${target}"`);
    const speed: string | null = out.match(speedReg) !== null ? out.match(speedReg)![0] : "读取速度失败";
    log(`平均传输速度${speed}`);
  } catch (e: any) {
    log(`备份文件夹${source}失败 error:${e.message}`, "error");
  }
};

// backupFn
export const backup = (target: string, output: string, full: boolean = false) => {
  if (!full) {
    // 备份非备份的文件数据
    // 获取手机中的文件信息,对比本地
    const { diffList } = initData(target, output);
    // 计算体积和数量
    computeNodeListSize(diffList);
    // 执行备份程序
    move(diffList, output);
  } else {
    // 不文件对比，直接备份
    moveFolder(target, output);
  }
};
