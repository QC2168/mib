import {
  Button, Card, Modal, Space, Tag,
} from 'antd';
import {
  useEffect, useRef, useState, Key,
} from 'react';
import Table, { ColumnsType } from 'antd/lib/table';
import {
  diff, execAdb, getFileNodeList, isPath, log, openNotification, pathRepair, speedReg,
} from '@/utils';
import { getConfig } from '@/config';

import { BackItemType } from '@/types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useWorker, WORKER_STATUS } from '@koale/useworker';
import styles from './index.module.less';
import TableFooter from './TableFooter';
import backup from './worker/backup';

const { confirm } = Modal;
const config = getConfig();
export default function Analysis() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // eslint-disable-next-line max-len
  const [backupWorker] = useWorker(backup);
  useEffect(() => {
    console.log('备份节点更改');
    console.log(selectedRowKeys);
  }, [selectedRowKeys]);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const backupNode = (item: BackItemType) => {
    console.log(item);
  };
  const deleteNode = (item: BackItemType) => {
    console.log(item);
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
    // console.log(selectedRowKeys, utils, configUtils);
    // myWorker.postMessage(['backup', selectedRowKeys, utils, configUtils]);
    const res = await backupWorker(selectedRowKeys);
    console.log(res);
    // confirm({
    //   title: '',
    //   icon: <ExclamationCircleOutlined />,
    //   content: '备份可能需要一小段时间，确定么？',
    //   async onOk() {
    //     console.log('OK');
    //     // console.log(backupWorker);
    //     myWorker.postMessage('backup');
    //     // myWorker.postMessage([selectedRowKeys, utils, configUtils]);
    //     // backupWorker(selectedRowKeys, utils, configUtils);
    //     // backup(selectedRowKeys)
    //   },
    //   onCancel() {
    //     console.log('Cancel');
    //   },
    // });
  }
  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card>
          {/* 节点 */}
          <Table rowSelection={rowSelection} scroll={{ x: '100%', scrollToFirstRowOnChange: true, y: '300px' }} pagination={false} rowKey="comment" columns={backupNodeColumns} dataSource={config.backups} />
        </Card>
        <Card>
          <Space size="middle">
            <Button loading={false} onClick={() => backupTip()} type="primary">极速备份数据</Button>
            <Button>取消</Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
