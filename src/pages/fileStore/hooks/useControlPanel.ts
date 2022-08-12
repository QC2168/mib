import { useClickAway } from 'ahooks';
import {
  Dispatch, MutableRefObject, SetStateAction, useState,
} from 'react';
    // 控制面板坐标
    interface ControlPanelStyleType {
      left: number;
      top: number;
      visibility: 'visible' | 'hidden'
    }
export default function useControlPanel(ref:MutableRefObject<HTMLDivElement|null>):[ControlPanelStyleType, Dispatch<SetStateAction<ControlPanelStyleType>>] {
  const [controlPanelStyle, setControlPanelStyle] = useState<ControlPanelStyleType>({
    left: 0,
    top: 0,
    visibility: 'hidden',
  });

  useClickAway(() => {
    setControlPanelStyle({ ...controlPanelStyle, visibility: 'hidden' });
  }, ref);

  return [controlPanelStyle, setControlPanelStyle];
}
