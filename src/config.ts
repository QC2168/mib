import { readJsonSync, pathExistsSync } from 'fs-extra';
import { platform, env } from 'process';
import path from 'path';

export const home = platform === 'win32'
  ? env.USERPROFILE
  : env.HOME;

const CONFIG_PATH:string = path.join(home || '~/', '.mibrc');

const exist = () => pathExistsSync(CONFIG_PATH);

export const getConfig = () => {
  if (exist()) {
    return readJsonSync(CONFIG_PATH);
  }
  throw new Error('找不到配置文件');
};
