import {
  useState, useEffect, Dispatch, SetStateAction, useCallback,
} from 'react';
import useConfig from '@/config/useConfig';
import { createFileNode } from '@/utils';
import type { FileNodeType } from '@qc2168/mib/dist/types';
import { useMount } from 'ahooks';

const { getLocalFileNodeList } = require('@qc2168/mib');


export default function useLocalFile(targetPath?: string): [string[], Dispatch<SetStateAction<string[]>>, FileNodeType[], Dispatch<SetStateAction<FileNodeType[]>>, boolean] {
  const [config] = useConfig();
  // 当前文件路径
  const [localPathCollection, setLocalPathCollection] = useState<string[]>([targetPath ?? config.output]);
  // 本地文件列表
  const [localFileNodeList, setLocalFileNodeList] = useState<FileNodeType[]>([]);
  // loading
  const [loading, setLoading] = useState(false);
  // 更新本地文件列表
  useMount(() => {
    setLoading(true);
    try {
      const list = getLocalFileNodeList(config.output, false);
      console.log({ list });
      setLocalFileNodeList(list);
    } catch (e) {
      console.log('获取本地文件列表失败');
    } finally {
      setLoading(false);
    }
  });
  useEffect(() => {
    const list = getLocalFileNodeList(localPathCollection.join('/'), false);
    console.log({ list });
    setLocalFileNodeList(list);
  }, [localPathCollection]);

  return [
    localPathCollection,
    setLocalPathCollection,
    localFileNodeList,
    setLocalFileNodeList,
    loading];
}
