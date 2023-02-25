import { message } from 'antd';

export function createSuccessMessage(msg: string) {
  message.success(msg);
}

export function createWarningMessage(msg: string) {
  message.warning(msg);
}

export function createErrorMessage(msg: string) {
  message.error(msg);
}

export function createInfoMessage(msg: string) {
  message.info(msg);
}
