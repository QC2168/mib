import {
  useState, Dispatch,
  SetStateAction,
} from 'react';
import { type SaveItemType } from '@qc2168/mib';
import { useMount } from 'ahooks';

export default function useDataSource(): [SaveItemType[], Dispatch<SetStateAction<SaveItemType[]>>] {
  const [data, setData] = useState<SaveItemType[]>([]);
  useMount(() => {
    setTimeout(async () => {
      const cfg = await window.core.instanceConfig();
      setData(cfg.backups);
    }, 0);
  });
  return [
    data,
    setData,
  ];
}
