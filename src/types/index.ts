// 文件节点
export interface FileNodeType {
  fileSize: number;
  fileName: string;
  filePath: string;
  isDirectory?:boolean;
  fileMTime?:string|Date
}

// 备份节点
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

// 显示数据
export enum DriverType {
    MOBILE,
    LOCAL
  }
