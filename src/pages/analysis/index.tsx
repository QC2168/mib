import {
  Button, Card, Empty, message, Modal, Popconfirm, Select, Space, Table, Tag,
} from 'antd';
import {
  Key, useRef,
  useState,
} from 'react';
import type { ColumnsType } from 'antd/es/table';
import { openNotification } from '@/utils';
import { BackItemType } from '@/types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useConfig from '@/config/useConfig';
import useDevices, { DeviceStatus } from '@/hooks/useDevices';
import JSONEditor, { JSONEditorMode } from 'jsoneditor';

const { Option } = Select;
const { confirm } = Modal;

export default function Analysis() {
  const [config, setConfig] = useConfig();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [devices, setDevices, isConnect] = useDevices();
  const [jsonEditor, setJsonEditor] = useState<JSONEditor | null>(null);
  const jsonEditorRef = useRef<HTMLDivElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const saveCfg = () => {
    const t = jsonEditor?.get();
    setConfig(t);
    setIsModalOpen(false);
  };
  const openCfgModal = () => {
    setIsModalOpen(true);
    const options = {
      mode: 'text' as JSONEditorMode,
      mainMenuBar: false,
      navigationBar: false,
      statusBar: false,
    };
    if (!jsonEditor) {
      const instance: JSONEditor = new JSONEditor(jsonEditorRef.current as HTMLElement, options);
      instance.set(config);
      setJsonEditor(instance);
    } else {
      jsonEditor.update(config);
    }
  };

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDevice = (name: string) => {
    setDevices({
      current: {
        name,
        status: DeviceStatus.DEVICE,
      },
    });
  };
  const worker = new Worker(new URL('./worker/backup.ts', import.meta.url), {
    type: 'module',
  });
  worker.onerror = () => {
    openNotification('备份进程', '进程出错了');
  };
  worker.onmessage = (e) => {
    const { message: workerMessage } = e.data;
    if (workerMessage === 'done') {
      setIsLoading(false);
      return;
    }
    openNotification('备份进程', workerMessage);
  };

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
    setIsLoading(true);
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
      title: '节点导出路径',
      dataIndex: 'output',
      key: 'output',
      align: 'center',
      render: (i) => <Tag color={i ? 'gold' : ''}>{i || '继承父级'}</Tag>,
    },
    {
      title: '全量备份',
      dataIndex: 'full',
      key: 'full',
      align: 'center',
      render: (i) => <Tag color={i ? 'blue' : 'red'}>{i ? '是' : '否'}</Tag>,

    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_: any, record: BackItemType) => (
        <Space>

          <Button type="link" onClick={() => backupNode(record)}>单独备份</Button>

          <Popconfirm
            title="确认删除该节点?"
            onConfirm={() => deleteNode(record)}
            okText="是"
            cancelText="否"
          >
            <Button type="link">删除节点</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  async function backupTip() {
    // 判断是否连接状态
    if (!isConnect()) {
      message.warning('当前没有设备连接');
      return;
    }
    // 判断备份节点
    if (selectedRowKeys.length === 0) {
      message.warning('当前没有选中任何备份节点');
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
          device: devices.current!.name,
        };
        setIsLoading(true);
        worker.postMessage(postItem);
      },
    });
  }

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title="备份节点" bordered extra={<Button type="link" onClick={() => openCfgModal()}>配置文件</Button>}>
          {/* 节点 */}
          <Table
            rowSelection={rowSelection}
            locale={{ emptyText: <Empty description="暂无节点数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
            scroll={{
              x: '100%',
              scrollToFirstRowOnChange: true,
              y: '300px',
            }}
            pagination={false}
            rowKey="comment"
            columns={backupNodeColumns}
            dataSource={config.backups}
          />
        </Card>
        <Card>
          <Space size="middle">
            <Button loading={isLoading} onClick={() => backupTip()} type="primary">极速备份数据</Button>
            {/* <Button>取消</Button> */}
            <Select
              defaultValue="请选择设备"
              value={devices.current?.name ? devices.current.name : '未连接'}
              style={{ width: 160 }}
              onChange={handleDevice}
              notFoundContent={<div>无设备连接</div>}
            >
              {
                devices.devicesList.map((item) => <Option key={item.name} value={item.name}>{item.name}</Option>)
              }
            </Select>
          </Space>
        </Card>
      </Space>
      <Modal
        title="配置文件"
        open={isModalOpen}
        onOk={() => saveCfg()}
        onCancel={() => setIsModalOpen(false)}
        cancelText="取消"
        okText="更新"
      >
        <div ref={jsonEditorRef} />
      </Modal>
    </div>
  );
}
