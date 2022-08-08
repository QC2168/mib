import { Button, Space } from 'antd';
import { FC, Key, ReactElement } from 'react';

interface PropsType{
  selectedRowKeys:Key[];
  clear:()=>void
}

export default function TableFooter({
  selectedRowKeys,
  clear,
}:PropsType):ReactElement {
  return (
    <div>
      <Space>
        当前已选择
        {' '}
        {selectedRowKeys.length}
        {' '}
        个节点
        <Button onClick={() => clear()}>全部取消选择</Button>
      </Space>
    </div>
  );
}
