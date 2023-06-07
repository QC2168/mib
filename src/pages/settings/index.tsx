import { Form, Radio } from 'antd';
import { ThemeType } from '@/lib/css/theme';
import { useRecoilState } from 'recoil';
import { themeModeState } from '../../../state/themeState';

export default function Index() {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState);

  const changeThemeMode = (mode:ThemeType) => {
    localStorage.setItem('themeMode', mode);
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
      </Form>
    </div>
  );
}
