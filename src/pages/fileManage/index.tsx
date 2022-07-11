import { useMount } from "ahooks"
import path from 'path'
import { useState } from "react";
import ignoreFileList from "@/utils/ignoreFileList";
import Table, { ColumnsType } from "antd/lib/table";
const {pathExistsSync,readdirSync,statSync} =require('fs-extra')
import dayjs from 'dayjs'
import { createFileNode, openNotification, readablizeBytes } from "@/utils";
import { FileNodeType } from "@/types";


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

  function readDir(target:string){
    // 清空原列表
    setFileNodeList([])
    console.log('trigger readDir');
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
          setFileNodeList(fileNodeList=>[...fileNodeList,node])
        }catch(error){
          openNotification(item,'生成节点出错啦')
        }
      }

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
  <Table columns={columns} rowKey='fileName' dataSource={fileNodeList} />
)

}
