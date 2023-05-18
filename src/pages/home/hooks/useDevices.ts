import { useState } from 'react';
import { useMount } from 'ahooks';
import { type DevicesType } from '@qc2168/mib';
import useMessage from '@/utils/message';

export default function useDevices() {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const [currentDevices, setCurrentDevices] = useState<string | null>(null);
  const { createErrorMessage } = useMessage();
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
  useMount(() => {
    // 监听设备接入
    window.core.attachDevice(() => {
      updateDevices();
    });
    // 监听设备移除
    window.core.detachDevice(() => {
      updateDevices();
    });
  });
  const check = () => currentDevices !== null;
  useMount(() => {
    updateDevices();
  });
  return {
    devices, handleDevice, currentDevices, updateDevices, check,
  };
}
