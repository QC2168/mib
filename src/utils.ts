import { pathExistsSync, ensureDirSync } from "fs-extra";
import winston, { format } from "winston";
import path from "path";
import { execSync } from "child_process";
import prompts from "prompts";
import "core-js/stable/string/at";
import { home } from "./config";
import { devicesType } from "./types";

type levelType = "info" | "error" | "warn";
// find arr1
// eslint-disable-next-line max-len
export const diff = (localArr: string[], remoteArr: string[]): string[] => remoteArr.filter((item) => !localArr.includes(item));
const logger = winston.createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.simple(),
    winston.format.json(),
    format.printf(
      ({ level, message, timestamp }) => `${timestamp} ${level} ${message}`,
    ),
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(home || "./", "./MIB.log"),
    }),
  ],
});
// 记录输出
export const log = (value: string, level: levelType = "info"): void => {
  logger.log(level, value);
};

// 判断路径
export const isPath = (dirPath: string): void => {
  if (!pathExistsSync(dirPath)) {
    log(`导出路径不存在-${dirPath}`, "warn");
    // 没有则创建文件夹
    ensureDirSync(dirPath);
    log(`已自动创建导出路径-${dirPath}`, "warn");
  }
};

// 替换字符
export const replace = (str: string): string => {
  const reg = [
    { reg: /[(]/g, val: "\\(" },
    { reg: /[)]/g, val: "\\)" },
  ];
  let res: string = str;
  for (let i = 0; i < reg.length; i += 1) {
    res = res.replace(reg[i].reg, reg[i].val);
  }
  return res;
};

// 获取设备
export const devices = (): devicesType[] => {
  const res = execSync("adb devices").toString();
  const arr = res
    .split(/\n/)
    .map((line) => line.split("\t"))
    .filter((line) => line.length > 1)
    .map((device) => ({ name: device[0].trim(), status: device[1].trim() }));

  return arr;
};

let currentDeviceName: string = "";
// 指定设备
export const selectDevice = async ():Promise<string|false> => {
  // 获取设备
  const list: devicesType[] = devices();

  if (list.length === 0) {
    log("当前无设备连接，请连接后再执行该工具", "warn");
    return false;
  }

  const result = list.map((i) => ({ title: i.name, value: i.name }));

  const { value } = await prompts({
    type: "select",
    name: "value",
    message: "please select your device",
    choices: result,
  });
  currentDeviceName = value;
  return currentDeviceName;
};

// 执行adb shell命令
export const execAdb = (code: string) => {
  const command = `adb ${
    currentDeviceName ? `-s ${currentDeviceName}` : ""
  } ${code}`;
  return execSync(command).toString();
};

// 判断手机备份路径是否存在
export const isPathAdb = (folderPath: string): boolean => {
  try {
    execAdb(`shell ls -l "${folderPath}"`);
    return true;
  } catch {
    return false;
  }
};

// 路径后面补上斜杠
export const pathRepair = (spath:string):string => (spath.at(-1) === "/" ? spath : `${spath}/`);
