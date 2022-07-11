import { FileNodeType } from "@/types";
import { notification } from "antd";
const { statSync } =require("fs-extra");

// 文件大小后缀转换
export function readablizeBytes(bytes:number):string {
  if(bytes ===0)return ''
  const s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const e = Math.floor(Math.log(bytes)/Math.log(1024));
  return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e] ?? 0;
}

// 生成文件节点
export function createFileNode(targetFilePath:string):FileNodeType{
  const detail =statSync(targetFilePath)
  return {
    fileSize:detail.size,
    fileName:targetFilePath.split('\\').at(-1) ?? '读取文件名错误',
    filePath:targetFilePath,
    isDirectory:detail.isDirectory(),
    fileMTime:detail.mtime,
  }
}

export function openNotification(message:string,description:string,onClick?:()=>void,
  onClose?:()=>void) {
  notification.open({
    message,
    description,
    onClick,
    onClose
  })
};
