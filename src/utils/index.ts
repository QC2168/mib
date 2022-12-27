import { notification } from 'antd';

export function openNotification(
  message: string,
  description: string,
  onClick?: () => void,
  onClose?: () => void,
) {
  notification.open({
    message,
    description,
    onClick,
    onClose,
  });
}

// 文件大小后缀转换
export function readablizeBytes(bytes: number): string {
  if (bytes === 0) return '';
  const s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** Math.floor(e)).toFixed(2)} ${s[e]}` ?? 0;
}
