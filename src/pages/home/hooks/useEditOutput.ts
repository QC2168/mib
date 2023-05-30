import { useState } from 'react';
import useMib from '@/pages/home/hooks/useMib';
import { useMount } from 'ahooks';
import useMessage from '@/utils/message';

export default function useEditOutput() {
  const [isEditOutput, setIsEditOutput] = useState(false);
  const [tempOutput, setTempOutput] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [i, u] = useMib();
  const { createSuccessMessage, createErrorMessage } = useMessage();
  const tempOutputChange = (event:any) => {
    setTempOutput(event.target!.value!);
  };
  const showEditOutputInput = () => {
    setIsEditOutput(true);
    setOutputPath(outputPath);
  };
  const saveOutput = async () => {
    try {
      const { output } = await window.core.editOutputPath(tempOutput);
      setOutputPath(output || '双击设定导出路径');
      createSuccessMessage('保存成功');
      setIsEditOutput(false);
    } catch (e) {
      createErrorMessage('保存失败');
    }
  };
  useMount(async () => {
    const i = await u();
    const path = i?.config.output;
    setOutputPath(path || '双击设定导出路径');
  });
  return {
    outputPath,
    isEditOutput,
    showEditOutputInput,
    saveOutput,
    tempOutputChange,
  };
}
