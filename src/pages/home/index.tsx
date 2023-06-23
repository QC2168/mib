import {
  Button, Card, Empty, Select, Table, Input,
  Typography, Space,
} from 'antd';

import {
  UploadOutlined, PlusOutlined, UserOutlined, DownloadOutlined,
} from '@ant-design/icons';
import BackupModal, { BackupModalRef as BackupModalRefExpose, MODAL_STATUS } from '@/pages/home/components/BackupModal';
import { useRef } from 'react';
import useMessage from '@/utils/message';
import useDataSource from '@/pages/home/hooks/useDataSource';
import useEditOutput from '@/pages/home/hooks/useEditOutput';
import HelpModal, { helpModalExposeType } from '@/components/helpModal/index';
import useBackup from './hooks/useBackup';

const { Text } = Typography;
const { Option } = Select;

export default function Analysis() {
  const { createErrorMessage } = useMessage();
  const [data, setData] = useDataSource();
  const helpModalRef = useRef<helpModalExposeType | null>(null);
  const {
    isEditOutput,
    showEditOutputInput,
    saveOutput,
    tempOutputChange,
    outputPath,
  } = useEditOutput();
  const BackupModalRef = useRef<BackupModalRefExpose | null>(null);

  const delNode = async (id: number) => {
    try {
      const cfg = await window.core.removeNode(id);
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
    restore,
    restoreLoading,
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
        <div className="flex">
          <Button
            type="link"
            className=""
            icon={<PlusOutlined />}
            onClick={() => addNode()}
          >
            新增节点
          </Button>
          <Button
            type="link"
            className=""
            icon={<UserOutlined />}
            onClick={() => helpModalRef?.current?.showModal()}
          >
            关于作者
          </Button>

        </div>
      )}
      bordered
    >
      <HelpModal ref={helpModalRef} />
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

          <div className="flex items-center">
            <Text strong className="mr-1">
              当前导出路径:
            </Text>
            {
              isEditOutput ? (
                <Space.Compact>
                  <Input allowClear onChange={(e) => tempOutputChange(e)} defaultValue={outputPath} />
                  <Button onClick={() => saveOutput()} type="primary">确定</Button>
                </Space.Compact>
              ) : (
                <Text
                  onDoubleClick={() => showEditOutputInput()}
                >
                  {outputPath ?? '双击设置导出路径'}
                </Text>
              )
            }

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
            <Space>
              <Button
                loading={isLoading}
                icon={<UploadOutlined />}
                onClick={() => backupTip()}
                type="primary"
              >
                {isLoading ? '备份中' : '备份'}
              </Button>
              <Button
                loading={restoreLoading}
                icon={<DownloadOutlined />}
                onClick={() => restore()}
                type="primary"
              >
                {restoreLoading ? '恢复中' : '恢复'}

              </Button>
            </Space>
          </div>

        </div>
        <BackupModal setSource={setData} ref={BackupModalRef} />
      </div>
    </Card>
  );
}
