import {
  Button, Card, Empty, List, Popconfirm, Tag, Table,
} from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { BackItemType } from '@/types';
import useConfig from '@/config/useConfig';

const ignoreHeaderFn = (size: number) => (

  <div className="flex">
    <Button className="mr-3" type="primary" icon={<PlusCircleOutlined />} size="small">新增</Button>
    <Button className="mr-3" type="primary" danger icon={<DeleteOutlined />} size="small">清空</Button>
    <div>
      当前忽略文件个数：
      {size}
    </div>
  </div>
);
export default function Settings() {
  const [config, setConfig] = useConfig();
  const deleteBackupItem = (item: BackItemType) => {
    setConfig({
      backups: config.backups.filter((i) => i.path !== item.path),
    });
  };
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
      render: (_: any, item: BackItemType) => (
        <Popconfirm
          title="确认删除该节点?"
          onConfirm={() => deleteBackupItem(item)}
          okText="是"
          cancelText="否"
        >
          <Button type="link">删除</Button>
        </Popconfirm>
      )
      ,
    },
  ];
  return (
    <>
      <Card title="忽略扫描文件" className="mb-4" bordered>
        <List
          size="small"
          header={config.ignoreFileList ? ignoreHeaderFn(config.ignoreFileList.length) : undefined}
          bordered
          locale={{ emptyText: <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
          dataSource={config.ignoreFileList ?? []}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>

      <Card title="忽略扫描文件" bordered>
        <Table
          columns={backupNodeColumns}
          rowKey="path"
          locale={{ emptyText: <Empty description="暂无节点数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
          dataSource={config.backups}
        />
      </Card>
    </>
  );
}
