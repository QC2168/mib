import {
  Button, Card, Modal, Space,
} from 'antd';
import {
  useEffect, Key,
  useState,
} from 'react';
import Table, { ColumnsType } from 'antd/lib/table';
import {
  diff, execAdb, getFileNodeList, isPath, openNotification, pathRepair,
} from '@/utils';
import { getConfig } from '@/config';
import {
  DriverType, FileNodeType, BackItemType,
} from '@/types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import TableFooter from './TableFooter';

const { confirm } = Modal;
const config = getConfig();
export default function Analysis() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const worker = new Worker(new URL('./worker/backup.ts', import.meta.url), {
    type: 'module',
  });
  worker.onmessage = function (e) {
    const { message } = e.data;
    openNotification('worker', message);
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

  // 备份到电脑上
  function backup(backupNodes:string[]|Key[]) {
    const c = getConfig();
    // setInBackup(true);
    // 判断是否有选择的节点
    // 备份选择的节点
    // 获取节点完整信息
    // eslint-disable-next-line max-len
    const curBackupNode:BackItemType[] = c.backups.filter((item:BackItemType) => backupNodes.includes(item.comment));
    const outputRootDir = c.output;
    // 判断根路径
    isPath(outputRootDir);
    curBackupNode.forEach(async (item) => {
      // 依次读取对比
      // 获取指定目录下的文件、文件夹列表
      const waitBackupFileList: FileNodeType[] = [];
      const dirPath = item.path;
      const dirList:string[] = execAdb(`shell ls -l ${dirPath}`).toString().split('\r\n').filter((i:string) => i !== '');
      // 去掉total
      dirList.shift();
      dirList.forEach((i) => {
        const splitItem: string[] = i.split(/\s+/);
        const fileName = splitItem.slice(7).join(' ');
        const fileNode: FileNodeType = {
          fileName,
          fileSize: Number(splitItem[4]) ?? 0,
          filePath: pathRepair(dirPath) + fileName,
          isDirectory: splitItem[0].startsWith('d'),
          fileMTime: splitItem.slice(5, 7).join(' '),
        };
        waitBackupFileList.push(fileNode);
      });
      // 判断导出路径是否存在
      const folderName = item.path.split('/').filter((i: string) => i !== '').at(-1);
      // 判断节点内是否有备份目录  // 拼接导出路径
      const itemRootPath = pathRepair(pathRepair(c.output) + folderName);
      const outputDir = item.output
        ? item.output && pathRepair(item.output)
        : itemRootPath;
      isPath(outputDir);
      // 获取当前目录下的文件
      // 获取当前存储空间
      const localFileNodeList = getFileNodeList(outputDir, DriverType.LOCAL);
      // 对比文件
      const diffList: FileNodeType[] = diff(localFileNodeList, waitBackupFileList);
      console.log(localFileNodeList);
      console.log(waitBackupFileList);
      console.log('diffList', diffList);
      // 备份
      // const res = await backupWorker(diffList, outputDir);
      const postItem = {
        task: 'move',
        nodeName: item.comment,
        diffList,
        outputDir,
      };
      worker.postMessage(postItem);
    });
  }
  async function backupTip() {
    confirm({
      title: '',
      icon: <ExclamationCircleOutlined />,
      content: '备份可能需要一小段时间，确定么？',
      onOk() {
        backup(selectedRowKeys);
        const postItem = {
          task: 'backup',
          backupNodes: selectedRowKeys,
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
