import { useSetState } from 'ahooks';
import {
  Dispatch, SetStateAction, useState, useEffect,
} from 'react';
import { theme } from 'antd';
import type { ThemeConfig } from 'antd/es/config-provider/context';

export enum ThemeType {
  DARK = 'dark',
  LIGHT = 'light',
}

const { darkAlgorithm, defaultAlgorithm } = theme;
const cacheTheme = localStorage.getItem('theme') as ThemeType;
const TOKEN = {
  colorPrimary: '#C539B4',
  colorSuccess: '#852999',
  colorInfoText: '#986dc6',
  colorWarning: '#EF9A53',
  colorError: '#FB2576',
};
export function useTheme(type: ThemeType = cacheTheme ?? ThemeType.LIGHT): [ThemeConfig, ThemeType, Dispatch<SetStateAction<ThemeType>>] {
  const [mode, setMode] = useState<ThemeType>(type);
  const [themeConfig, setThemeConfig] = useSetState<ThemeConfig>({
    token: {
      ...TOKEN,
      colorError: '#FB2576',
    },
    algorithm: [defaultAlgorithm],
  });
  useEffect(() => {
    console.log({ mode });
    if (mode === ThemeType.LIGHT) {
      localStorage.setItem('theme', ThemeType.LIGHT);
      setThemeConfig({
        algorithm: [defaultAlgorithm],
        token: {
          ...TOKEN,
          colorPrimaryBgHover: '#fdd2f3',
        },
      });
    }
    if (mode === ThemeType.DARK) {
      localStorage.setItem('theme', ThemeType.DARK);
      setThemeConfig({
        algorithm: [darkAlgorithm],
        token: TOKEN,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return [themeConfig, mode, setMode];
}
