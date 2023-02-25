import { createErrorMessage } from '@/utils/message';
import { useState } from 'react';
import { useMount } from 'ahooks';
import { type DevicesType } from '@qc2168/mib';

export default function useDevices() {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const [currentDevices, setCurrentDevices] = useState<string>('未连接');
  const updateDevices = async () => {
    const result = await window.core.devices();
    setDevices(result);
  };
  const handleDevice = async (id:string) => {
    try {
      await window.core.setDevice(id);
      setCurrentDevices(id);
    } catch (error) {
      createErrorMessage('切换设备失败');
    }
  };
  useMount(() => {
    updateDevices();
  });
  return { devices, handleDevice, currentDevices };
}
