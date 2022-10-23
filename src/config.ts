import { platform, env } from "process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "path";
import { ConfigType } from "./types";
import getCParams from "./utils/getCParams";

const params = getCParams();
export const home = platform === "win32" ? env.USERPROFILE : env.HOME;
// 获取配置文件名称
const CONFIG_FILE_NAME = ".mibDevrc";
const CONFIG_PATH: string = (params.config && existsSync(params.config) && params.config)
  || path.join(home || "~/", CONFIG_FILE_NAME);

const existConf = () => existsSync(CONFIG_PATH);
const createDefaultConfig = (): ConfigType => {
  const conf: ConfigType = {
    backups: [],
    output: "C:/",
  };
  writeFileSync(CONFIG_PATH, JSON.stringify(conf), {
    encoding: "utf8",
  });
  const data = readFileSync(CONFIG_PATH, "utf8");
  return JSON.parse(data);
};

export const getConfig = (): ConfigType => {
  if (existConf()) {
    const data = readFileSync(CONFIG_PATH, "utf8");
    return JSON.parse(data);
  }
  // 找不到配置文件
  return createDefaultConfig();
};
