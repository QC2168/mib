import type Mib from '@qc2168/mib';

export interface WinApi {
  close: () => Promise<void>,
  minimize: () => Promise<void>,
  maximize: () => Promise<void>,
}
export interface MibApi {
  instance: () => Promise<Mib>,
}

declare global {
  interface Window {
    win: WinApi;
    core: MibApi;
  }
}
