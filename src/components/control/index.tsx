import React, { forwardRef, ReactNode, Ref } from "react";
import styles from './index.module.scss'
export interface ControlOptionType {
  label: string;
  callback?: any
}
interface PropType {
  styles: Object
  options: ControlOptionType[]
}
const controlPanel = (props: PropType, ref: any) => {
  return (
    <div ref={ref} style={props.styles} className='absolute rounded-md shadow-md pt-2 m-2 z-10 min-w-130px wa bg-white'>
      {
        props.options.length !== 0 ? props.options.map(item => <div className="mb-2 px-6 py-1 hover-bg-#eee cursor-pointer" key={item.label}>{item.label}</div>) : '暂无操作'
      }
    </div>
  )
}
export default forwardRef<HTMLDivElement, PropType>(controlPanel)
