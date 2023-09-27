import { useState } from 'react';
import { useMount } from 'ahooks';
import { type DevicesType } from '@qc2168/mib';
import useMessage from '@/utils/message';
import { useTranslation } from 'react-i18next';

export default function useDevices() {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const [currentDevices, setCurrentDevices] = useState<string | null>(null);
  const { createErrorMessage } = useMessage();
  const { t } = useTranslation();
  const handleDevice = async (id: string) => {
    try {
      await window.core.setDevice(id);
      setCurrentDevices(id);
    } catch (error) {
      createErrorMessage(t('devices.handoverFailure'));
    }
  };
  const updateDevices = async () => {
    try {
      const result = await window.core.devices();
      await setDevices(result);
      //   如果存在设备，选择第一个
      if (result.length > 0) {
        await handleDevice(result[0].name);
      }
    } catch {
      createErrorMessage(t('devices.listFailed'));
    }
  };
  const checkCurrentDevice = async () => {
    const device = await window.core.getDevice();
    setCurrentDevices(device);
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
  useMount(async () => {
    // 获取数据
    await updateDevices();
    // 请求当前连接的设备
    await checkCurrentDevice();
  });
  return {
    devices, handleDevice, currentDevices, updateDevices, check,
  };
}
