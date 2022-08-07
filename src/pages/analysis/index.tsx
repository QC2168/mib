import {
  Button, Card, Modal, Space, Tag,
} from 'antd';
import {
  useEffect, useRef, useState, Key,
} from 'react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import * as d3 from 'd3';
import Table, { ColumnsType } from 'antd/lib/table';
import { getConfig } from '@/config';
import {
  diff, execAdb, getFileNodeList, isPath, log, openNotification, pathRepair, speedReg,
} from '@/utils';
import {
  BackItemType, ConfigType, DriverType, FileNodeType,
} from '@/types';
import styles from './index.module.less';

const { confirm } = Modal;

echarts.use([
  TooltipComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  LabelLayout,
]);

// 图标实例
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
        <Button type="link">单独备份</Button>
        <Button type="link">删除节点</Button>
      </Space>
    ),
  },
];
export default function Analysis() {
  const testPath = '/sdcard/DCIM/Camera/';
  // const test_path = '/sdcard/MIUI/sound_recorder/app_rec/'
  // 文件列表
  const [fileNodeList, setFileNodeList] = useState<FileNodeType[]>([]);
  // 备份状态
  const [backing, setBacking] = useState<boolean>(false);
  // 备份目录
  const [config, setConfig] = useState<ConfigType>(getConfig());
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  useEffect(() => {
    // 备份节点更改
    console.log(selectedRowKeys);
  }, [selectedRowKeys]);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  function move(backupQueue: FileNodeType[], outputDir: string): void {
    if (backupQueue.length === 0) {
      log('无需备份');
      return;
    }
    backupQueue.forEach((fileN) => {
      log(`正在备份${fileN.fileName}`);
      try {
        const out: string = execAdb(
          `pull "${fileN.filePath}" "${outputDir + fileN.fileName}"`,
        );
        const speed: string | null = out.match(speedReg) !== null ? out.match(speedReg)![0] : '读取速度失败';
        log(`平均传输速度${speed}`);
      } catch (e: any) {
        log(`备份${fileN.fileName}失败 error:${e.message}`, 'error');
      }
    });
  }

  function backup() {
    setBacking(true);
    // 确定是否备份
    // confirm({
    //   title: '',
    //   icon: <ExclamationCircleOutlined />,
    //   content: '备份可能需要一小段时间，确定么？',
    //   onOk() {
    //     console.log('OK');
    //   },
    //   onCancel() {
    //     console.log('Cancel');
    //   },
    // });
    // 判断是否有选择的节点
    console.log('备份节点', selectedRowKeys);
    // 备份选择的节点
    // 获取节点完整信息
    const curBackupNode = config.backups.filter((item) => selectedRowKeys.includes(item.comment));
    const outputRootDir = config.output;
    // 判断根路径
    isPath(outputRootDir);
    curBackupNode.forEach((item) => {
      // 依次读取对比
      // 获取指定目录下的文件、文件夹列表
      const waitBackupFileList: FileNodeType[] = [];
      const dirPath = item.path;
      const dirList = execAdb(`shell ls -l ${dirPath}`).toString().split('\r\n').filter((i) => i !== '');
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
      const itemRootPath = pathRepair(pathRepair(config.output) + folderName);
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
      move(diffList, outputDir);
    });

    // 完成弹窗
    openNotification('提示', '备份完成');
    // 全部备份
    setBacking(false);
  }
  const hasSelected = selectedRowKeys.length > 0;
  function tableFooter() {
    return (
      <div>
        {hasSelected ? (
          <div>
            <Space>
              当前已选择
              {' '}
              {selectedRowKeys.length}
              {' '}
              个节点
              <Button onClick={() => setSelectedRowKeys([])}>全部取消选择</Button>
            </Space>
          </div>
        ) : ''}
      </div>

    );
  }

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card>
          {/* 节点 */}
          <Table rowSelection={rowSelection} footer={selectedRowKeys.length !== 0 ? tableFooter : undefined} scroll={{ x: '100%', scrollToFirstRowOnChange: true, y: '300px' }} pagination={false} rowKey="comment" columns={backupNodeColumns} dataSource={config.backups} />
          {/* 图表 */}
          {/* <div className={styles.chartContain} ref={chartRef}>

          </div> */}
        </Card>
        <Card>
          <Space size="middle">
            <Button loading={backing} onClick={() => backup()} type="primary">极速备份数据</Button>
            <Button>取消</Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
