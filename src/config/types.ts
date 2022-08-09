export interface BackItemType {
  path: string;
  comment: string;
  full?: boolean;
  output?:string;
}

// 备份目标
export interface ConfigType {
  backups: BackItemType[];
  output: string;
}
