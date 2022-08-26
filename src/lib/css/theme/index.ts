import {
  Dispatch, SetStateAction, useState, useEffect,
} from 'react';

export enum ThemeType {
  DARK = 'dark',
  LIGHT = 'light',
}

const cacheTheme = localStorage.getItem('theme') as ThemeType;
const AppElement = document.querySelector('.App');

export function useTheme(type: ThemeType = cacheTheme ?? ThemeType.LIGHT): [ThemeType, Dispatch<SetStateAction<ThemeType>>] {
  const [theme, setTheme] = useState<ThemeType>(type);
  useEffect(() => {
    if (theme === ThemeType.LIGHT) {
      localStorage.setItem('theme', ThemeType.LIGHT);
      AppElement?.setAttribute('class', ThemeType.LIGHT);
    }
    if (theme === ThemeType.DARK) {
      localStorage.setItem('theme', ThemeType.DARK);
      AppElement?.setAttribute('class', ThemeType.DARK);
    }
  }, [theme]);

  return [theme, setTheme];
}
