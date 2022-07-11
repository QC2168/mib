import { useMount, useSetState } from "ahooks"
import path from 'path'
import { AppstoreOutlined, SearchOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react";
import ignoreFileList from "@/utils/ignoreFileList";
import Table, { ColumnsType } from "antd/lib/table";
const { pathExistsSync, readdirSync, statSync } = require('fs-extra')
import dayjs from 'dayjs'
import { createFileNode, openNotification, readablizeBytes } from "@/utils";
import { FileNodeType } from "@/types";
import { Breadcrumb, Button, Card, Input } from "antd";
import styles from './index.module.scss'
import classnames from "classnames";
const { Search } = Input;
const columns: ColumnsType<FileNodeType> = [
  {
    title: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    key: 'fileSize',
    render: val => readablizeBytes(val)
  },
  {
    title: '修改时间',
    dataIndex: 'fileMTime',
    key: 'fileMTime',
    render: time => <span>{dayjs(time).format("YYYY-MM-DD hh:mm:ss")}</span>
  },

];

export default function fileManage() {
  // 文件列表
  const [fileNodeList, setFileNodeList] = useState<FileNodeType[]>([])
  // 当前路径
  const [curPath, setCurPath] = useState('d:/')
  // loading
  const [loading, setLoading] = useState(true)
  function readDir(target: string) {
    // 清空原列表
    setFileNodeList([])
    console.log('trigger readDir');
    if (!pathExistsSync(target)) {
      console.log(target);

      throw new Error('无效路径')
    }
    const fileList = readdirSync(target)
    for (const item of fileList) {
      if (ignoreFileList.includes(item)) {
        // 在忽略名单中，跳过
        continue;
      }
      try {
        const node = createFileNode(path.join(target, item))
        setFileNodeList(fileNodeList => [...fileNodeList, node])
      } catch (error) {
        openNotification(item, '生成节点出错啦')
      }
    }
    setLoading(false)
  }
  useMount(() => {
    try {
      readDir(curPath)
    } catch (error) {
      console.log('-------------------');
      console.log(error);

    }

  })

  // 更新文件列表
  useEffect(() => {
    readDir(curPath)
  }, [curPath])

  // 返回上一级
  const turnBack = () => {
    console.log(curPath.slice(0, curPath.lastIndexOf('\\')));
    setCurPath(path => path.slice(path.lastIndexOf('\\')))
  }

  const reload = () => {

  }
  return (
    <Card >
      <div className={classnames('flex', 'mb-4', 'justify-between')}>
        <div className={styles.operationGroup}>
          <Button type="default" onClick={() => turnBack()}>turnBack</Button>
          <Button type="default" onClick={() => reload()}>reload</Button>
        </div>
        <div> <Input
          placeholder="input search text"
          allowClear
          prefix={<SearchOutlined />}
          style={{ width: 304 }}
        /></div>

      </div>
      <div className={classnames('my-4 ml-1')}>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">Application Center</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>An Application</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Table columns={columns} onRow={({ fileName, isDirectory }, rowIndex) => {
        return {
          onClick: e => {
            console.log('fileName', fileName);
            console.log('isDirectory', isDirectory);
          },
          onDoubleClick: event => {
            console.log(fileName);

            if (isDirectory) {
              setLoading(true)
              setCurPath(p => path.join(p, fileName))
            }

          }
        };
      }} rowKey='fileName' bordered loading={loading} dataSource={fileNodeList} />
    </ Card>

  )

}
