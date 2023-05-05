import {
  useState, Dispatch,
  SetStateAction,
} from 'react';
import Mib, { type SaveItemType } from '@qc2168/mib';
import { useMount } from 'ahooks';
import useMib from '@/pages/home/hooks/useMib';

export default function useDataSource(): [SaveItemType[], Dispatch<SetStateAction<SaveItemType[]>>] {
  const [, updateInstance] = useMib();
  const [data, setData] = useState<SaveItemType[]>([]);
  useMount(() => {
    setTimeout(async () => {
      const i = await updateInstance();
      console.log({ i });
      setData((i as Mib)?.config.backups);
    }, 0);
  });
  return [
    data,
    setData,
  ];
}
