import {
  ConfigProvider, Layout, Menu,
} from 'antd';
import zhCN from 'antd/locale/zh_CN';

import {
  Route, Routes, useNavigate, useLocation,
} from 'react-router-dom';
import Scan from '@/pages/scan';
import Home from './pages/home';
import Settings from './pages/settings';
import useLayout from './hooks/useLayout';

const {
  Content,
} = Layout;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    themeConfig,
    menuItems,
  } = useLayout();

  return (
    <ConfigProvider theme={themeConfig} locale={zhCN}>
      <div>
        <Layout className="h-screen">
          <Menu
            className="fixed w-screen z-10"
            onSelect={({ key }) => navigate(key)}
            defaultSelectedKeys={['home']}
            selectedKeys={[location.pathname.substring(1)]}
            mode="horizontal"
            items={menuItems}
          />
          <Content className="p-2 pt-14">
            <Routes>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/scan" element={<Scan />} />
              <Route
                path="/settings"
                element={<Settings />}
              />
            </Routes>
          </Content>
        </Layout>
      </div>
    </ConfigProvider>
  );
}

export default App;
