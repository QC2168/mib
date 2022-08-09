/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
import { notification } from 'antd';
// import winston, { format } from "winston";
import path from 'path';
import { execSync } from 'child_process';
import { DriverType, FileNodeType } from '@/types';
import { getConfig } from '@/config/useConfig';
import {
  statSync,
  pathExistsSync,
  ensureDirSync,
  readdirSync,
} from 'fs-extra';

type levelType = 'info' | 'error' | 'warn';
// 记录输出
export const log = (value: string, level: levelType = 'info'): void => {
  // logger.log(level, value);
  console.log(level, value);
};

export function openNotification(
  message: string,
  description: string,
  onClick?: () => void,
  onClose?: () => void,
) {
  notification.open({
    message,
    description,
    onClick,
    onClose,
  });
}

// 执行adb shell命令
export const execAdb = (code: string, d?:string) => {
  const command = `adb ${
    d ? `-s ${d}` : ''
  } ${code}`;
  console.log('command', command);
  console.log('d', d);
  try {
    const res = execSync(command).toString();
    return res;
  } catch (error) {
    console.log(error);
    return '';
  }
};

// 文件大小后缀转换
export function readablizeBytes(bytes: number): string {
  if (bytes === 0) return '';
  const s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** Math.floor(e)).toFixed(2)} ${s[e]}` ?? 0;
}

// 替换字符
export const replace = (str: string): string => {
  const reg = [
    { reg: /[(]/g, val: '\\(' },
    { reg: /[)]/g, val: '\\)' },
  ];
  let res: string = str;
  for (let i = 0; i < reg.length; i += 1) {
    res = res.replace(reg[i].reg, reg[i].val);
  }
  return res;
};

// 获取手机中文件的大小
export const getFileSize = (adbPath: string): number => {
  try {
    const res = execAdb(`shell du -k '${replace(adbPath)}'`).toString();
    const fileSize: string = res.split('\t')[0];
    return Number(fileSize);
  } catch (error) {
    log(`获取文件大小失败-${adbPath}`, 'warn');
    return 0;
  }
};
// 通过本地文件路径生成文件本地节点
export function createFileNode(targetFilePath: string): FileNodeType {
  const detail = statSync(targetFilePath);
  return {
    fileSize: detail.size,
    fileName: targetFilePath.split('\\').at(-1) ?? '读取文件名错误',
    filePath: targetFilePath,
    isDirectory: detail.isDirectory(),
    fileMTime: detail.mtime,
  };
}

// 获取指定目录下文件节点
export function getFileNodeList(
  targetPath: string,
  mode: DriverType,
): FileNodeType[] {
  const fileNodeList: FileNodeType[] = [];
  const config = getConfig();
  const ignoreList = config.ignoreFileList ?? [];
  if (mode === DriverType.LOCAL) {
    const fileList = readdirSync(targetPath);
    for (const item of fileList) {
      if (ignoreList.includes(item)) {
        // 在忽略名单中，跳过
        continue;
      }
      try {
        const node = createFileNode(path.join(targetPath, item));
        fileNodeList.push(node);
      } catch (error) {
        openNotification(item, '生成节点出错啦');
      }
    }

    return fileNodeList;
  }
  // if (mode === DriverType.MOBILE) {
  // }
  return fileNodeList;
}
// 通过adb方式获取文件路径生成文件节点
export function createFileNodeWithADB(targetFilePath: string): FileNodeType {
  // -c %F %n %s
  // 对应文件类型（文件夹dictionary，常规文件regular file）
  // 文件名称 filename
  // 文件大小 filesize
  const fileType = execAdb(`shell stat -c '%F' '${targetFilePath}'`).replace(
    '\r\n',
    '',
  );
  const fileName = execAdb(`shell stat -c '%n' '${targetFilePath}'`).replace(
    '\r\n',
    '',
  );
  const fileSize = Number(
    execAdb(`shell stat -c '%s' '${targetFilePath}'`).replace('\r\n', ''),
  );
  return {
    fileName,
    fileSize,
    filePath: targetFilePath,
    isDirectory: fileType === 'directory',
  };
}

export const diff = (
  localArr: FileNodeType[],
  remoteArr: FileNodeType[],
): FileNodeType[] => {
  const names: { [key: string]: boolean } = {};
  localArr.forEach((i) => {
    names[i.fileName] = true;
  });
  return remoteArr.filter((i) => !names[i.fileName]);
};

// const logger = winston.createLogger({
//   format: format.combine(
//     format.timestamp({
//       format: "YYYY-MM-DD HH:mm:ss",
//     }),
//     winston.format.simple(),
//     winston.format.json(),
//     format.printf(
//       ({ level, message, timestamp }) => `${timestamp} ${level} ${message}`,
//     ),
//   ),

//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({
//       filename: path.join(home || "./", "./MIB.log"),
//     }),
//   ],
// });

// 判断路径
export const isPath = (dirPath: string): void => {
  if (!pathExistsSync(dirPath)) {
    log(`导出路径不存在-${dirPath}`, 'warn');
    // 没有则创建文件夹
    ensureDirSync(dirPath);
    log(`已自动创建导出路径-${dirPath}`, 'warn');
  }
};

// 指定设备
// export const selectDevice = async (): Promise<string | false> => {
//   // 获取设备
//   const list: devicesType[] = devices();

//   if (list.length === 0) {
//     log("当前无设备连接，请连接后再执行该工具", "warn");
//     return false;
//   }

//   const result = list.map((i) => ({ title: i.name, value: i.name }));

//   const { value } = await prompts({
//     type: "select",
//     name: "value",
//     message: "please select your device",
//     choices: result,
//   });
//   // 获取设备状态
//   const deviceStatus = list.find((i) => i.name === value)?.status;
//   if (deviceStatus === "unauthorized") {
//     log("该设备无权访问权限", "warn");
//     log("请在设备上允许USB调试", "warn");
//   }
//   currentDeviceName = value;
//   return currentDeviceName;
// };

// 判断手机备份路径是否存在
export const isPathAdb = (folderPath: string): boolean => {
  try {
    execAdb(`shell ls -l "${folderPath}"`);
    return true;
  } catch {
    return false;
  }
};

export const speedReg: RegExp = /[0-9.]+\s(MB\/s)/;

// 路径后面补上斜杠
export const pathRepair = (spath: string): string => (spath.at(-1) === '/' ? spath : `${spath}/`);
