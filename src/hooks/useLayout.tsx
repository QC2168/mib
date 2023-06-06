import { type MenuProps } from 'antd';
import { ReactNode, Key } from 'react';
import { InboxOutlined, FolderOpenOutlined, PieChartOutlined } from '@ant-design/icons';
import { ThemeType, useTheme } from '@/lib/css/theme';

type MenuItem = Required<MenuProps>['items'][number];
export default function useLayout() {
  const [themeConfig, mode, setMode] = useTheme();
  const changeTheme = () => {
    if (mode === ThemeType.DARK) {
      setMode(ThemeType.LIGHT);
    } else {
      setMode(ThemeType.DARK);
    }
  };

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
    getItem('文件管理', 'file', <FolderOpenOutlined />),
    getItem('文件分析', 'scan', <PieChartOutlined />),
  ];

  return {
    themeConfig,
    changeTheme,
    menuItems,
    mode,
  };
}
