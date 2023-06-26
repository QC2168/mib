import { atom } from 'recoil';
import { Local } from '@/utils/storage';

export const themeModeState = atom({
  key: 'themeMode',
  default: Local.get('themeMode') || 'light',
});
