import { pathExistsSync, ensureDirSync } from "fs-extra";
import winston, { format } from "winston";
import path from "path";
import { home } from "./config";

type levelType = "info" | "error"|'warn';
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
    format.printf(({ level, message, timestamp }) => `${timestamp} ${level} ${message}`),
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(home || './', "./MIB.log"),
    }),
  ],
});
// 记录输出
export const log = (value: string, level: levelType = "info"): void => {
  logger.log(level, value);
  //   console.log(value);
};

// 判断路径
export const isPath = (dirPath: string): void => {
  if (!pathExistsSync(dirPath)) {
    log(`导出路径不存在-${dirPath}`, 'warn');
    // 没有则创建文件夹
    ensureDirSync(dirPath);
    log(`已自动创建导出路径-${dirPath}`, 'warn');
  }
};

// 替换字符
export const replace = (str:string):string => {
  const reg = [{ reg: /[(]/g, val: '\\(' }, { reg: /[)]/g, val: '\\)' }];
  let res:string = str;
  for (let i = 0; i < reg.length; i += 1) {
    res = res.replace(reg[i].reg, reg[i].val);
  }
  return res;
};
