import { platform, env } from 'process';
import path from 'path';
import { ConfigType } from '@/types';

const { readJsonSync, pathExistsSync, outputJsonSync } = require('fs-extra');

export const home = platform === 'win32' ? env.USERPROFILE : env.HOME;

const CONFIG_PATH: string = path.join(home || '~/', '.mibrc');

const existConf = () => pathExistsSync(CONFIG_PATH);
const createDefaultConfig = (): ConfigType => {
  const conf: ConfigType = {
    backups: [],
    output: 'C:/',
  };
  outputJsonSync(CONFIG_PATH, conf);
  return readJsonSync(CONFIG_PATH);
};

export const getConfig = (): ConfigType => {
  if (existConf()) {
    return readJsonSync(CONFIG_PATH);
  }
  // 找不到配置文件
  return createDefaultConfig();
};
