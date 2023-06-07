import { atom } from 'recoil';
import { Local } from '@/utils/storage';
import { ThemeType } from '../src/lib/css/theme';

export const themeModeState = atom({
  key: 'themeMode',
  default: Local.get('themeMode') || ThemeType.LIGHT,
});
