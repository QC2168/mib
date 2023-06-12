import {
  Form, Radio, Button,
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { ThemeType } from '@/lib/css/theme';
import { useRecoilState } from 'recoil';
import { Local } from '@/utils/storage';
import { useState } from 'react';
import useMessage from '@/utils/message';
import { themeModeState } from '../../../state/themeState';
import { version } from '../../../package.json';

export default function Index() {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState);
  const {
    createErrorMessage,
    createSuccessMessage,
  } = useMessage();
  const initialValues = { themeMode };
  const changeThemeMode = (mode: ThemeType) => {
    Local.set('themeMode', mode);
    setThemeMode(mode);
  };
  const [rebooting, setRebooting] = useState(false);
  const rebootADB = async () => {
    setRebooting(true);
    const { result } = await window.core.rebootADB();
    if (result) {
      createSuccessMessage('重启成功');
    } else {
      createErrorMessage('重启失败');
    }
    setRebooting(false);
  };

  return (
    <div className="px-8 py-2">
      <Form
        layout="vertical"
        initialValues={initialValues}
        autoComplete="off"
      >

        <Form.Item label="主题皮肤" name="themeMode">
          <Radio.Group onChange={(e) => changeThemeMode(e.target.value)}>
            <Radio value={ThemeType.LIGHT}>浅色</Radio>
            <Radio value={ThemeType.DARK}>深色</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="软件版本">
          {version}
        </Form.Item>
        <Form.Item label="设备连接服务（ADB）">
          <Button type="primary" icon={<ReloadOutlined />} loading={rebooting} disabled={rebooting} onClick={() => rebootADB()}>{rebooting ? '正在重启服务' : '重启服务'}</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
