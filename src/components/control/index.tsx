import { DriverType } from "@/types";
import React, { forwardRef, ReactNode, Ref } from "react";
import styles from './index.module.scss'

export interface ControlOptionType {
  label: string;
  show: DriverType[];
  key:string;
}
interface PropType {
  styles: Object
  options: ControlOptionType[],
  curType: DriverType,
  onRow: (e: any) => any
}
const controlPanel = ({ styles, options, curType, onRow }: PropType, ref: any) => {
  // 过滤
  const list = options.filter(i => i.show.includes(curType))

  return (
    <div ref={ref} style={styles} className='absolute rounded-md shadow-md overflow-hidden m-2 z-10 min-w-130px wa bg-white'>
      {

        list.length !== 0 ? list.map(({ label, show,key}) => {
          const events = onRow({label,show,key})
          return (<div className="transition-colors-500 px-6 py-1 last-pb-2 first-pt-2 hover-bg-#eee cursor-pointer" {...events} key={key}>{label}</div>)
        }) : <div className="transition-colors-500 px-6 py-1 last-pb-2 first-pt-2 hover-bg-#eee cursor-pointer">暂无操作</div>

      }
    </div>
  )
}
export default forwardRef<HTMLDivElement, PropType>(controlPanel)
