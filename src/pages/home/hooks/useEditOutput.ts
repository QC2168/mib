import { useState } from 'react';
import { useMount } from 'ahooks';
import useMessage from '@/utils/message';
import { useTranslation } from 'react-i18next';

export default function useEditOutput() {
  const [isEditOutput, setIsEditOutput] = useState(false);
  const [tempOutput, setTempOutput] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const { createSuccessMessage, createErrorMessage } = useMessage();
  const { t } = useTranslation();
  const tempOutputChange = (event:any) => {
    setTempOutput(event.target!.value!);
  };
  const showEditOutputInput = () => {
    setIsEditOutput(true);
  };
  const saveOutput = async () => {
    try {
      const { output } = await window.core.editOutputPath(tempOutput);
      setOutputPath(output || t('home.setExportPath'));
      createSuccessMessage(t('home.exportPathSave'));
      setIsEditOutput(false);
    } catch (e) {
      createErrorMessage(t('home.exportPathSaveError'));
    }
  };
  useMount(async () => {
    const cfg = await window.core.instanceConfig();
    const path = cfg.output;
    setOutputPath(path || t('home.setExportPath'));
    setTempOutput(path || '');
  });
  return {
    outputPath,
    tempOutput,
    isEditOutput,
    showEditOutputInput,
    saveOutput,
    tempOutputChange,
  };
}
