import { message } from 'antd';

export default function useMessage() {
  const [messageApi] = message.useMessage();

  function createSuccessMessage(msg: string) {
    message.success(msg);
  }

  function createWarningMessage(msg: string) {
    message.warning(msg);
  }
  function createErrorMessage(msg: string) {
    message.error(msg);
  }
  function createInfoMessage(msg: string) {
    message.info(msg);
  }
  return {
    messageApi,
    createSuccessMessage,
    createWarningMessage,
    createErrorMessage,
    createInfoMessage,
  };
}
