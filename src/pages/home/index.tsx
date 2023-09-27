import {
  Button, Card, Empty, Select, Table, Input,
  Typography, Space, Tour, type TourProps,
} from 'antd';
import {
  UploadOutlined, PlusOutlined, DownloadOutlined,
} from '@ant-design/icons';
import BackupModal, { BackupModalRef as BackupModalRefExpose, MODAL_STATUS } from '@/pages/home/components/BackupModal';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorageState, useSize } from 'ahooks';
import useMessage from '@/utils/message';
import useDataSource from '@/pages/home/hooks/useDataSource';
import useEditOutput from '@/pages/home/hooks/useEditOutput';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      title: t('tour.backupNode'),
      description: t('tour.backupNodeDesc'),
      target: () => tableRef.current as HTMLDivElement,
    },
    {
      title: t('tour.addNode'),
      description: t('tour.addNodeDesc'),
      target: () => addNodeRef.current as HTMLDivElement,
    },
    {
      title: t('tour.exportPath'),
      description: t('tour.exportPathDesc'),
      target: () => outputPathRef.current as HTMLDivElement,
    },
    {
      title: t('tour.selectDevice'),
      description: t('tour.selectDeviceDesc'),
      target: () => chooseDeviceRef.current as HTMLDivElement,
    },
    {
      title: t('tour.backupData'),
      description: t('tour.backupDataDesc'),
      target: () => backupBtnRef.current as HTMLDivElement,
    },
    {
      title: t('tour.restoreData'),
      description: t('tour.restoreDataDesc'),
      target: () => restoreBtnRef.current as HTMLDivElement,
    },
  ];
  const cardBodyRef = useRef<HTMLDivElement|null>(null);
  // 监听窗口变动
  // 动态改变表格高度
  const tableSize = useSize(cardBodyRef);
  const [tableHeight, setTableHeight] = useState(290);
  useEffect(() => {
    if (!tableSize?.height) return;
    setTableHeight(tableSize.height - 210);
  }, [tableSize]);
  return (
    <Card
      className="h-full"
      title={t('home.title')}
      ref={cardBodyRef}
      extra={(
        <div className="flex">
          <Button
            ref={addNodeRef}
            type="link"
            className=""
            icon={<PlusOutlined />}
            onClick={() => addNode()}
          >
            {t('home.addNode')}
          </Button>
        </div>
      )}
      bordered
    >
      <div className="h-full">
        {/* 节点 */}
        <Table
          ref={tableRef}
          rowSelection={rowSelection}
          locale={{ emptyText: <Empty description={t('home.table.empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
          scroll={{
            x: '100%',
            scrollToFirstRowOnChange: true,
            y: tableHeight,
          }}
          pagination={false}
          rowKey="id"
          columns={backupNodeColumns}
          dataSource={data || []}
        />
        <div className="mt-8 flex justify-between items-center">

          <div className="flex items-center" ref={outputPathRef}>
            <Text strong className="mr-1">
              {t('home.output')}
              :
            </Text>
            {
              isEditOutput ? (
                <Space.Compact>
                  <Input allowClear onChange={(e) => tempOutputChange(e)} defaultValue={outputPath} />
                  <Button onClick={() => saveOutput()} type="primary">{t('home.exportPathConfirm')}</Button>
                </Space.Compact>
              ) : (
                <Text
                  onDoubleClick={() => showEditOutputInput()}
                >
                  {outputPath ?? t('home.setExportPath')}
                </Text>
              )
            }
          </div>
          <div>
            <span ref={chooseDeviceRef}>
              <Select
                className="mr-3"
                defaultValue={t('home.selectDevices')}
                value={currentDevices || t('home.selectDevices')}
                style={{ width: 160 }}
                onChange={handleDevice}
                notFoundContent={<div>{t('home.noDevices')}</div>}
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
                {backupLoading ? t('home.backingUp') : t('home.backup')}
              </Button>
              <Button
                ref={restoreBtnRef}
                loading={restoreLoading}
                icon={<DownloadOutlined />}
                onClick={() => restore()}
                type="primary"
              >
                {restoreLoading ? t('home.restoring') : t('home.restore')}

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
