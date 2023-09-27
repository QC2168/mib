import {
  Modal, Form, Input, Switch,
} from 'antd';

import {
  useImperativeHandle, forwardRef, useState, Dispatch, SetStateAction,
} from 'react';
import useMessage from '@/utils/message';
import { SaveItemType } from '@qc2168/mib';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

export enum MODAL_STATUS {
  ADD,
  EDIT
}

export interface BackupModalRef {
  open: (status: MODAL_STATUS, data?: SaveItemType, index?: number) => void;
  close: () => void;
}

export interface BackupModalProps {
  setSource: Dispatch<SetStateAction<SaveItemType[]>>;
}

export default forwardRef<BackupModalRef, BackupModalProps>((props, ref) => {
  const [isOpenBackupModal, setOpenBackupModal] = useState(false);
  const { createSuccessMessage } = useMessage();
  const { t } = useTranslation();
  const [form] = useForm();
  const [currentStatus, setCurrentStatus] = useState(MODAL_STATUS.ADD);
  const defaultState: SaveItemType = {
    comment: '',
    path: '',
    output: '',
    full: false,
    checkHash: false,
    id: Date.now(),
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

  const onFinish = async (values: SaveItemType) => {
    if (currentStatus === MODAL_STATUS.ADD) {
      const cfg = await window.core.addNode(values);
      props.setSource(cfg.backups);
      createSuccessMessage(t('home.nodeModal.added'));
    } else {
      // 如果是存在的，则是执行修改操作，由mib-cli处理
      const cfg = await window.core.editNode(values);
      props.setSource(cfg.backups);
      createSuccessMessage(t('home.nodeModal.edited'));
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
        title={currentStatus === MODAL_STATUS.ADD ? t('home.nodeModal.addBtn') : t('home.nodeModal.editBtn')}
        open={isOpenBackupModal}
        onOk={() => createBackupNode()}
        onCancel={() => setOpenBackupModal(false)}
        maskClosable={false}
        cancelText={t('home.nodeModal.exitText')}
        okText={currentStatus === MODAL_STATUS.ADD ? t('home.nodeModal.addText') : t('home.nodeModal.editText')}
      >
        <Form
          name="detail"
          initialValues={defaultState}
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item hidden name="id" label="id">
            <Input />
          </Form.Item>
          <Form.Item
            label={t('home.nodeModal.comment')}
            name="comment"
            rules={[
              () => ({
                required: true,
                validator(_, value) {
                  if (!value || !value.trim()) {
                    return Promise.reject(new Error(t('home.nodeModal.commentPlaceHolder')));
                  }
                  return Promise.resolve();
                },
              })]}
          >
            <Input placeholder={t('home.nodeModal.commentPlaceHolder')} />
          </Form.Item>
          <Form.Item
            label={t('home.nodeModal.backupPath')}
            name="path"
            rules={[
              () => ({
                required: true,
                validator(_: any, value: string) {
                  if (!value || !value.trim()) {
                    return Promise.reject(new Error(t('home.nodeModal.backupPathPlaceHolder')));
                  }
                  if (/^\/(?:[^/]+\/)+$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('home.nodeModal.backupPathErrorTip')));
                },
              })]}
          >
            <Input placeholder={t('home.nodeModal.backupPathPlaceHolder')} />
          </Form.Item>
          <Form.Item
            label={t('home.nodeModal.exportPath')}
            name="output"
            rules={[() => ({
              required: true,
              validator(_, value) {
                if (value) {
                  if (!value || !value.trim()) {
                    return Promise.reject(new Error(t('home.nodeModal.exportPathEmpty')));
                  }
                  if (/^[a-zA-Z]:\/(.+)$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('home.nodeModal.exportPathErrorTip')));
                }
                return Promise.resolve();
              },
            })]}
          >
            <Input placeholder={t('home.nodeModal.exportPathPlaceHolder')} />
          </Form.Item>
          <Form.Item
            label={t('home.nodeModal.full')}
            name="full"
            valuePropName="checked"
            rules={[
              { required: true },
            ]}
            tooltip={t('home.nodeModal.fullTip')}
          >
            <Switch checkedChildren={t('home.nodeModal.checked')} unCheckedChildren={t('home.nodeModal.unChecked')} />
          </Form.Item>
          <Form.Item
            label={t('home.nodeModal.hashMode')}
            name="checkHash"
            valuePropName="checked"
            rules={[
              { required: true },
            ]}
            tooltip={t('home.nodeModal.hashModeTip')}
          >
            <Switch checkedChildren={t('home.nodeModal.checked')} unCheckedChildren={t('home.nodeModal.unChecked')} />
          </Form.Item>
        </Form>

      </Modal>
    </div>
  );
});
