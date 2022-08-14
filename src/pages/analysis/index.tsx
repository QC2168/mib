import {
  Button, Card, Empty, message, Modal, Select, Space,
} from 'antd';
import {
  useEffect, Key,
  useState,
} from 'react';
import Table, { ColumnsType } from 'antd/lib/table';
import { openNotification } from '@/utils';
import {
  DriverType, FileNodeType, BackItemType,
} from '@/types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useConfig from '@/config/useConfig';
import { useMount } from 'ahooks';
import TableFooter from './TableFooter';
import useDevices, { DeviceStatus } from './hooks/useDevices';

const { Option } = Select;
const { confirm } = Modal;

export default function Analysis() {
  const [config, setConfig] = useConfig();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [devices, setDevices, isConnect] = useDevices();
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  useMount(() => {
    console.log(devices);
  });
  const handleDevice = (name:string) => {
    setDevices({ current: { name, status: DeviceStatus.DEVICE } });
  };
  const worker = new Worker(new URL('./worker/backup.ts', import.meta.url), {
    type: 'module',
  });

  worker.onmessage = (e) => {
    const { message: workerMessage } = e.data;
    openNotification('worker', workerMessage);
  };
  useEffect(() => {
    console.log('备份节点更改');
    console.log(selectedRowKeys);
  }, [selectedRowKeys]);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const backupNode = (item: BackItemType) => {
    if (!isConnect()) {
      message.warning('当前没有设备连接');
      return;
    }

    const postItem = {
      task: 'backup',
      backupNodes: [item.comment],
      devices: devices.current!.name,
    };
    worker.postMessage(postItem);
  };
  const deleteNode = (item: BackItemType) => {
    setConfig({
      backups: config.backups.filter((i) => i.path !== item.path),
    });
  };
  const backupNodeColumns: ColumnsType<BackItemType> = [
    {
      title: '节点描述',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: '备份路径',
      dataIndex: 'path',
      key: 'path',
    },

    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_: any, record: BackItemType) => (
        <Space>
          <Button type="link" onClick={() => backupNode(record)}>单独备份</Button>
          <Button type="link" onClick={() => deleteNode(record)}>删除节点</Button>
        </Space>
      ),
    },
  ];

  const hasSelected = selectedRowKeys.length > 0;

  async function backupTip() {
    if (!isConnect()) {
      message.warning('当前没有设备连接');
      return;
    }
    confirm({
      title: '',
      icon: <ExclamationCircleOutlined />,
      content: '备份可能需要一小段时间，确定么？',
      onOk() {
        const postItem = {
          task: 'backup',
          backupNodes: selectedRowKeys,
          devices: devices.current!.name,
        };
        worker.postMessage(postItem);
      },
    });
  }

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card>
          {/* 节点 */}
          <Table rowSelection={rowSelection} locale={{ emptyText: <Empty description="暂无节点数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }} scroll={{ x: '100%', scrollToFirstRowOnChange: true, y: '300px' }} pagination={false} rowKey="comment" columns={backupNodeColumns} dataSource={config.backups} />
        </Card>
        <Card>
          <Space size="middle">
            <Button loading={false} onClick={() => backupTip()} type="primary">极速备份数据</Button>
            <Button>取消</Button>
            <Select defaultValue="请选择设备" value={devices.current?.name ? devices.current?.name : '未连接'} style={{ width: 160 }} onChange={handleDevice}>
              {
              devices.devicesList.map((item) => <Option key={item.name} value={item.name}>{item.name}</Option>)
             }
            </Select>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
