import { existsSync, mkdirSync } from "node:fs";
import log from "./logger";

export default (dirPath: string): void => {
  if (!existsSync(dirPath)) {
    log(`导出路径不存在-${dirPath}`, "warn");
    // 没有则创建文件夹
    mkdirSync(dirPath);
    log(`已自动创建导出路径-${dirPath}`, "warn");
  }
};
