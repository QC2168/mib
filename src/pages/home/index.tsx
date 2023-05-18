import {
  Button, Card, Empty, Select, Table,
  Typography,
} from 'antd';

import { VerticalAlignBottomOutlined, PlusOutlined } from '@ant-design/icons';
import BackupModal, { BackupModalRef as BackupModalRefExpose, MODAL_STATUS } from '@/pages/home/components/BackupModal';
import { useRef } from 'react';
import useMessage from '@/utils/message';
import useDataSource from '@/pages/home/hooks/useDataSource';
import useMib from '@/pages/home/hooks/useMib';
import useBackup from './hooks/useBackup';

const { Text } = Typography;
const { Option } = Select;

export default function Analysis() {
  const { createErrorMessage } = useMessage();
  const [data, setData] = useDataSource();
  const [mibInstance] = useMib();
  const BackupModalRef = useRef<BackupModalRefExpose|null>(null);

  const delNode = async (index: string) => {
    try {
      const cfg = await window.core.removeNode(index);
      setData(cfg.backups);
    } catch {
      createErrorMessage('删除失败');
    }
  };
  const {
    rowSelection,
    backupNodeColumns,
    isLoading,
    backupTip,
    devices,
    handleDevice,
    currentDevices,
  } = useBackup({
    open: BackupModalRef.current?.open,
    delNode,
  });
  const addNode = () => {
    BackupModalRef.current?.open(MODAL_STATUS.ADD);
  };

  return (
    <Card
      title="备份节点"
      extra={(
        <Button
          type="link"
          className=""
          loading={isLoading}
          icon={<PlusOutlined />}
          onClick={() => addNode()}
        >
          新增节点
        </Button>
      )}
      bordered
    >
      <div>
        {/* 节点 */}
        <Table
          rowSelection={rowSelection}
          locale={{ emptyText: <Empty description="暂无节点数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
          scroll={{
            x: '100%',
            scrollToFirstRowOnChange: true,
            y: 280,
          }}
          pagination={false}
          rowKey="comment"
          columns={backupNodeColumns}
          dataSource={data || []}
        />
        <div className="mt-8 flex justify-between items-center">

          <div>
            <Text strong className="mr-1">
              当前导出路径:
            </Text>
            <Text>{mibInstance?.config.output}</Text>
          </div>
          <div>
            <Select
              className="mr-3"
              defaultValue="请选择设备"
              value={currentDevices || '请选择设备'}
              style={{ width: 160 }}
              onChange={handleDevice}
              notFoundContent={<div>无设备连接</div>}
            >
              {
                devices.map((item) => <Option key={item.name} value={item.name}>{item.name}</Option>)
              }
            </Select>
            <Button
              loading={isLoading}
              icon={<VerticalAlignBottomOutlined />}
              onClick={() => backupTip()}
              type="primary"
            >
              一键备份
            </Button>
          </div>

        </div>
        <BackupModal setSource={setData} ref={BackupModalRef} />
      </div>
    </Card>
  );
}
