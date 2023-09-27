import { type MenuProps } from 'antd';
import { ReactNode, Key } from 'react';
import { InboxOutlined, SettingOutlined, PieChartOutlined } from '@ant-design/icons';
import { useTheme } from '@/lib/css/theme';
import { useTranslation } from 'react-i18next';

type MenuItem = Required<MenuProps>['items'][number];
export default function useLayout() {
  const [themeConfig] = useTheme();
  const { t } = useTranslation();

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
    getItem(t('menu.home'), 'home', <InboxOutlined />),
    getItem(t('menu.fileAnalysis'), 'scan', <PieChartOutlined />),
    getItem(t('menu.settings'), 'settings', <SettingOutlined />),
  ];

  return {
    themeConfig,
    menuItems,
  };
}
