import {
  useState, useEffect, Dispatch, SetStateAction, useCallback,
} from 'react';
import useConfig from '@/config/useConfig';
import { createFileNode } from '@/utils';
import { FileNodeType } from '@/types';

const path = require('path');
const { pathExistsSync, readdir } = require('fs-extra');

export default function useLocalFile(targetPath?:string):[string[], Dispatch<SetStateAction<string[]>>, FileNodeType[], Dispatch<SetStateAction<FileNodeType[]>>, boolean] {
  const [config] = useConfig();
  // 当前文件路径
  const [localPathCollection, setLocalPathCollection] = useState<string[]>([targetPath ?? config.output]);
  // 本地文件列表
  const [localFileNodeList, setLocalFileNodeList] = useState<FileNodeType[]>([]);
  // loading
  const [loading, setLoading] = useState(false);
  // 读取本地目录
  const readLocalDir = useCallback((target: string) => {
    // 当前有任务正在加载,
    if (loading) return;
    // 清空原列表
    setLocalFileNodeList([]);
    setLoading(true);
    if (!pathExistsSync(target)) {
      throw new Error('无效路径');
    }
    // 读取文件名称
    readdir(target).then((fileList: string[]) => {
    // 过滤不必要的文件名
      const ignoreList = config.ignoreFileList ?? [];
      const filterFileList = fileList.filter((name) => !ignoreList.includes(name));
      const nodeList = filterFileList.map((name) => createFileNode(path.join(target, name)));
      setLocalFileNodeList(nodeList);
      setLoading(false);
    });
  }, [config.ignoreFileList, loading]);

  // 更新本地文件列表
  useEffect(() => {
    readLocalDir(localPathCollection.join('/'));
  }, [localPathCollection]);

  return [
    localPathCollection,
    setLocalPathCollection,
    localFileNodeList,
    setLocalFileNodeList,
    loading];
}
