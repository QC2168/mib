import { createErrorMessage } from '@/utils/message';
import { useState } from 'react';
import { useMount } from 'ahooks';
import { type DevicesType } from '@qc2168/mib';

export default function useDevices() {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const [currentDevices, setCurrentDevices] = useState<string | null>(null);
  const updateDevices = async () => {
    try {
      const result = await window.core.devices();
      setDevices(result);
    } catch {
      createErrorMessage('获取设备列表失败');
    }
  };
  const handleDevice = async (id: string) => {
    try {
      await window.core.setDevice(id);
      setCurrentDevices(id);
    } catch (error) {
      createErrorMessage('切换设备失败');
    }
  };

  const check = () => currentDevices !== null;
  useMount(() => {
    updateDevices();
  });
  return {
    devices, handleDevice, currentDevices, updateDevices, check,
  };
}
