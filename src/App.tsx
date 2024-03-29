import {
  ConfigProvider, Layout, Menu,
} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import zhEN from 'antd/locale/en_US';

import {
  Route, Routes, useNavigate,
} from 'react-router-dom';
import Scan from '@/pages/scan';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Local } from '@/utils/storage';
import Home from './pages/home';
import Settings from './pages/settings';
import useLayout from './hooks/useLayout';

const lng = Local.get('lng') || 'en';

i18next.use(initReactI18next)
  .init({
    lng,
    resources: {
      en: await import('@/locales/en.json'),
      zh: await import('@/locales/zh.json'),
    },
  });
const {
  Content,
} = Layout;

function App() {
  const navigate = useNavigate();
  const {
    themeConfig,
    menuItems,
  } = useLayout();

  return (
    <ConfigProvider theme={themeConfig} locale={lng === 'en' ? zhEN : zhCN}>
      <div>
        <Layout className="h-screen">
          <Menu
            className="fixed w-screen z-10"
            onSelect={({ key }) => navigate(key)}
            defaultSelectedKeys={['home']}
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
