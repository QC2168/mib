import { ControlOptionType } from '@/components/control';
import { DriverType } from '@/types';

export default [
  {
    label: '打开',
    show: [DriverType.LOCAL, DriverType.MOBILE],
    key: 'open',
  },
  {
    label: '添加到备份节点',
    show: [DriverType.MOBILE],
    key: 'addBackNodeList',
  },
  {
    label: '添加到忽略名单',
    show: [DriverType.LOCAL],
    key: 'addIgnoreList',
  },
  {
    label: '刷新',
    show: [DriverType.LOCAL, DriverType.MOBILE],
    key: 'reload',
  },
  {
    label: '重命名',
    show: [DriverType.LOCAL, DriverType.MOBILE],
    key: 'rename',
  },
] as ControlOptionType[];
