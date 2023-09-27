import {
  Button, Modal, Popconfirm, Space, Tag,
} from 'antd';
import { Key, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { SaveItemType as BackItemType, SaveItemType } from '@qc2168/mib';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useMessage from '@/utils/message';
import useDevices from '@/pages/home/hooks/useDevices';
import { BackupModalRef, MODAL_STATUS } from '@/pages/home/components/BackupModal';
import { useMount } from 'ahooks';
import { useTranslation } from 'react-i18next';
import styles from '../index.module.less';
import { WorkModeEnum } from '../../../../electron/types';

const { confirm } = Modal;

const modeToLoadingState = {
  [WorkModeEnum.STOP]: { backupLoading: false, restoreLoading: false },
  [WorkModeEnum.BACKING]: { backupLoading: true, restoreLoading: false },
  [WorkModeEnum.RECOVERING]: { backupLoading: false, restoreLoading: true },
};
export default function useBackup(opt: Partial<Pick<BackupModalRef, 'open'> & { delNode: (i: number) => void }>) {
  const [backupLoading, setBackupLoading] = useState<boolean>(false);
  const [restoreLoading, setRestoreLoading] = useState<boolean>(false);
  const { t } = useTranslation();
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

  const editNode = (data: SaveItemType) => {
    if (!data.id) {
      createWarningMessage(t('home.table.nodeIdMiss'));
      return;
    }
    opt.open?.(MODAL_STATUS.EDIT, data);
  };
  const deleteNode = (data: SaveItemType) => {
    if (!data.id) return;
    opt.delNode?.(data.id);
  };

  async function backup(data: SaveItemType | SaveItemType[]) {
    try {
      await window.core.backup(data);
    } catch (e) {
      createErrorMessage(t('home.backups.backupError'));
    } finally {
      setBackupLoading(false);
    }
  }

  const backupNode = async (item: BackItemType) => {
    // 检测设备连接
    if (!check()) {
      createWarningMessage(t('home.table.noDeviceConnect'));
      return;
    }
    setBackupLoading(true);
    await backup(item);
  };
  function checkEnv() {
    // 判断是否连接状态
    // 判断备份节点
    if (selectedRowKeys.length === 0) {
      createWarningMessage(t('home.table.noSelectedNode'));
      return false;
    }
    // 检测设备连接
    if (!check()) {
      createWarningMessage(t('home.table.noDeviceConnect'));
      return false;
    }
    // 备份和恢复只能执行一个
    if (restoreLoading || backupLoading) {
      createWarningMessage(t('home.backups.waiting'));
      return false;
    }
    return true;
  }
  async function backupTip() {
    if (!checkEnv()) return;
    confirm({
      title: '',
      icon: <ExclamationCircleOutlined />,
      content: t('home.backups.tip'),
      async onOk() {
        const cfg = await window.core.instanceConfig();
        const data = cfg.backups.filter((j:SaveItemType) => selectedRowKeys.includes(j.id!)) ?? [];
        setBackupLoading(true);
        backup(data);
      },
    });
  }
  const restore = async () => {
    if (!checkEnv()) return;
    const cfg = await window.core.instanceConfig();
    const data = cfg.backups.filter((j:SaveItemType) => selectedRowKeys.includes(j.id!)) ?? [];
    setRestoreLoading(true);
    try {
      await window.core.restore(data);
    } catch (e) {
      createErrorMessage(t('home.backups.restoreError'));
    } finally {
      setRestoreLoading(false);
    }
  };
  const resetState = async (workMode:WorkModeEnum|null) => {
    let targetMode:WorkModeEnum;
    if (workMode === null) {
      targetMode = await window.core.getWorkMode();
    } else {
      targetMode = workMode;
    }
    const { backupLoading, restoreLoading } = modeToLoadingState[targetMode];
    setBackupLoading(backupLoading);
    setRestoreLoading(restoreLoading);
  };
  useMount(async () => {
  // 监听备份任务
    window.core.backupDone((event, data) => {
      if (data.result) {
        createSuccessMessage(data.msg);
      } else {
        createErrorMessage(data.msg);
      }
    });
    //   监听状态
    window.core.workModeChanged((event, data) => {
      const { mode } = data.result;
      resetState(mode);
    });
    //   获取状态
    await resetState(null);
  });
  const backupNodeColumns: ColumnsType<BackItemType> = [
    {
      title: t('home.table.desc'),
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
      title: t('home.table.targetPath'),
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
      title: t('home.table.output'),
      dataIndex: 'output',
      key: 'output',
      align: 'center',
      render: (i) => <Tag color="gold">{i || t('home.table.inheritOutput')}</Tag>,
    },
    {
      title: t('home.table.full'),
      dataIndex: 'full',
      key: 'full',
      align: 'center',
      render: (i) => <Tag color={i ? 'blue' : 'red'}>{i ? t('home.table.yes') : t('home.table.no')}</Tag>,

    },
    {
      title: t('home.table.options'),
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: '220px',
      render: (_: any, record: BackItemType) => (
        <Space size="small">
          <Button type="link" onClick={() => backupNode(record)}>{t('home.table.backup')}</Button>
          <Button type="link" onClick={() => editNode(record)}>{t('home.table.edit')}</Button>
          <Popconfirm
            title={t('home.table.deleteNodeTip')}
            onConfirm={() => deleteNode(record)}
          >
            <Button type="link">{t('home.table.deleteNode')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return {
    rowSelection,
    backupNodeColumns,
    backupLoading,
    backupTip,
    devices,
    handleDevice,
    currentDevices,
    restore,
    restoreLoading,
  };
}
