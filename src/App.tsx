import {
  ConfigProvider, Layout, Menu, Result,
} from 'antd';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeType } from './lib/css/theme';
import Home from './pages/home';
import useLayout from './hooks/useLayout';

const {
  Content,
} = Layout;

function App() {
  const navigate = useNavigate();
  const {
    themeConfig,
    menuItems,
    mode,
  } = useLayout();

  return (
    <ConfigProvider theme={themeConfig}>
      <div>
        <Layout className="h-screen">
          <Menu
            className="fixed w-screen z-10"
            onSelect={({ key }) => navigate(key)}
            theme={mode === ThemeType.DARK ? 'dark' : 'light'}
            defaultSelectedKeys={['home']}
            mode="horizontal"
            items={menuItems}
          />
          <Content className="p-2 pt-14">
            <Routes>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route
                path="/file"
                element={(
                  <Result
                    title="正在开发中"
                  />
                  )}
              />
            </Routes>
          </Content>
        </Layout>
      </div>
    </ConfigProvider>
  );
}

export default App;
