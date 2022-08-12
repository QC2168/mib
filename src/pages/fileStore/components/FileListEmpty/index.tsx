import { Empty, Button } from 'antd';

export interface FileListEmptyProps {
  turnBack: () => void
}
export default function FileListEmpty({ turnBack }: FileListEmptyProps) {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前目录没有文件/文件夹哦">
      <Button onClick={() => turnBack()}>返回上一级</Button>
    </Empty>
  );
}
