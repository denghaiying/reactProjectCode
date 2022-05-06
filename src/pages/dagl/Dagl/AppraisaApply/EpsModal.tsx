import { Modal,  } from 'antd';
import React, { useState } from 'react';
import useEffect from 'react';

const EpsModal = (props) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] =useState(false);
  const [modalText, setModalText] = useState('Content of the modal');

  const showModal = () => {
    setVisible(true);
  };

  

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  return (
    <>
    
      <Modal
        {...props}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
};

export default EpsModal;