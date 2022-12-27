import { useMount, useSetState } from 'ahooks';
import { SetState } from 'ahooks/lib/useSetState';
import { debounce } from 'lodash-es';
import type { DevicesType } from '@qc2168/mib';

const { usb } = require('usb');
const { devices: getAdbDevices } = require('@qc2168/mib');

export enum DeviceStatus{
  DEVICE='device',
  UNAUTHORIZED= 'unauthorized'
}

// 设备
export interface DevicesStatusType{
  current:DevicesType|null
  devicesList:DevicesType[]
}

// 获取设备
export const getDevices = (): DevicesType[] => getAdbDevices();

// 默认数据
const defaultDevices:DevicesStatusType = {
  current: null,
  devicesList: [],
};

export default function useDevices():[DevicesStatusType, SetState<DevicesStatusType>, ()=>boolean] {
  const [devices, setDevices] = useSetState<DevicesStatusType>(defaultDevices);
  const isConnect = () => !!devices.current?.name;

  // 初始化
  const init = () => {
    // 获取设备
    const devicesList = getDevices();
    let current:DevicesType|null = null;
    // 有设备且活跃，将第一个设备设置为当前设备
    if (devicesList.length > 0 && devicesList[0] && devicesList[0].status === DeviceStatus.DEVICE) {
      current = devicesList.at(0)!;
    }
    setDevices({
      current,
      devicesList,
    });
  };

  useMount(() => {
    init();
    // 注册监听事件
    usb.on('attach', debounce(() => {
      init();
    }));
    usb.on('detach', debounce(() => {
      init();
    }));
  });
  return [devices, setDevices, isConnect];
}
