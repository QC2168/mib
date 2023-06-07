import { useSetState } from 'ahooks';
import { useEffect } from 'react';
import { theme } from 'antd';
import type { ThemeConfig } from 'antd/es/config-provider/context';
import { useRecoilState } from 'recoil';
import { themeModeState } from '../../../../state/themeState';

export enum ThemeType {
  DARK = 'dark',
  LIGHT = 'light',
}

const { darkAlgorithm, defaultAlgorithm } = theme;
const TOKEN = {
  colorPrimary: '#C539B4',
  colorSuccess: '#852999',
  colorInfoText: '#986dc6',
  colorWarning: '#EF9A53',
  colorError: '#FB2576',
};
export function useTheme() {
  const [themeMode] = useRecoilState(themeModeState);
  const [themeConfig, setThemeConfig] = useSetState<ThemeConfig>({
    token: {
      ...TOKEN,
      colorError: '#FB2576',
    },
    algorithm: [themeMode === ThemeType.LIGHT ? defaultAlgorithm : darkAlgorithm],
  });
  useEffect(() => {
    setThemeConfig({ algorithm: [themeMode === ThemeType.LIGHT ? defaultAlgorithm : darkAlgorithm] });
  }, [themeMode, setThemeConfig]);
  return [themeConfig];
}
