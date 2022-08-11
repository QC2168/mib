/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import {
  SettingOutlined,
  RadarChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  Route, Routes, useNavigate,
} from 'react-router-dom';
import classNames from 'classnames';
import Analysis from '@/pages/analysis';
import Settings from '@/pages/settings';
import FileManage from '@/pages/fileStore';
import { loadTheme, ThemeType } from '@/lib/css/theme';
import styles from './App.module.less';

const {
  Header, Footer, Sider, Content,
} = Layout;
const { ipcRenderer } = require('electron');

function App() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  type MenuItem = Required<MenuProps>['items'][number];
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
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

  const items: MenuItem[] = [
    getItem('状态', 'analysis', <RadarChartOutlined />),
    getItem('文件管理', 'fileManage', <FileTextOutlined />),
    getItem('设置', 'settings', <SettingOutlined />),
  ];

  const closeApp = () => {
    ipcRenderer.invoke('close-win');
  };
  const minimizeApp = () => {
    ipcRenderer.invoke('minimize-win');
  };
  const maximizeApp = () => {
    ipcRenderer.invoke('maximize-win');
  };
  const changeTheme = () => {
    if (Array.from(document.documentElement.classList).includes('dark')) {
      loadTheme(ThemeType.LIGHT);
      navigate(0);
    } else {
      loadTheme(ThemeType.DARK);
    }
  };
  return (
    <Layout>
      <Header style={{ height: 45 }} className={classNames('flex justify-between items-center text-white', styles['ant-layout-header'])}>
        <div className="text-xl text-black dark:text-white font-bold">
          MIB
        </div>
        <div>
          <Space size="middle" className="text-md">
            <button className="opBtn dark:text-white i-carbon-sun dark:i-carbon-moon" onClick={() => changeTheme()} />
            <button className="opBtn dark:text-white i-codicon:chrome-minimize" onClick={() => minimizeApp()} />
            <button className="opBtn dark:text-white i-fluent:full-screen-maximize-20-filled" onClick={() => maximizeApp()} />
            <button className="opBtn dark:text-white i-eva:close-fill" onClick={() => closeApp()} />
          </Space>
        </div>
      </Header>
      <Layout>
        <Sider collapsed={collapsed}>
          <div>
            <Menu
              onSelect={({ key }) => navigate(key)}
              mode="inline"
              items={items}
            />
          </div>
        </Sider>
        <Content style={{ padding: '12px', minHeight: 'calc( 100vh - 50px )' }}>
          <Routes>
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/fileManage" element={<FileManage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
