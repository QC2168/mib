import {
  Button, Card, Empty, Select, Table,
} from 'antd';

import useMib from './hooks/useMib';
import useBackup from './hooks/useBackup';

const { Option } = Select;

export default function Analysis() {
  const [instance] = useMib();

  const {
    rowSelection,
    backupNodeColumns,
    isLoading,
    backupTip, devices, handleDevice, currentDevices,
  } = useBackup();
  return (
    <Card title="备份节点" bordered>
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
          dataSource={instance?.config.backups || []}
        />
        <div className="mt-8 flex justify-end">
          <Button className="mr-3" loading={isLoading} onClick={() => backupTip()} type="primary">一键备份</Button>
          <Select
            defaultValue="请选择设备"
            value={currentDevices || '未连接'}
            style={{ width: 160 }}
            onChange={handleDevice}
            notFoundContent={<div>无设备连接</div>}
          >
            {
              devices.map((item) => <Option key={item.name} value={item.name}>{item.name}</Option>)
            }
          </Select>
        </div>
      </div>
    </Card>
  );
}
