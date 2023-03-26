import type Mib, { type DevicesType, type SaveItemType } from '@qc2168/mib';

export interface ResponseType {
  msg:string;
  result:boolean;
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
  backupDone: (cb:(event:any, data:ResponseType)=>void)=>void
}

declare global {
  interface Window {
    win: WinApi;
    core: MibApi;
  }
}
