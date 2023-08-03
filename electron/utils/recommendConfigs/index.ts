import {
  getConfig, type SaveItemType, setConfig,
  DEFAULT_CONFIG_PATH,
} from '@qc2168/mib';
import { RecommendSystemConfigEnum } from './types';
import MIUINodeConfig from './miui.json';

export default (system:RecommendSystemConfigEnum) => {
  try {
    console.log(DEFAULT_CONFIG_PATH);
    const cfg = getConfig(DEFAULT_CONFIG_PATH);
    if (system === RecommendSystemConfigEnum.XIAOMI) {
      cfg.backups.push(...(MIUINodeConfig.backups as SaveItemType[]));
    }
    setConfig(DEFAULT_CONFIG_PATH, cfg);
    return true;
  } catch {
    return false;
  }
};
