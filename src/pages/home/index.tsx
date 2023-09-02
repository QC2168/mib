import {
  Button, Card, Empty, Select, Table, Input,
  Typography, Space, Tour, type TourProps,
} from 'antd';
import {
  UploadOutlined, PlusOutlined, DownloadOutlined,
} from '@ant-design/icons';
import BackupModal, { BackupModalRef as BackupModalRefExpose, MODAL_STATUS } from '@/pages/home/components/BackupModal';
import { useRef } from 'react';
import { useLocalStorageState } from 'ahooks';
import useMessage from '@/utils/message';
import useDataSource from '@/pages/home/hooks/useDataSource';
import useEditOutput from '@/pages/home/hooks/useEditOutput';
import useBackup from './hooks/useBackup';

const { Text } = Typography;
const { Option } = Select;

export default function Analysis() {
  const { createErrorMessage } = useMessage();
  const [data, setData] = useDataSource();
  const [openTour, setOpenTour] = useLocalStorageState<boolean>(
    'tour',
    {
      defaultValue: true,
    },
  );
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
    backupLoading,
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
    if (openTour) return;
    BackupModalRef.current?.open(MODAL_STATUS.ADD);
  };

  const addNodeRef = useRef<HTMLDivElement|null>(null);
  const tableRef = useRef<HTMLDivElement|null>(null);
  const backupBtnRef = useRef<HTMLDivElement|null>(null);
  const restoreBtnRef = useRef<HTMLDivElement|null>(null);
  const outputPathRef = useRef<HTMLDivElement|null>(null);
  const chooseDeviceRef = useRef<HTMLDivElement|null>(null);
  const steps: TourProps['steps'] = [
    {
      title: '备份节点',
      description: '这里是所有备份节点的列表',
      target: () => tableRef.current as HTMLDivElement,
    },
    {
      title: '添加节点',
      description: '点击这里，往列表添加备份节点，并根据实际需求，填写节点信息并添加',
      target: () => addNodeRef.current as HTMLDivElement,
    },
    {
      title: '导出路径',
      description: '设置一个根部导出路径，备份的文件都会被放到这里',
      target: () => outputPathRef.current as HTMLDivElement,
    },
    {
      title: '选择设备',
      description: '选择需要备份的数据（接入设备时，程序会自动选择）',
      target: () => chooseDeviceRef.current as HTMLDivElement,
    },
    {
      title: '备份数据',
      description: '点击这里会根据您配置的节点进行备份',
      target: () => backupBtnRef.current as HTMLDivElement,
    },
    {
      title: '恢复数据',
      description: '将已备份过的数据文件，原封不动的移动到设备中',
      target: () => restoreBtnRef.current as HTMLDivElement,
    },
  ];

  return (
    <Card
      title="备份节点"
      extra={(
        <div className="flex">
          <Button
            ref={addNodeRef}
            type="link"
            className=""
            icon={<PlusOutlined />}
            onClick={() => addNode()}
          >
            新增节点
          </Button>
        </div>
      )}
      bordered
    >
      <div>
        {/* 节点 */}
        <Table
          ref={tableRef}
          rowSelection={rowSelection}
          locale={{ emptyText: <Empty description="暂无节点数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
          scroll={{
            x: '100%',
            scrollToFirstRowOnChange: true,
            y: 280,
          }}
          pagination={false}
          rowKey="id"
          columns={backupNodeColumns}
          dataSource={data || []}
        />
        <div className="mt-8 flex justify-between items-center">

          <div className="flex items-center" ref={outputPathRef}>
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
            <span ref={chooseDeviceRef}>
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
            </span>

            <Space>
              <Button
                ref={backupBtnRef}
                loading={backupLoading}
                icon={<UploadOutlined />}
                onClick={() => backupTip()}
                type="primary"
              >
                {backupLoading ? '备份中' : '备份'}
              </Button>
              <Button
                ref={restoreBtnRef}
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
      <Tour open={openTour} steps={steps} onClose={() => setOpenTour(false)} />
    </Card>
  );
}
