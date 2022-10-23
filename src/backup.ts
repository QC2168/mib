/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */
import deepLog from "./utils/deepLog";
import { execAdb } from "./utils/adb";
import log from './utils/logger';
import {
  getLocalFileNodeList,
  getMobileFileNodeList,
  diff,
  computeNodeListSize,
} from "./node";
import type { FileNodeType } from "./types";
import { createAdbOrders } from "./adbCmd";

const speedReg: RegExp = /[0-9.]+\sMB\/s/;

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

const move = (orders: string[]): void => {
  for (const order of orders) {
    try {
      const out: string = execAdb(order);
      const speed = out.match(speedReg) || ["读取速度失败"];
      log(`平均传输速度${speed}`);
    } catch (e: any) {
      const [info] = order.match(/(".+?")/g) || ["获取数据失败"];
      log(`${info} error:${e.message}`, "error");
    }
  }
};

const moveFolder = (source: string, target: string): void => {
  log(`正在备份文件夹${source}`);
  try {
    const out: string = execAdb(`pull "${source}" "${target}"`);
    const speed = out.match(speedReg) || ["读取速度失败"];
    log(`平均传输速度${speed}`);
  } catch (e: any) {
    log(`备份文件夹${source}失败 error:${e.message}`, "error");
  }
};

// backupFn
export const backup = (
  target: string,
  output: string,
  full: boolean = false,
) => {
  if (!full) {
    // 备份非备份的文件数据
    // 获取手机中的文件信息,对比本地
    const { diffList } = initData(target, output);
    deepLog(diffList);
    // 计算体积和数量
    computeNodeListSize(diffList);
    // 执行备份程序
    const orders = createAdbOrders(diffList, output);
    if (orders.length === 0) {
      log("无需备份");
      return;
    }

    move(orders);
  }
  // 不文件对比，直接备份
  moveFolder(target, output);
};
