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
  const openRepo = async () => {
    await window.win.openLink('https://github.com/QC2168/mib');
  };
  const update = () => {
    createInfoMessage('请联系作者加入获取最新版本下载');
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
      createSuccessMessage('注入推荐配置成功，快去备份吧！');
    } catch {
      createErrorMessage('注入失败，请重试');
    }
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
        <Form.Item label="关于项目">
          <Space>
            {
              hasNewVersion ? <Button icon={<VerticalAlignBottomOutlined />} onClick={() => update()} type="primary">获取新版本</Button> : null
            }

            <Popover
              title="联系作者加入交流群/反馈/建议"
              content={(
                <Image
                  width={150}
                  src={wechat}
                />
)}
            >
              <Button icon={<WechatOutlined />} type="primary">联系作者</Button>
            </Popover>
            <Button type="primary" onClick={() => openRepo()} icon={<GithubOutlined />}>项目地址</Button>
          </Space>
        </Form.Item>
        <Form.Item label="导入常用配置配置">
          <Space>
            <Button onClick={() => importRecommendNode(RecommendSystemConfigEnum.XIAOMI)}>小米/红米(MIUI)</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
