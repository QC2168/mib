import { useClickAway, useMount, useSetState } from "ahooks"
import path from 'path'
import { AppstoreOutlined, DesktopOutlined, MobileOutlined, RetweetOutlined, RollbackOutlined, SearchOutlined } from '@ant-design/icons'
import { createRef, useEffect, useRef, useState } from "react";
import ignoreFileList from "@/utils/ignoreFileList";
import Table, { ColumnsType } from "antd/lib/table";
const { pathExistsSync, readdirSync, statSync } = require('fs-extra')
import dayjs from 'dayjs'
import { createFileNode, execAdb, openNotification, readablizeBytes } from "@/utils";
import { DriverType, FileNodeType } from "@/types";
import { Breadcrumb, Button, Card, Input, message, Switch } from "antd";
import styles from './index.module.scss'
import classnames from "classnames";
import Control, { ControlOptionType } from "@/components/control";
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
    render: val => readablizeBytes(val),
    sorter: (a, b) => a.fileSize - b.fileSize,
  },
  {
    title: '修改时间',
    dataIndex: 'fileMTime',
    key: 'fileMTime',
    render: time => <span>{dayjs(time).format("YYYY-MM-DD hh:mm:ss")}</span>
  },

];

export default function fileManage() {
  // 本地文件列表
  const [localFileNodeList, setLocalFileNodeList] = useState<FileNodeType[]>([])
  // 移动设备文件列表
  const [mobileFileNodeList, setMobileFileNodeList] = useState<FileNodeType[]>([])
  // loading
  const [loading, setLoading] = useState(true)
  // 当前文件路径
  const [localPathCollection, setLocalPathCollection] = useState(['g:/'])
  // 当前路径
  const [MobilePathCollection, setMobilePathCollection] = useState(['sdcard/', 'DCIM', 'Camera'])
  // 搜索框
  const [searchVal, setSearchVal] = useState<string>('')

  // 显示状态
  const [curDriType, setCurDriType] = useState<DriverType>(DriverType.LOCAL)

  // 右击
  const controlPanelRef = useRef<HTMLDivElement | null>(null)
  // 控制面板坐标
  interface ControlPanelStyleType {
    left: number;
    top: number;
    visibility: 'visible' | 'hidden'
  }
  useClickAway(() => {
    setControlPanelStyle({ ...controlPanelStyle, visibility: 'hidden' })
  }, controlPanelRef);
  const [controlPanelStyle, setControlPanelStyle] = useState<ControlPanelStyleType>({
    left: 0,
    top: 0,
    visibility: 'hidden'
  })

  const rightDownOperations: ControlOptionType[] = [
    {
      label: '打开',
      show: [DriverType.LOCAL, DriverType.MOBILE],
      key: 'open'
    },
    {
      label: '添加到备份节点', show: [DriverType.MOBILE]
      , key: 'addBackNodeList'
    },
    {
      label: '添加到忽略名单', show: [DriverType.LOCAL]
      , key: 'addIgnoreList'
    },
    {
      label: '刷新',
      show: [DriverType.LOCAL, DriverType.MOBILE],
      key: 'reload'
    },
    {
      label: '重命名',
      show: [DriverType.LOCAL, DriverType.MOBILE],
      key: 'rename'
    },
  ]
  // 读取移动设备目录
  function readMobileDriverDir(target: string) {
    // 清空原列表
    setMobileFileNodeList([])
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
        fileSize: Number(item[4]) ?? 0,
        filePath: target + fileName,
        isDirectory: item[0].startsWith("d"),
        fileMTime: item.slice(5, 7).join(' ')
      }

      setMobileFileNodeList(fileNodeList => [...fileNodeList, fileNode])
    });
    setLoading(false)
  }

  // 读取本地目录
  function readDir(target: string) {
    // 清空原列表
    setLocalFileNodeList([])
    setLoading(true)
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
        setLocalFileNodeList(fileNodeList => [...fileNodeList, node])
      } catch (error) {
        openNotification(item, '生成节点出错啦')
      }
    }
    setLoading(false)
  }

  useMount(() => {
    readDir(localPathCollection.join('/'))
    readMobileDriverDir(MobilePathCollection.join('/'))
  })

  // 更新本地文件列表
  useEffect(() => {
    console.log('trigger local path rejoin');
    setLoading(true)
    readDir(localPathCollection.join('/'))
  }, [localPathCollection])
  // 更新移动设备文件列表
  useEffect(() => {
    console.log('trigger mobile path rejoin');
    setLoading(true)
    readMobileDriverDir(MobilePathCollection.join('/'))
  }, [MobilePathCollection])

  // 返回上一级
  const turnBack = () => {
    if (curDriType === DriverType.LOCAL) {
      // 如果是最上一层，不处理
      if (localPathCollection.length === 1) {
        message.warning('当前位置处于根目录，无法再返回上一级了');
        return
      }
      setLocalPathCollection(path => path.slice(0, -1))
    }
    if (curDriType === DriverType.MOBILE) {
      // 如果是最上一层，不处理
      if (MobilePathCollection.length === 1) {
        message.warning('当前位置处于根目录，无法再返回上一级了');
        return
      }
      setMobilePathCollection(path => path.slice(0, -1))
    }
  }


const reload = () => {
  search()
}
const search = () => {
  if (searchVal.trim() === '') {
    readDir(localPathCollection.join('/'))
    return
  }
  if (curDriType === DriverType.LOCAL) {
    const filterList = localFileNodeList.filter(item => item.fileName.includes(searchVal))
    setLocalFileNodeList(filterList)
  }
  if (curDriType === DriverType.MOBILE) {
    const filterList = mobileFileNodeList.filter(item => item.fileName.includes(searchVal))
    setMobileFileNodeList(filterList)
  }

}
// 切换状态
const handleDriverStatus = (targetStatus: DriverType) => {
  setCurDriType(targetStatus)
}
useEffect(() => {
  console.log('search:', searchVal);
  search()
}, [searchVal])

return (
  <Card className="overflow-hidden">
    {/* 右击菜单面板 */}
    <Control ref={controlPanelRef} options={rightDownOperations} onRow={
      ({ label, key }) => {
        return {
          onClick: () => {
            console.log(key, label)
            setControlPanelStyle({ ...controlPanelStyle, visibility: 'hidden' })
          },
        }
      }

    }
      curType={curDriType} styles={controlPanelStyle}></Control>
    <div className={classnames('flex', 'mb-4', 'justify-between')}>
      <div className={classnames('flex', 'items-center')}>
        <div className={styles.operationGroup}>
          <Button type="default" shape="circle" onClick={() => turnBack()}><RollbackOutlined /></Button>
          <Button type="default" shape="circle" onClick={() => reload()}><RetweetOutlined /></Button>
        </div>
        <Breadcrumb>
          {
            curDriType === DriverType.LOCAL ?
              localPathCollection.map((item, index) => <Breadcrumb.Item key={item}>{
                index === 0 ? (item.slice(0, -2)).toUpperCase() : item
              }</Breadcrumb.Item>)
              :
              MobilePathCollection.map((item) => <Breadcrumb.Item key={item}>{
                item
              }</Breadcrumb.Item>)
          }
        </Breadcrumb>
      </div>

      <div className="flex items-center">
        <div className="mx-4 text-xl">
          <DesktopOutlined className={curDriType === DriverType.LOCAL ? 'text-indigo-600 mx-2' : ' mx-2'} onClick={() => handleDriverStatus(DriverType.LOCAL)} />
          <MobileOutlined className={curDriType === DriverType.MOBILE ? 'text-indigo-600 mx-2' : ' mx-2'} onClick={() => handleDriverStatus(DriverType.MOBILE)} />
        </div>

        <Input
          placeholder="search files"
          allowClear
          prefix={<SearchOutlined />}
          value={searchVal}
          onChange={(event) => setSearchVal(event.target.value)}
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
            if(curDriType===DriverType.LOCAL)setLocalPathCollection(paths => [...paths, fileName])
            if(curDriType===DriverType.MOBILE)setMobilePathCollection(paths => [...paths, fileName])

          }

        },
        onMouseDown: event => {
          if (event.button === 2) {
            // 触发右击
            console.log(event)
            const { pageX, pageY } = event.nativeEvent
            setControlPanelStyle({
              left: pageX - 98,
              top: pageY - 80,
              visibility: 'visible'
            })

          }

        }
      };
    }} rowKey='fileName' loading={loading} dataSource={curDriType === DriverType.LOCAL ? localFileNodeList : mobileFileNodeList} />
  </ Card >

)

}
