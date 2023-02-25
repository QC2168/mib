import { ThemeType, useTheme } from '@/lib/css/theme';
import { MenuProps } from 'antd';
import { ReactNode, Key } from 'react';
import { InboxOutlined, FolderOpenOutlined } from '@ant-design/icons';

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
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const menuItems: MenuItem[] = [
    getItem('数据备份', 'home', <InboxOutlined />),
    getItem('文件管理', 'file', <FolderOpenOutlined />),
  ];

  return {
    themeConfig,
    changeTheme,
    menuItems,
    mode,
  };
}
