import { SaveItemType } from "./types";
import { isPathAdb } from "./utils/adb";
import pathRepair from "./utils/pathRepair";
import isPath from "./utils/isPath";
import log from "./utils/logger";
import { selectDevice } from "./devices";
import "core-js/stable/array/at";
import { getConfig } from "./config";
import { backup } from "./backup";

const MIB = () => {
  // 获取配置文件
  const { backups, output } = getConfig();
  // 判断备份节点是否为空
  if (backups.length === 0) {
    log("当前备份节点为空", "warn");
    log("请在配置文件中添加备份节点", "warn");
  }
  if (backups.length > 0) {
    isPath(output);
    // 解析备份路径最后一个文件夹
    backups.forEach((item: SaveItemType) => {
      log(`当前执行备份任务:${item.comment}`);
      const arr = item.path.split("/").filter((i: string) => i !== "");
      const folderName = arr.at(-1);
      const backupDir = pathRepair(item.path);
      // 备份目录
      // 判断节点内是否有备份目录  // 拼接导出路径
      const rootPath = pathRepair(pathRepair(output) + folderName);
      const outputDir = item.output
        ? item.output && pathRepair(item.output)
        : rootPath;
      // 判断备份路径是否存在
      if (!isPathAdb(backupDir)) {
        log(`备份路径:${backupDir} 不存在已跳过`, "error");
      } else {
        // 判断导出路径
        isPath(outputDir);
        backup(backupDir, outputDir, item.full);
      }
    });
  }
  log("程序结束");
};

(async () => {
  const device: string | boolean = await selectDevice();
  if (device) MIB();
})();
