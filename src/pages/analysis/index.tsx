import { FileNodeType } from "@/types";
import { createFileNodeWithADB, execAdb, getFileSize, openNotification } from "@/utils"
import ignoreFileList from "@/utils/ignoreFileList";
import { useMount } from "ahooks";
import { useEffect, useState } from "react";

export default () => {
  const test_path = '/sdcard/DCIM/Camera/'
  // const test_path = '/sdcard/MIUI/sound_recorder/app_rec/'
  // 文件列表
  const [fileNodeList, setFileNodeList] = useState<FileNodeType[]>([])
  useMount(() => {
    readDir(test_path)
  })
  function readDir(target: string) {
    // 清空原列表
    setFileNodeList([])
    console.log('trigger readDir');
    // todo 判断路径是否存在

    // 获取指定目录下的文件、文件夹列表
    let dirList = execAdb(`shell ls -l ${target}`).toString().split("\r\n").filter(i => i !== '');
    // 去掉total
    dirList.shift()
    dirList.forEach((i) => {
      const item: string[] = i.split(/\s+/);
      const fileName = item.slice(7).join(" ");
      const fileNode: FileNodeType = {
        fileName,
        fileSize: Number(item[3]) ?? 0,
        filePath: target + fileName,
        isDirectory: item[0].startsWith("d")
      }
      setFileNodeList(fileNodeList=>[...fileNodeList,fileNode])
    });
  }


  return (
    <div>
      analysis
    </div>
  )
}
