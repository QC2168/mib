import {
  Modal, Form, Input, Switch,
} from 'antd';

import {
  useState, useImperativeHandle, forwardRef,
} from 'react';
import useConfig from '@/config/useConfig';
import { createSuccessMessage } from '@/hooks/useMessage';

const { useForm } = Form;

export interface ExposeType {
  open: () => void
  close: () => void
}

export default forwardRef((props, ref) => {
  const [isOpenBackupModal, setOpenBackupModal] = useState(false);
  const [config, setConfig] = useConfig();
  const [form] = useForm();
  const defaultState = {
    comment: '',
    path: '',
    output: '',
    full: false,
  };
  const open = () => {
    setOpenBackupModal(true);
    form.resetFields();
  };
  const close = () => {
    setOpenBackupModal(false);
    form.resetFields();
  };
  const createBackupNode = () => {
    form.submit();
  };

  const onFinish = (values: any) => {
    setConfig({
      backups: [...config.backups, values],
    });
    createSuccessMessage('添加成功');
    close();
  };
  useImperativeHandle<any, ExposeType>(ref, () => ({
    open,
    close,
  }));
  return (
    <div>
      <Modal
        title="新增节点"
        open={isOpenBackupModal}
        onOk={() => createBackupNode()}
        onCancel={() => setOpenBackupModal(false)}
        cancelText="取消"
        okText="更新"
      >
        <Form
          name="detail"
          initialValues={defaultState}
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="节点备注"
            name="comment"
            rules={[
              () => ({
                required: true,
                validator(_, value) {
                  if (!value || !value.trim()) {
                    return Promise.reject(new Error('请输入设备中需要备份路径'));
                  }
                  return Promise.resolve();
                },
              })]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="备份路径"
            name="path"
            rules={[
              () => ({
                required: true,
                validator(_: any, value: string) {
                  if (!value || !value.trim()) {
                    return Promise.reject(new Error('请输入设备中需要备份路径'));
                  }
                  if (/^\/(?:[^/]+\/)+$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请输入正确的设备备份路径，以 / 结尾'));
                },
              })]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="导出路径"
            name="output"
            rules={[() => ({
              required: true,
              validator(_, value) {
                if (!value || !value.trim()) {
                  return Promise.reject(new Error('请输入要导出的文件夹路径'));
                }
                if (/^[a-zA-Z]:\/(.+)$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('请输入正确的导出路径，如 E:/backup'));
              },
            })]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="全量备份"
            name="full"
            valuePropName="checked"
            rules={[
              { required: true },
            ]}
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
        </Form>

      </Modal>
    </div>
  );
});
