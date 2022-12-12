import { useState } from 'react';
import {
  Card, Empty, message, Table,
} from 'antd';
import { exec } from 'child_process';
import { openNotification } from '@/utils';
import { DriverType } from '@/types';
import useConfig from '@/config/useConfig';
import useLocalFile from './hooks/useLocalFile';
import storeTableColumns from './storeTableColumns';
import useMobileFile from './hooks/useMobileFile';
import StorePath from './components/StorePath';

export default function FileManage() {
  const [config] = useConfig();
  const [localPathCollection,
    setLocalPathCollection,
    localFileNodeList,
    setLocalFileNodeList,
    loading] = useLocalFile(config.output);
  const [mobilePathCollection, setMobilePathCollection,
    mobileFileNodeList, setMobileFileNodeList] = useMobileFile();

  // 搜索框
  const [searchVal, setSearchVal] = useState<string>('');

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

  const search = (val: string) => {
    setSearchVal(val);
    if (val.trim() === '') {
      return;
    }
    if (curDriType === DriverType.LOCAL) {
      const filterList = localFileNodeList.filter((item) => item.fileName.includes(val));
      setLocalFileNodeList(filterList);
    }
    if (curDriType === DriverType.MOBILE) {
      const filterList = mobileFileNodeList.filter((item) => item.fileName.includes(val));
      setMobileFileNodeList(filterList);
    }
  };
  const reload = () => {
    search(searchVal);
  };
  // 切换状态
  const handleDriverStatus = (targetStatus: DriverType) => {
    setCurDriType(targetStatus);
  };

  return (
    <Card className="overflow-hidden">
      <StorePath
        {...{
          curDriType,
          localPathCollection,
          mobilePathCollection,
          turnBack,
          reload,
          searchVal,
          search,
          handleDriverStatus,
        }}
      />
      <Table
        columns={storeTableColumns}
        onRow={({ fileName, isDirectory }) => ({
          onDoubleClick: () => {
            if (isDirectory) {
              if (curDriType === DriverType.LOCAL) {
                setLocalPathCollection((paths) => [...paths, fileName]);
              }
              if (curDriType === DriverType.MOBILE) {
                setMobilePathCollection((paths) => [...paths, fileName]);
              }
            } else {
              // 打开文件
              // 处理开头 // 盘符为 /
              const filePath = [localPathCollection[0].slice(0, -1), ...localPathCollection.slice(1), fileName].join('/');

              exec(`start ${filePath}`, (error, stdout, stderr) => {
                if (error) {
                  openNotification('error', error.message);
                  return;
                }
                if (stderr) {
                  openNotification('error', stderr);
                }
              });
            }
          },
        })}
        rowKey="fileName"
        loading={loading}
        locale={{
          emptyText: <Empty description="此文件夹为空" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
        }}
        pagination={false}
        scroll={{ x: '100%', scrollToFirstRowOnChange: true, y: '380px' }}
        dataSource={curDriType === DriverType.LOCAL ? localFileNodeList : mobileFileNodeList}
      />

    </Card>

  );
}
