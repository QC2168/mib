import {
  Breadcrumb,
  Button,
  Card,
  Empty,
  message,
  Radio,
  RadioChangeEvent,
  Space,
  Table,
} from 'antd';
import useConfig from '@/config/useConfig';
import useLocalFile from '@/pages/fileStore/hooks/useLocalFile';
import { useState } from 'react';
import classNames from 'classnames';
import { exec } from 'node:child_process';
import useDevices from '@/hooks/useDevices';
import { HomeOutlined, RollbackOutlined } from '@ant-design/icons';
import { DriverType } from './types';
import storeTableColumns from './storeTableColumns';
import useMobileFile from './hooks/useMobileFile';

export default function FileManage() {
  const [config] = useConfig();
  const [messageApi] = message.useMessage();
  const [devices] = useDevices();
  const [localPathCollection,
    setLocalPathCollection,
    localFileNodeList] = useLocalFile(config.output);
  const [mobilePathCollection, setMobilePathCollection,
    mobileFileNodeList] = useMobileFile(devices.current?.name);

  // 显示状态
  const [curDriType, setCurDriType] = useState<DriverType>(DriverType.LOCAL);

  // 返回上一级
  const turnBack = () => {
    if (curDriType === DriverType.LOCAL) {
      // 如果是最上一层，不处理
      if (localPathCollection.length === 1) {
        message.warning('当前位置处于根目录，无法再返回上一级了');
        return;
      }
      setLocalPathCollection((cPath) => cPath.slice(0, -1));
    }
    if (curDriType === DriverType.MOBILE) {
      // 如果是最上一层，不处理
      if (mobilePathCollection.length === 1) {
        message.warning('当前位置处于根目录，无法再返回上一级了');
        return;
      }
      setMobilePathCollection((cPath) => cPath.slice(0, -1));
    }
  };

  const radioChange = (e: RadioChangeEvent) => {
    console.log(`radio checked:${e.target.value}`);
    if (e.target.value === DriverType.LOCAL) {
      setCurDriType(DriverType.LOCAL);
    } else {
      setCurDriType(DriverType.MOBILE);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex justify-between">
        <Space className={classNames('mb-4')} size={16}>
          <Button onClick={() => turnBack()} title="返回上一级目录" type="primary" shape="circle" icon={<RollbackOutlined />} />
          <Breadcrumb>
            <Breadcrumb.Item>
              <HomeOutlined />
            </Breadcrumb.Item>
            {
            localPathCollection.slice(1).map((item) => (
              <Breadcrumb.Item>
                <span>{item}</span>
              </Breadcrumb.Item>
            ))
          }
          </Breadcrumb>
        </Space>
        <Radio.Group onChange={radioChange} defaultValue={curDriType}>
          <Radio.Button value={DriverType.LOCAL}>本地储存</Radio.Button>
          <Radio.Button value={DriverType.MOBILE}>移动设备</Radio.Button>
        </Radio.Group>
      </div>
      <Table
        columns={storeTableColumns}
        expandable={{ childrenColumnName: 'false' }}
        rowKey="fileName"
        onRow={({
          fileName,
          isDirectory,
        }) => ({
          onDoubleClick: () => {
            if (isDirectory) {
              if (curDriType === DriverType.LOCAL) {
                setLocalPathCollection([...localPathCollection, fileName]);
              }
              if (curDriType === DriverType.MOBILE) {
                setMobilePathCollection([...mobilePathCollection, fileName]);
              }
            } else {
              // 打开文件
              // 处理开头 // 盘符为 /
              const filePath = [localPathCollection[0].slice(0, -1), ...localPathCollection.slice(1), fileName].join('/');
              messageApi.info(`正在打开${fileName}`);
              exec(`start ${filePath}`, (error, stdout, stderr) => {
                if (error) {
                  messageApi.error(error.message);
                  return;
                }
                if (stderr) {
                  messageApi.error(stderr);
                }
              });
            }
          },
        })}
        locale={{
          emptyText: <Empty description="此文件夹为空" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
        }}
        pagination={false}
        scroll={{
          x: '100%',
          scrollToFirstRowOnChange: true,
          y: '340px',
        }}
        dataSource={curDriType === DriverType.LOCAL ? localFileNodeList : mobileFileNodeList}
      />

    </Card>

  );
}
