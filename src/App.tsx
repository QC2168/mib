/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { FileTextOutlined, RadarChartOutlined } from '@ant-design/icons';
import {
  Button, MenuProps, Typography,
  ConfigProvider, Layout, Menu, Space,
} from 'antd';

import { Route, Routes, useNavigate } from 'react-router-dom';
import Analysis from '@/pages/analysis';
import FileManage from '@/pages/fileStore';
import classNames from 'classnames';
import { ThemeType, useTheme } from './lib/css/theme';

const {
  Sider, Content,
} = Layout;
const { Title } = Typography;
const { ipcRenderer } = require('electron');

function App() {
  const navigate = useNavigate();
  const [themeConfig, mode, setMode] = useTheme();
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
    getItem('数据备份', 'analysis', <RadarChartOutlined />),
    getItem('文件管理', 'fileManage', <FileTextOutlined />),
  ];
  const [collapsed, setCollapsed] = useState(false);
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
    console.log('changeTheme');

    if (mode === ThemeType.DARK) {
      setMode(ThemeType.LIGHT);
    } else {
      setMode(ThemeType.DARK);
    }
  };
  return (
    <ConfigProvider theme={themeConfig}>
      <div>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} style={{ background: mode === ThemeType.DARK ? '#0a0a0a' : '' }} theme={mode === ThemeType.DARK ? 'dark' : 'light'} className="relative" onCollapse={(value) => setCollapsed(value)}>
            <Title level={collapsed ? 4 : 2} className={classNames('allow-drag cursor-pointer text-center transition-all', { 'pt-4': collapsed, 'pt-2 ': !collapsed })}>MIB</Title>

            <div className={classNames('w-full flex justify-center mt-2 mb-4', { '!hidden': collapsed })}>
              <Space>
                <Button
                  className={classNames({ 'i-carbon-moon text-white': mode === ThemeType.DARK }, {

                    'i-carbon-sun': mode === ThemeType.LIGHT,

                  })}
                  onClick={() => changeTheme()}
                />
                <Button
                  className={classNames('i-codicon:chrome-minimize', { 'text-white': mode === ThemeType.DARK })}
                  onClick={() => minimizeApp()}
                />
                <Button
                  className={classNames('i-fluent:full-screen-maximize-20-filled', { 'text-white': mode === ThemeType.DARK })}
                  onClick={() => maximizeApp()}
                />
                <Button
                  className={classNames('i-eva:close-fill', { 'text-white': mode === ThemeType.DARK })}
                  onClick={() => closeApp()}
                />
              </Space>

            </div>
            <Menu
              theme={mode === ThemeType.DARK ? 'dark' : 'light'}
              style={{ background: mode === ThemeType.DARK ? '#0a0a0a' : '' }}
              defaultSelectedKeys={['analysis']}
              onSelect={({ key }) => navigate(key)}
              mode="inline"
              items={items}
            />
          </Sider>
          <Layout>
            <Content style={{ padding: '12px', minHeight: 'calc( 100vh - 45px )' }}>
              <Routes>
                <Route index element={<Analysis />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/fileManage" element={<FileManage />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </div>
    </ConfigProvider>
  );
}

export default App;
