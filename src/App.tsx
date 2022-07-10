import { useState } from 'react'
import FileManage from '@/pages/fileManage'
import {
  SettingOutlined,
  RadarChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Analysis from '@/pages/analysis';
import Settings from '@/pages/settings';
const { Header, Footer, Sider, Content } = Layout;
const App: React.FC = () => {
  let navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
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


  return (
    <Layout>
      <Header style={{ height: 50 }}>
        <div>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-guanbi"></use>
          </svg>
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
        <Content style={{ padding: '12px',minHeight:'100vh' }}>
            <Routes>
              <Route path='/' element={<Analysis />} />
              <Route path='/analysis' element={<Analysis />} />
                <Route path='/fileManage' element={<FileManage />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
