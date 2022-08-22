import { useSetState, useMount } from 'ahooks';
import { SetState } from 'ahooks/lib/useSetState';
import { usb } from 'usb';
import { debounce } from 'lodash-es';

const { execSync } = require('child_process');

export enum DeviceStatus{
  DEVICE='device',
  UNAUTHORIZED= 'unauthorized'
}

export interface DevicesType {
  name: string;
  status: DeviceStatus;
}

// 设备
export interface DevicesStatusType{
  current:DevicesType|null
  devicesList:DevicesType[]
}

// 获取设备
export const getDevices = (): DevicesType[] => {
  const res = execSync('adb devices').toString();
  const arr = res
    .split(/\n/)
    .map((line: string) => line.split('\t'))
    .filter((line: string | any[]) => line.length > 1)
    .map((device: { trim: () => DeviceStatus; }[]) => ({ name: device[0].trim(), status: device[1].trim() as DeviceStatus }));

  return arr;
};

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
    usb.on('attach', debounce((device) => {
      init();
    }));
    usb.on('detach', debounce((device) => {
      init();
    }));
  });
  return [devices, setDevices, isConnect];
}
