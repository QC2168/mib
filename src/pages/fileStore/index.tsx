import { useMount, useSetState } from "ahooks"
import path from 'path'
import { AppstoreOutlined, RetweetOutlined, RollbackOutlined, SearchOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react";
import ignoreFileList from "@/utils/ignoreFileList";
import Table, { ColumnsType } from "antd/lib/table";
const { pathExistsSync, readdirSync, statSync } = require('fs-extra')
import dayjs from 'dayjs'
import { createFileNode, openNotification, readablizeBytes } from "@/utils";
import { FileNodeType } from "@/types";
import { Breadcrumb, Button, Card, Input, message } from "antd";
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
  // loading
  const [loading, setLoading] = useState(true)
  // 当前文件路径
  const [pathCollection,setPathCollection]=useState(['d:'])

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
      readDir(pathCollection.join('/'))
    } catch (error) {
      console.log('-------------------');
      console.log(error);

    }

  })

  // 更新文件列表
  useEffect(() => {
    console.log('trigger path rejoin');
    readDir(pathCollection.join('/'))
  }, [pathCollection])

  // 返回上一级
  const turnBack = () => {
    // 如果是最上一层，不处理
    if(pathCollection.length===1){
      message.warning('当前位置处于根目录，无法再返回上一级了');
      return
    }
    setPathCollection(path => path.slice(0,-1))
  }

  const reload = () => {

  }
  return (
    <Card >
      <div className={classnames('flex', 'mb-4', 'justify-between')}>
        <div className={classnames('flex','items-center')}>
          <div className={styles.operationGroup}>
          <Button type="default" shape="circle" onClick={() => turnBack()}><RollbackOutlined /></Button>
          <Button type="default" shape="circle" onClick={() => reload()}><RetweetOutlined /></Button>
          </div>
          <Breadcrumb>
        {
          pathCollection.map(item=><Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>)
        }
        </Breadcrumb>
        </div>

        <div> <Input
          placeholder="input search text"
          allowClear
          prefix={<SearchOutlined />}
          style={{ width: 304 }}
        /></div>

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
              setPathCollection(paths=>[...paths,fileName])
            }

          }
        };
      }} rowKey='fileName' bordered loading={loading} dataSource={fileNodeList} />
    </ Card>

  )

}
