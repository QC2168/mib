import { type MenuProps } from 'antd';
import { ReactNode, Key } from 'react';
import { InboxOutlined, SettingOutlined, PieChartOutlined } from '@ant-design/icons';
import { useTheme } from '@/lib/css/theme';

type MenuItem = Required<MenuProps>['items'][number];
export default function useLayout() {
  const [themeConfig] = useTheme();

  function getItem(
    label: ReactNode,
    key: Key,
    icon?: ReactNode,
  ): MenuItem {
    return {
      key,
      icon,
      label,
    };
  }

  const menuItems: MenuProps['items'] = [
    getItem('数据备份', 'home', <InboxOutlined />),
    getItem('文件分析', 'scan', <PieChartOutlined />),
    getItem('设置', 'settings', <SettingOutlined />),
  ];

  return {
    themeConfig,
    menuItems,
  };
}
