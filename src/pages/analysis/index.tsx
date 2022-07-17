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
    // readDir(test_path)
  })


  return (
    <div>
      analysis
    </div>
  )
}
