import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import type { FileNodeType } from '@qc2168/mib';
import { pathRepair } from '@qc2168/mib';

const { getMobileFileNodeList } = require('@qc2168/mib');

export default function useMobileFile(device?: string, targetPath: string = '/sdcard'): [string[], Dispatch<SetStateAction<string[]>>, FileNodeType[], Dispatch<SetStateAction<FileNodeType[]>>] {
  // 当前路径
  const [mobilePathCollection, setMobilePathCollection] = useState([targetPath]);
  // 移动设备文件列表
  const [mobileFileNodeList, setMobileFileNodeList] = useState<FileNodeType[]>([]);
  const [, setLoading] = useState(false);
  // 更新本地文件列表
  useEffect(() => {
    if (!device) {
      console.log('设备不存在');
      return;
    }
    setLoading(true);
    try {
      const list = getMobileFileNodeList(device, pathRepair(mobilePathCollection.join('/')), false);
      console.log({ list });
      setMobileFileNodeList(list);
    } catch (e) {
      console.log('获取本地文件列表失败');
    } finally {
      setLoading(false);
    }
  }, [device, mobilePathCollection]);

  return [mobilePathCollection, setMobilePathCollection,
    mobileFileNodeList, setMobileFileNodeList];
}
