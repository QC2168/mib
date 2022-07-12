import { Button, Card, List, Radio, RadioChangeEvent, Space } from "antd"
import { useState } from "react"
import styles from './index.module.scss'

import ignoreFileList from "@/utils/ignoreFileList"
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons"
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
    color: 'auto'
  })
  const handleColor = (event: RadioChangeEvent) => {
    const data = { ...config }
    data.color = event.target.value
    setConfig(data)
  }
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

    </Card>
  )
}
