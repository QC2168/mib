export enum WorkModeEnum {
  STOP,
  BACKING,
  RECOVERING
}

export interface WorkStateType { mode: WorkModeEnum }
