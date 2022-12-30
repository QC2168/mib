import {
  Button, Card, Empty, message, Modal, Popconfirm, Select, Space, Table, Tag,
} from 'antd';
import {
  Key, useEffect, useRef,
  useState,
} from 'react';
import type { ColumnsType } from 'antd/es/table';
import { openNotification } from '@/utils';
import type { SaveItemType as BackItemType } from '@qc2168/mib';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useConfig from '@/config/useConfig';
import useDevices, { DeviceStatus } from '@/hooks/useDevices';
import 'jsoneditor/dist/jsoneditor.css';
import JSONEditor, { JSONEditorMode } from 'jsoneditor';
import BackupModal from './components/BackupModal';
import type{ ExposeType as BackupModalExposeType } from './components/BackupModal';
import styles from './index.module.less';

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

  const backupModalRef = useRef<BackupModalExposeType|null>(null);
  const saveCfg = () => {
    const t = jsonEditor?.get();
    setConfig(t);
    setIsModalOpen(false);
  };
  const openCfgModal = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (!isModalOpen) return;
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
  }, [isModalOpen, config, jsonEditor]);

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
      width: '150px',

      render: (comment: string) => (
        <div title={comment} className={styles.tableTableNodeComment}>
          {comment}
        </div>
      ),
    },
    {
      title: '备份路径',
      dataIndex: 'path',
      key: 'path',
      width: '200px',
      render: (path: string) => (
        <div title={path} className={styles.tableTablePath}>
          {path}
        </div>
      ),
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
      fixed: 'right',
      width: '160px',
      render: (_: any, record: BackItemType) => (
        <Space size="small">
          <Button type="link" onClick={() => backupNode(record)}>备份</Button>
          <Popconfirm
            title="确认删除该节点?"
            onConfirm={() => deleteNode(record)}
            okText="是"
            cancelText="否"
          >
            <Button type="link">删除</Button>
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

  function cardRightBtn() {
    return (
      <Space size="middle">
        <Button type="link" onClick={() => backupModalRef.current?.open()}>新增节点</Button>
        <Button type="link" onClick={() => openCfgModal()}>查看配置文件</Button>
      </Space>
    );
  }

  return (
    <>
      <Card title="备份节点" bordered extra={cardRightBtn()}>
        <div>
          {/* 节点 */}
          <Table
            rowSelection={rowSelection}
            locale={{ emptyText: <Empty description="暂无节点数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
            scroll={{
              x: '100%',
              scrollToFirstRowOnChange: true,
              y: document.documentElement.clientHeight - 250,
            }}
            pagination={false}
            rowKey="comment"
            columns={backupNodeColumns}
            dataSource={config.backups}
          />
          <div className="mt-8 flex justify-end">
            <Button className="mr-3" loading={isLoading} onClick={() => backupTip()} type="primary">一键备份</Button>
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
          </div>
        </div>
      </Card>

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
      <BackupModal ref={backupModalRef} />
    </>
  );
}
