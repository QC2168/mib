import { FileNodeType } from '@/types';
import { execAdb, openNotification } from '@/utils';
import { useMount } from 'ahooks';
import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import useDevices from '@/hooks/useDevices';

export default function useMobileFile(targetPath:string = 'sdcard/'):[string[], Dispatch<SetStateAction<string[]>>, FileNodeType[], Dispatch<SetStateAction<FileNodeType[]>>] {
  // 当前路径
  const [mobilePathCollection, setMobilePathCollection] = useState([targetPath]);
  // 移动设备文件列表
  const [mobileFileNodeList, setMobileFileNodeList] = useState<FileNodeType[]>([]);
  const [devices, , isConnect] = useDevices();
  // 读取移动设备目录
  function readMobileDriverDir(target: string) {
    // 没有连接则跳过
    if (!isConnect()) return;
    // 清空原列表
    setMobileFileNodeList([]);
    // todo 判断路径是否存在
    // 获取指定目录下的文件、文件夹列表
    const dirList = execAdb(`shell ls -l ${target}`).toString().split('\r\n').filter((i) => i !== '');
    // 去掉total
    dirList.shift();
    dirList.forEach((i) => {
      const item: string[] = i.split(/\s+/);
      const fileName = item.slice(7).join(' ');
      const fileNode: FileNodeType = {
        fileName,
        fileSize: Number(item[4]) ?? 0,
        filePath: target + fileName,
        isDirectory: item[0].startsWith('d'),
        fileMTime: item.slice(5, 7).join(' '),
      };
      setMobileFileNodeList((fileNodeList) => [...fileNodeList, fileNode]);
    });
    // setLoading(false);
  }

  // 更新移动设备文件列表
  useEffect(() => {
    // setLoading(true);
    readMobileDriverDir(mobilePathCollection.join('/'));
  }, [mobilePathCollection]);

  useMount(() => {
    // readDir(localPathCollection.join('/'));
    try {
      readMobileDriverDir(mobilePathCollection.join('/'));
    } catch (error) {
      openNotification('error', '读取移动设备文件失败');
    }
  });
  return [mobilePathCollection, setMobilePathCollection,
    mobileFileNodeList, setMobileFileNodeList];
}
