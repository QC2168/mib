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

export function useTheme(type: ThemeType = cacheTheme ?? ThemeType.LIGHT): [ThemeConfig, ThemeType, Dispatch<SetStateAction<ThemeType>>] {
  const [mode, setMode] = useState<ThemeType>(type);
  const [themeConfig, setThemeConfig] = useSetState<ThemeConfig>({
    token: {
      colorPrimary: '#7d53b0',
      colorSuccess: '#986dc6',
      colorInfoText: '#986dc6',
      colorWarning: '#faad14',
      colorError: '#f5222d',
    },
    algorithm: [defaultAlgorithm],
  });
  useEffect(() => {
    console.log({ mode });
    if (mode === ThemeType.LIGHT) {
      localStorage.setItem('theme', ThemeType.LIGHT);
      setThemeConfig({ algorithm: [defaultAlgorithm] });
    }
    if (mode === ThemeType.DARK) {
      localStorage.setItem('theme', ThemeType.DARK);
      setThemeConfig({ algorithm: [darkAlgorithm] });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return [themeConfig, mode, setMode];
}
