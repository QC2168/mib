import { atom } from 'recoil';
import { ThemeType } from '../src/lib/css/theme';

export const themeModeState = atom({
  key: 'themeMode',
  default: localStorage.getItem('themeMode') || ThemeType.LIGHT,
});
