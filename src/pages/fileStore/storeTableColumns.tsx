import { FileNodeType } from '@/types';
import { readablizeBytes } from '@/utils';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';

export default [
  {
    title: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
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
    render: (time) => <span>{dayjs(time).format('YYYY-MM-DD hh:mm:ss')}</span>,
  },

] as ColumnsType<FileNodeType>;
