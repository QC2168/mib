import type Mib, { type DevicesType, type SaveItemType, type ConfigType } from '@qc2168/mib';
import { FileType } from '../electron/utils/getFileTypes';

export interface ResponseType<T=unknown> {
  msg:string;
  result:T;
}
export interface WinApi {
  close: () => Promise<void>,
  minimize: () => Promise<void>,
  maximize: () => Promise<void>,
}
export interface MibApi {
  instance: () => Promise<Mib>,
  devices: () => Promise<DevicesType[]>,
  setDevice: (id:string) => Promise<void>,
  backup: (id:SaveItemType | SaveItemType[]) => Promise<void>,
  restore: (id:SaveItemType | SaveItemType[]) => Promise<void>,
  backupDone: (cb:(event:any, data:ResponseType<boolean>)=>void)=>void
  scanDone: (cb:(event:any, data:ResponseType<Record<string, FileType>>)=>void)=>void
  attachDevice: (cb:(event:any, data:ResponseType)=>void)=>void
  detachDevice: (cb:(event:any, data:ResponseType)=>void)=>void
  addNode: (data:SaveItemType)=>Promise<ConfigType>,
  removeNode: (id:number)=>Promise<ConfigType>,
  editNode: (data:SaveItemType)=>Promise<ConfigType>,
  editOutputPath: (output:string)=>Promise<ConfigType>,
  scan: (path:string)=>Promise<Record<string, string>>,
  rebootADB: ()=>Promise<ResponseType<boolean>>,
}

declare global {
  interface Window {
    win: WinApi;
    core: MibApi;
  }
}
