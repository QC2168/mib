import {
  Modal, Form, Input, Switch,
} from 'antd';

import { useImperativeHandle, forwardRef, useState } from 'react';
import useMessage from '@/utils/message';
import { SaveItemType } from '@qc2168/mib';

const { useForm } = Form;

export enum MODAL_STATUS {
  ADD,
  EDIT
}

export interface BackupModalRef {
  open: (status: MODAL_STATUS, data?: any) => void;
  close: () => void;
}

export default forwardRef<BackupModalRef>((props, ref) => {
  const [isOpenBackupModal, setOpenBackupModal] = useState(false);
  const { createSuccessMessage } = useMessage();
  // const [config, setConfig] = useConfig();
  const [form] = useForm();
  const [currentStatus, setCurrentStatus] = useState(MODAL_STATUS.ADD);
  const defaultState: SaveItemType = {
    comment: '',
    path: '',
    output: '',
    full: false,
  };
  const open = (status: MODAL_STATUS, data?: SaveItemType) => {
    setOpenBackupModal(true);
    setCurrentStatus(status);
    form.resetFields();
    if (data) {
      form.setFieldsValue(data);
    }
  };
  const close = () => {
    setOpenBackupModal(false);
    form.resetFields();
  };
  const createBackupNode = () => {
    form.submit();
  };

  const onFinish = async (values: any) => {
    console.log(values);
    if (currentStatus === MODAL_STATUS.ADD) {
      await window.core.addNode(values);
      createSuccessMessage('添加成功');
    } else {
      createSuccessMessage('修改成功');
    }
    close();
  };
  useImperativeHandle<any, BackupModalRef>(ref, () => ({
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
        maskClosable={false}
        cancelText="取消"
        okText={currentStatus === MODAL_STATUS.ADD ? '添加' : '修改'}
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
                    return Promise.reject(new Error('请输入备注信息'));
                  }
                  return Promise.resolve();
                },
              })]}
          >
            <Input placeholder="请输入备注信息" />
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
                  return Promise.reject(new Error('请输入正确的设备备份路径，以 / 开头和结尾'));
                },
              })]}
          >
            <Input placeholder="请输入备份的文件夹路径" />
          </Form.Item>
          <Form.Item
            label="导出路径"
            name="output"
            rules={[() => ({
              required: true,
              validator(_, value) {
                if (value) {
                  if (!value || !value.trim()) {
                    return Promise.reject(new Error('请输入要导出的文件夹路径'));
                  }
                  if (/^[a-zA-Z]:\/(.+)$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请输入正确的导出路径，如 E:/backup'));
                }
                return Promise.resolve();
              },
            })]}
          >
            <Input placeholder="不填写代表继承父级路径" />
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
