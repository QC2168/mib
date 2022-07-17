import { Button, Card, List, Radio, RadioChangeEvent, Space, Tag } from "antd"
import { useState } from "react"
import styles from './index.module.scss'

import ignoreFileList from "@/utils/ignoreFileList"
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons"
import { useMount } from "ahooks"
import { getConfig } from "@/config"
import Table, { ColumnsType } from "antd/lib/table"
import { BackItemType } from "@/types"
const ignoreHeaderFn = () => {
  return (
    <div className="flex">
      <Button className="mr-3" type="primary" icon={<PlusCircleOutlined />} size='small'>新增</Button>
      <Button className="mr-3" type="primary" danger icon={<DeleteOutlined />} size='small'>清空</Button>
      <div>当前忽略文件个数：{ignoreFileList.length}</div>
    </div>
  )
}
export default () => {
  const [config, setConfig] = useState({
    color: 'auto',
    backupNode: getConfig()
  })


  const handleColor = (event: RadioChangeEvent) => {
    const data = { ...config }
    data.color = event.target.value
    setConfig(data)
  }


  const backupNodeColumns: ColumnsType<BackItemType> = [
    {
      title: '备份路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '节点描述',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: '节点导出路径',
      dataIndex: 'output',
      key: 'output',
      align: 'center',
      render: (i) => <Tag color={i ? 'gold' : ''}>{i ? i : '继承父级'}</Tag >
    },
    {
      title: '全量备份',
      dataIndex: 'full',
      key: 'full',
      align: 'center',
      render: (i) =>
        <Tag color={i ? 'blue' : 'red'}>{i ? '是' : '否'}</Tag >

    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_: any, record: BackItemType) => (
        <a>Delete</a>
      )
    },
  ];
  return (
    <Card >
      <div className={styles.settingItem}>
        <div className="text-xl font-bold mb-3">皮肤</div>
        <Radio.Group onChange={(event) => handleColor(event)} value={config.color}>
          <Space direction="horizontal">
            <Radio value='auto'>自动</Radio>
            <Radio value='light'>浅色</Radio>
            <Radio value='dark'>深色</Radio>
          </Space>
        </Radio.Group>
      </div>
      <div className={styles.settingItem}>
        <div className="text-xl font-bold mb-3">忽略显示文件</div>
        <List
          size="small"
          header={ignoreHeaderFn()}
          footer={<div></div>}
          bordered
          dataSource={ignoreFileList}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </div>
      <div className={styles.settingItem}>
        <div className="text-xl font-bold mb-3">备份选项</div>
        <Table columns={backupNodeColumns} dataSource={config.backupNode.backups} />;
      </div>

    </Card>
  )
}
