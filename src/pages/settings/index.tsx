import {
  Form, Radio, Button, Popover, Space, Image,
} from 'antd';
import {
  GithubOutlined, ReloadOutlined, WechatOutlined, VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { ThemeType } from '@/lib/css/theme';
import { useRecoilState } from 'recoil';
import { Local } from '@/utils/storage';
import { useState } from 'react';
import useMessage from '@/utils/message';
import wechat from '@/assets/images/wechat.jpg';
import { useMount } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { themeModeState } from '../../../state/themeState';
import { version } from '../../../package.json';
import { RecommendSystemConfigEnum } from '../../../electron/utils/recommendConfigs/types';

export default function Index() {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState);
  const [hasNewVersion, setHasNewVersion] = useState(false);
  const {
    createErrorMessage,
    createSuccessMessage,
    createInfoMessage,
  } = useMessage();

  const { t, i18n } = useTranslation();
  const lng = Local.get('lng');
  const initialValues = { themeMode, lng };
  const changeThemeMode = (mode: ThemeType) => {
    Local.set('themeMode', mode);
    setThemeMode(mode);
  };
  const changeLng = (lng: string) => {
    Local.set('lng', lng);
    i18n.changeLanguage(lng);
  };
  const [rebooting, setRebooting] = useState(false);
  const rebootADB = async () => {
    setRebooting(true);
    const { result } = await window.core.rebootADB();
    if (result) {
      createSuccessMessage(t('settings.tips.rebooted'));
    } else {
      createErrorMessage(t('settings.tips.rebootFailed'));
    }
    setRebooting(false);
  };
  const openRepo = async () => {
    await window.win.openLink('https://github.com/QC2168/mib');
  };
  const update = () => {
    createInfoMessage(t('settings.tips.obtainLatestVersion'));
    setTimeout(async () => {
      await window.win.openLink('https://github.com/QC2168/mib/releases');
    }, 2000);
  };
  const check = async () => {
    const data = await window.versions.version();
    if (data) {
      setHasNewVersion(true);
    }
  };
  useMount(() => {
    check();
  });

  const importRecommendNode = async (system:RecommendSystemConfigEnum) => {
    try {
      await window.utils.injectRecommendConfig(system);
      createSuccessMessage(t('settings.tips.injectedCfg'));
    } catch {
      createErrorMessage(t('settings.tips.injectCfgFailed'));
    }
  };
  return (
    <div className="px-8 py-2">
      <Form
        layout="vertical"
        initialValues={initialValues}
        autoComplete="off"
      >

        <Form.Item label={t('settings.field.theme')} name="themeMode">
          <Radio.Group onChange={(e) => changeThemeMode(e.target.value)}>
            <Radio value={ThemeType.LIGHT}>{t('settings.field.light')}</Radio>
            <Radio value={ThemeType.DARK}>{t('settings.field.dark')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('settings.field.lng')} name="lng">
          <Radio.Group onChange={(e) => changeLng(e.target.value)}>
            <Radio value="zh">{t('settings.field.zh')}</Radio>
            <Radio value="en">{t('settings.field.en')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('settings.field.version')}>
          {version}
        </Form.Item>
        <Form.Item label={t('settings.field.adbServe')}>
          <Button type="primary" icon={<ReloadOutlined />} loading={rebooting} disabled={rebooting} onClick={() => rebootADB()}>{rebooting ? t('settings.field.rebooting') : t('settings.field.reboot')}</Button>
        </Form.Item>
        <Form.Item label={t('settings.field.about')}>
          <Space>
            {
              hasNewVersion ? <Button icon={<VerticalAlignBottomOutlined />} onClick={() => update()} type="primary">{t('settings.field.obtainLatestVBtn')}</Button> : null
            }

            <Popover
              title={t('settings.field.aboutAuthor')}
              content={(
                <Image
                  width={150}
                  src={wechat}
                />
)}
            >
              <Button icon={<WechatOutlined />} type="primary">{t('settings.field.authorBtn')}</Button>
            </Popover>
            <Button type="primary" onClick={() => openRepo()} icon={<GithubOutlined />}>{t('settings.field.projectRepo')}</Button>
          </Space>
        </Form.Item>
        <Form.Item label={t('settings.field.injectCfg')}>
          <Space>
            <Button onClick={() => importRecommendNode(RecommendSystemConfigEnum.XIAOMI)}>{t('settings.injectCfgBtn.xiaomi')}</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
