import useConfig from '@/config/useConfig';
import { createFileNode } from '@/utils';
import { useMount } from 'ahooks';
import path from 'path';
import { pathExistsSync, readdirSync } from 'fs-extra';
import {
  useState, useEffect, Dispatch, SetStateAction,
} from 'react';
import { FileNodeType } from '@/types';

export default function useLocalFile(targetPath?:string):[string[], Dispatch<SetStateAction<string[]>>, FileNodeType[], Dispatch<SetStateAction<FileNodeType[]>>, boolean] {
  const [config] = useConfig();
  // 当前文件路径
  const [localPathCollection, setLocalPathCollection] = useState<string[]>([targetPath ?? config.output]);
  // 本地文件列表
  const [localFileNodeList, setLocalFileNodeList] = useState<FileNodeType[]>([]);
  // loading
  const [loading, setLoading] = useState(true);
  // 读取本地目录
  function readDir(target: string) {
    // 清空原列表
    setLocalFileNodeList([]);
    setLoading(true);
    console.log('trigger readDir');
    if (!pathExistsSync(target)) {
      console.log(target);
      throw new Error('无效路径');
    }
    // 读取文件名称
    const fileList: string[] = readdirSync(target);
    // 过滤不必要的文件名
    const ignoreList = config.ignoreFileList ?? [];
    const filterFileList = fileList.filter((name) => !ignoreList.includes(name));
    const nodeList = filterFileList.map((name) => createFileNode(path.join(target, name)));
    setLocalFileNodeList(nodeList);
    setLoading(false);
  }

  // 更新本地文件列表
  useEffect(() => {
    console.log('trigger local path rejoin');
    setLoading(true);
    readDir(localPathCollection.join('/'));
  }, [localPathCollection]);

  // 读取文件
  useMount(() => {
    readDir(localPathCollection.join('/'));
  });
  return [
    localPathCollection,
    setLocalPathCollection,
    localFileNodeList,
    setLocalFileNodeList,
    loading];
}
