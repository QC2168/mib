import { FileNodeType } from "@/types";
import { createFileNodeWithADB, execAdb, getFileSize, openNotification } from "@/utils"
import ignoreFileList from "@/utils/ignoreFileList";
import { useMount } from "ahooks";
import { useEffect, useState } from "react";

export default () => {
  const test_path = '/sdcard/MIUI/sound_recorder/app_rec/'
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
    let originFileInfoList = execAdb(`shell ls ${target}`).toString().split("\r\n").filter(i => i !== '');
    for (const fileName of originFileInfoList) {
      try {
        const node = createFileNodeWithADB(test_path + fileName)
        setFileNodeList(fileNodeList => [...fileNodeList, node])
      } catch {
        openNotification(fileName, '生成节点出错啦')
      }
    }
    // setLoading(false)
    console.log(fileNodeList);
  }
  useEffect(() => {
    console.log(fileNodeList)
  }, [fileNodeList])

  return (
    <div>
      analysis
    </div>
  )
}
