import { List } from "antd";
import { useMount } from "ahooks"
import path from 'path'
import { useState } from "react";
import ignoreFileList from "@/utils/ignoreFileList";
import Table, { ColumnsType } from "antd/lib/table";
const {pathExistsSync,readdirSync,statSync} =require('fs-extra')
import dayjs from 'dayjs'
// import {statSync} from 'fs-extra'
interface FileNodeType {
  fileSize: number;
  fileName: string;
  filePath: string;
  isDirectory?:boolean;
  fileMTime?:string
}
function readablizeBytes(bytes:number):string {
  if(bytes ===0)return ''
  const s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const e = Math.floor(Math.log(bytes)/Math.log(1024));
  return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e] ?? 0;
}
  const columns: ColumnsType<FileNodeType> = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName'
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render:val=>readablizeBytes(val)
    },
    {
      title: '修改时间',
      dataIndex: 'fileMTime',
      key: 'fileMTime',
      render:time=><span>{dayjs(time).format("YYYY-MM-DD hh:mm:ss")}</span>
    },

  ];
export default function fileManage(){
  // 文件列表
  const [fileNodeList,setFileNodeList]=useState<FileNodeType[]>([])
  function createFileNode(targetFilePath:string):FileNodeType{
    const detail =statSync(targetFilePath)
    console.log(detail)
    return {
      fileSize:detail.size,
      fileName:targetFilePath.split('\\').at(-1) ?? '读取文件名错误',
      filePath:targetFilePath,
      isDirectory:detail.isDirectory(),
      fileMTime:detail.mtime,
    }
  }
  function readDir(target:string){
      if(!pathExistsSync(target)){
        throw new Error('无效路径')
      }
      const fileList=readdirSync(target)
      for(const item of fileList){
        if(ignoreFileList.includes(item)){
          // 在忽略名单中，跳过
          continue;
        }
        try{
          const node=createFileNode(path.join(target,item))
          console.log(node);
          setFileNodeList(fileNodeList=>[...fileNodeList,node])

        }catch(e){
            console.log(item,e)
        }


      }
      console.log(fileNodeList);

  }
  useMount(()=>{
    try {
      readDir('d:/')
    } catch (error) {
      console.log('-------------------');
      console.log(error);

    }

  })
return (
  <Table columns={columns} dataSource={fileNodeList} />
)

}
