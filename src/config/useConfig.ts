import { useSetState } from 'ahooks';
import { platform, env } from 'node:process';
import path from 'path';
import { useEffect } from 'react';
import { SetState } from 'ahooks/lib/useSetState';
import { readJsonSync, pathExistsSync, outputJsonSync } from 'fs-extra';
import { ConfigType } from './types';

export const home = platform === 'win32' ? env.USERPROFILE : env.HOME;

const CONFIG_PATH: string = path.join(home || '~/', '.mibrc');

const existConf = () => pathExistsSync(CONFIG_PATH);

//  创建默认配置文件 无节点
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

export default function useConfig(file?:ConfigType):[ConfigType, SetState<ConfigType>] {
  const [config, setConfig] = useSetState<ConfigType>(file || getConfig());
  useEffect(() => {
    // 改变数据
    outputJsonSync(CONFIG_PATH, config);
  }, [config]);

  return [config, setConfig];
}
