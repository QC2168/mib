import { BackItemType, ConfigType, DriverType, FileNodeType } from "@/types";
import { createFileNodeWithADB, diff, execAdb, getFileNodeList, getFileSize, isPath, log, openNotification, pathRepair, speedReg } from "@/utils"
import ignoreFileList from "@/utils/ignoreFileList";
import { useMount } from "ahooks";
import { Button, Card, Modal, Space, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import styles from './index.module.less'
import * as d3 from "d3";
import Table, { ColumnsType } from "antd/lib/table";
const { confirm } = Modal;
import { getConfig } from "@/config"
import { ExclamationCircleOutlined } from "@ant-design/icons";

echarts.use([
  TooltipComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  LabelLayout
]);
type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | LegendComponentOption | BarSeriesOption
>;

// 图标实例
let Chart
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
        <a>单独备份</a>
        <a>删除节点</a>
      </Space>
    )
  },
];
export default () => {
  const test_path = '/sdcard/DCIM/Camera/'
  // const test_path = '/sdcard/MIUI/sound_recorder/app_rec/'
  // 文件列表
  const [fileNodeList, setFileNodeList] = useState<FileNodeType[]>([])
  // 备份状态
  const [backing, setBacking] = useState<boolean>(false)
  // 备份目录
  const [config, setConfig] = useState<ConfigType>(getConfig())
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const chartRef = useRef<HTMLDivElement | null>(null)
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  useEffect(() => {
    // 备份节点更改
    console.log(selectedRowKeys)
  }, [selectedRowKeys])
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // useMount(() => {
  //   // readDir(test_path)
  //   var svg = d3.select(chartRef.current)
  //     .append("svg")
  //     .attr("width", 300)
  //     .attr("height", 120);
  //   let contain = svg
  //     .append("rect")
  //     .attr("width", 300)
  //     .attr("height", 50)
  //     .attr("stroke", 'white')
  //     .attr("fill", '#eee')
  //     .attr("rx", 5)
  //     .attr("yx", 5)
  //   var imgRect = svg.append("rect")
  //     .attr("id", 'img')

  //     .attr("x", 0)
  //     .attr("y", 0)
  //     .attr("width", 50)
  //     .attr("height", 50)
  //     .attr("rx", 2)
  //     .attr("yx", 2)
  //     .attr("fill", "red")
  //   var videoRect = svg.append("rect")  //添加一个矩形
  //     .attr("id", 'video')
  //     .attr("x", 120)
  //     .attr("y", 0)
  //     .attr("width", 50)
  //     .attr("height", 50)
  //     .attr("rx", 2)
  //     .attr("yx", 2)
  //     .attr("fill", "blue")
  // })
  function move(backupQueue: FileNodeType[], outputDir: string): void {
    if (backupQueue.length === 0) {
      log("无需备份");
      return;
    }
    for (const fileN of backupQueue) {
      log(`正在备份${fileN.fileName}`);
      try {
        const out: string = execAdb(
          `pull "${fileN.filePath}" "${outputDir + fileN.fileName}"`,
        );
        const speed: string | null = out.match(speedReg) !== null ? out.match(speedReg)![0] : "读取速度失败";
        log(`平均传输速度${speed}`);
      } catch (e: any) {
        log(`备份${fileN.fileName}失败 error:${e.message}`, "error");
      }
    }
  };

  function backup() {
    setBacking(true)
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
    console.log('备份节点', selectedRowKeys)
    // 备份选择的节点
    // 获取节点完整信息
    let curBackupNode = config.backups.filter(item => selectedRowKeys.includes(item.comment))
    let outputRootDir = config.output
    // 判断根路径
    isPath(outputRootDir);
    for (const item of curBackupNode) {
      // 依次读取对比
      // 获取指定目录下的文件、文件夹列表
      let waitBackupFileList: FileNodeType[] = []
      let dirPath = item.path
      let dirList = execAdb(`shell ls -l ${dirPath}`).toString().split("\r\n").filter(i => i !== '');
      // 去掉total
      dirList.shift()
      dirList.forEach((i) => {
        const item: string[] = i.split(/\s+/);
        const fileName = item.slice(7).join(" ");
        const fileNode: FileNodeType = {
          fileName,
          fileSize: Number(item[4]) ?? 0,
          filePath: pathRepair(dirPath) + fileName,
          isDirectory: item[0].startsWith("d"),
          fileMTime: item.slice(5, 7).join(' ')
        }
        waitBackupFileList.push(fileNode)
      });
      // 判断导出路径是否存在
      const folderName = item.path.split("/").filter((i: string) => i !== "").at(-1);

      // 判断节点内是否有备份目录  // 拼接导出路径
      const itemRootPath = pathRepair(pathRepair(config.output) + folderName);
      const outputDir = item.output
        ? item.output && pathRepair(item.output)
        : itemRootPath;
      isPath(outputDir)
      // 获取当前目录下的文件
      // 获取当前存储空间
      const localFileNodeList = getFileNodeList(outputDir, DriverType.LOCAL)
      // 对比文件

      const diffList: FileNodeType[] = diff(localFileNodeList, waitBackupFileList);
      console.log(localFileNodeList)
      console.log(waitBackupFileList)
      console.log('diffList', diffList)
      // 备份
      move(diffList, outputDir)
    }


    // 完成弹窗
    openNotification('提示', '备份完成')
    // 全部备份
    setBacking(false)
  }
  const hasSelected = selectedRowKeys.length > 0;
  function tableFooter() {
    return (
      <div >
        {hasSelected ? <div>
          <Space>
          当前已选择 {selectedRowKeys.length} 个节点
          <Button onClick={()=>setSelectedRowKeys([])}>全部取消选择</Button>
          </Space>
        </div> : ''}
      </div>

    )
  }


  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card>
          {/* 节点 */}
          <Table rowSelection={rowSelection} footer={selectedRowKeys.length!==0?tableFooter:undefined} scroll={{ x: '100%', scrollToFirstRowOnChange: true, y: '300px' }} pagination={false} rowKey='comment' columns={backupNodeColumns} dataSource={config.backups} />
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
  )
}
