export interface FileNodeType {
  fileSize: number;
  fileName: string;
  filePath: string;
  isDirectory?:boolean;
  fileMTime?:string|Date
}
