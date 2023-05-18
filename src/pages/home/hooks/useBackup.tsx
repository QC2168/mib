import {
  Button, Modal, Popconfirm, Space, Tag,
} from 'antd';
import {
  Key,
  useState,
} from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { SaveItemType as BackItemType, SaveItemType } from '@qc2168/mib';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useMessage from '@/utils/message';
import useDevices from '@/pages/home/hooks/useDevices';
import { BackupModalRef, MODAL_STATUS } from '@/pages/home/components/BackupModal';
import Mib from '@qc2168/mib';
import { useMount } from 'ahooks';
import styles from '../index.module.less';
import useMib from './useMib';

const { confirm } = Modal;
export default function useBackup(opt: Partial<Pick<BackupModalRef, 'open'> & { delNode: (i: string) => void }>) {
  const [instance] = useMib();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    devices,
    handleDevice,
    currentDevices,
    check,
  } = useDevices();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const {
    createErrorMessage,
    createSuccessMessage,
    createWarningMessage,
  } = useMessage();
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const editNode = (data: SaveItemType, index: number) => {
    opt.open?.(MODAL_STATUS.EDIT, data, index);
  };
  const deleteNode = (item: BackItemType) => {
    opt.delNode?.(item.path);
  };

  async function backup(data: SaveItemType | SaveItemType[]) {
    try {
      await window.core.backup(data);
    } catch (e) {
      createErrorMessage('备份出错了');
    } finally {
      setIsLoading(false);
    }
  }

  const backupNode = (item: BackItemType) => {
    // 检测设备连接
    if (!check()) {
      createWarningMessage('请先连接设备，再执行操作');
      return;
    }
    setIsLoading(true);
    backup(item);
  };

  async function backupTip() {
    // 判断是否连接状态
    // 判断备份节点
    if (selectedRowKeys.length === 0) {
      createWarningMessage('当前没有选中任何备份节点');
      return;
    }
    // 检测设备连接
    if (!check()) {
      createWarningMessage('请先连接设备，再执行操作');
      return;
    }
    confirm({
      title: '',
      icon: <ExclamationCircleOutlined />,
      content: '备份可能需要一小段时间，确定么？',
      onOk() {
        console.log(selectedRowKeys);
        const data = (instance as Mib)?.config.backups.filter((j) => selectedRowKeys.includes(j.comment)) ?? [];
        setIsLoading(true);
        backup(data);
      },
    });
  }

  useMount(() => {
  // 监听备份任务
    window.core.backupDone((event, data) => {
      if (data.result) {
        createSuccessMessage(data.msg);
      } else {
        createErrorMessage(data.msg);
      }
    });
  });
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
      title: '导出路径',
      dataIndex: 'output',
      key: 'output',
      align: 'center',
      render: (i) => <Tag color="gold">{i || '继承父级'}</Tag>,
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
      width: '220px',
      render: (_: any, record: BackItemType, index: number) => (
        <Space size="small">
          <Button type="link" onClick={() => backupNode(record)}>备份</Button>
          <Button type="link" onClick={() => editNode(record, index)}>修改</Button>
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

  return {
    rowSelection,
    backupNodeColumns,
    isLoading,
    backupTip,
    devices,
    handleDevice,
    currentDevices,
  };
}
