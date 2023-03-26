import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { FileNodeType } from '@qc2168/mib/dist/types';
import { readablizeBytes } from '@/utils';
import styles from '@/pages/file/index.module.less';

export default [
  {
    title: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
    width: 270,
    render: (fileName: string) => (
      <div title={fileName} className={styles.tableFileName}>
        {fileName}
      </div>
    ),
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    key: 'fileSize',
    render: (val) => readablizeBytes(val),
    sorter: (a, b) => a.fileSize - b.fileSize,
  },
  {
    title: '修改时间',
    dataIndex: 'fileMTime',
    key: 'fileMTime',
    render: (time:string) => <span>{dayjs(time).format('YYYY-MM-DD hh:mm:ss')}</span>,
  },

] as ColumnsType<FileNodeType>;
