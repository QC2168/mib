import { useState } from 'react';
import type Mib from '@qc2168/mib';
import { useMount } from 'ahooks';

export default function useMib(): [Mib | null, (() => Promise<Mib>)] {
  const [i, setI] = useState<Mib | null>(null);
  const updateInstance = async () => {
    const instance = await window.core.instance();
    setI(instance);
    return instance;
  };
  useMount(() => {
    updateInstance();
  });
  return [i, updateInstance];
}
