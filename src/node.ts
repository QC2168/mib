/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
import { readdirSync, statSync } from "fs";
import { FileNodeType } from "./types";
import { execAdb, isPathAdb, pathRepair } from './utils';

export default {};
// 获取文件列表
export function getMobileFileNodeList(targetPath: string, deep = true): FileNodeType[] {
  if (!isPathAdb(targetPath)) return [];
  const res = execAdb(`shell ls -l ${targetPath}`)
    .toString()
    .split("\r\n");
  res.shift();
  res.pop();
  const fileNodeList: FileNodeType[] = [];

  res.forEach((str) => {
    const arr = str.split(/\s+/);
    if (arr[0].startsWith("-") || arr[0].startsWith("d")) {
      const fileName = arr.slice(7)
        .join(" ");
      const fileSize = Number((arr.slice(4, 5)).join());
      const filePath = `${targetPath}${fileName}`;
      const node: FileNodeType = {
        isDirectory: arr[0].startsWith("d"),
        fileName,
        fileSize,
        filePath,
        children: arr[0].startsWith("d") && deep ? getMobileFileNodeList(pathRepair(filePath)) : null,
      };
      fileNodeList.push(node);
    }
  });

  return fileNodeList;
}

// 通过本地文件路径生成文件本地节点
export function createFileNode(targetFilePath: string, deep = true): FileNodeType {
  const detail = statSync(targetFilePath);
  const children = [];
  if (detail.isDirectory() && deep) {
    for (const item of readdirSync(targetFilePath)) {
      children.push(createFileNode(pathRepair(targetFilePath) + item));
    }
  }
  return {
    fileSize: detail.size,
    fileName: targetFilePath.split('/')
      .at(-1) ?? '读取文件名错误',
    filePath: targetFilePath,
    isDirectory: detail.isDirectory(),
    fileMTime: detail.mtime,
    children,
  };
}

// 获取指定目录下文件节点
export function getLocalFileNodeList(
  targetPath: string,
): FileNodeType[] {
  const fileNodeList: FileNodeType[] = [];
  // const config = getConfig();
  // const ignoreList = config.ignoreFileList ?? [];
  const fileList = readdirSync(targetPath);
  for (const item of fileList) {
    // if (ignoreList.includes(item)) {
    //   // 在忽略名单中，跳过
    //   continue;
    // }
    try {
      const node = createFileNode(pathRepair(targetPath) + item);
      fileNodeList.push(node);
    } catch (error) {
      throw new Error(`${item}生成节点出错啦--${error}`);
    }
  }

  return fileNodeList;
}

export function diff(
  localArr: FileNodeType[],
  remoteArr: FileNodeType[],
): FileNodeType[] {
  const names: { [key: string]: boolean } = {};
  localArr.forEach((i) => {
    names[i.fileName] = true;
  });
  return remoteArr.filter((i) => !names[i.fileName]);
}

export function computeNodeListSize(list: FileNodeType[]): number {
  return list.reduce((size, n2) => size + n2.fileSize, 0);
}
