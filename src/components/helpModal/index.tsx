import { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Image } from 'antd';
import wechat from '../../assets/images/wechat.jpg';

export interface helpModalExposeType {
  showModal: () => void;
}
export default forwardRef<helpModalExposeType>((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useImperativeHandle(ref, () => ({
    showModal,
  }));
  return (
    <Modal title="关于" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText="关闭" centered okText="确定">
      <p>感谢您使用本软件，如果在使用过程中遇到问题或者您有更好的建议可以直接与我反馈哦！</p>
      <Image
        width={200}
        src={wechat}
      />
    </Modal>

  );
});
