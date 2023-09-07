import type Mib, { type DevicesType, type SaveItemType, type ConfigType } from '@qc2168/mib';
import { FileType } from '../electron/utils/getFileTypes';
import { RecommendSystemConfigEnum } from '../electron/utils/recommendConfigs';
import { WorkModeEnum, WorkStateType } from '../electron/types';

export interface ResponseType<T=unknown> {
  msg:string;
  result:T;
}
export interface WinApi {
  close: () => Promise<void>,
  minimize: () => Promise<void>,
  maximize: () => Promise<void>,
  openLink: (url:string) => Promise<void>,
  reload: () => Promise<void>,
}
export interface Versions {
  node: () => string,
  chrome: () => string,
  electron: () => string,
  version: () => Promise<number>,
}
export interface MibApi {
  instance: () => Promise<Mib>,
  instanceConfig: () => Promise<ConfigType>,
  devices: () => Promise<DevicesType[]>,
  setDevice: (id:string) => Promise<void>,
  getDevice: () => Promise<null|string>,
  backup: (id:SaveItemType | SaveItemType[]) => Promise<void>,
  restore: (id:SaveItemType | SaveItemType[]) => Promise<void>,
  backupDone: (cb:(event:any, data:ResponseType<boolean>)=>void)=>void
  workModeChanged: (cb:(event:any, data:ResponseType<WorkStateType>)=>void)=>void
  scanDone: (cb:(event:any, data:ResponseType<Record<string, FileType>>)=>void)=>void
  attachDevice: (cb:(event:any, data:ResponseType)=>void)=>void
  detachDevice: (cb:(event:any, data:ResponseType)=>void)=>void
  addNode: (data:SaveItemType)=>Promise<ConfigType>,
  removeNode: (id:number)=>Promise<ConfigType>,
  editNode: (data:SaveItemType)=>Promise<ConfigType>,
  editOutputPath: (output:string)=>Promise<ConfigType>,
  scan: (path:string)=>Promise<Record<string, string>>,
  rebootADB: ()=>Promise<ResponseType<boolean>>,
  getWorkMode: ()=>Promise<WorkModeEnum>,
}
export interface UtilsApi {
  injectRecommendConfig: (system:RecommendSystemConfigEnum)=>Promise<boolean>,
}
declare global {
  interface Window {
    win: WinApi;
    core: MibApi;
    versions: Versions;
    utils : UtilsApi;
  }
}
