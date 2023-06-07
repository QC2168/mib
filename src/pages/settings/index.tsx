import { Form, Radio } from 'antd';
import { ThemeType } from '@/lib/css/theme';
import { useRecoilState } from 'recoil';
import { Local } from '@/utils/storage';
import { themeModeState } from '../../../state/themeState';
import { version } from '../../../package.json';

export default function Index() {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState);
  const changeThemeMode = (mode: ThemeType) => {
    Local.set('themeMode', mode);
    setThemeMode(mode);
  };
  const initialValues = { themeMode };
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
        <Form.Item label="软件版本" name="version">
          {version}
        </Form.Item>
      </Form>
    </div>
  );
}
