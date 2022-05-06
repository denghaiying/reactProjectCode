import { Button, message, Modal, Tooltip } from 'antd';
import React from 'react';
import { ExclamationCircleOutlined, UnlockOutlined } from '@ant-design/icons';
import YhStore from '@/stores/system/YhStore';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';

const { confirm } = Modal;

function UnLock(text, record, index, store: EpsTableStore) {
  function showPopconfirm() {
    confirm({
      title: '确定要解除此用户的锁定么?',
      icon: <ExclamationCircleOutlined />,
      content: '用户将解除锁定！',
      okText: '解锁',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleOk,
      onCancel: handleCancel,
    });
  }

  const handleOk = async () => {
    if (record.cwcs < 3) {
      message.warning(`此用户没有锁定!`);
      //           openNotification('此用户没有锁定', 'warning');
      return;
    }
    // const res = await YhStore.updateJc(record);
    /*if (res) {
        }*/
    const res = await YhStore.updateJc(record);
    /*if (res && res.status === 200) {
            //   openNotification('解除锁定成功', 'warning');
        }*/
    store.findByKey(store.key);
    Modal.destroyAll();
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  return (
    <Tooltip title="解除锁定">
      <Button
        size="small"
        style={{ fontSize: '12px' }}
        type={'primary'}
        shape="circle"
        icon={<UnlockOutlined />}
        onClick={showPopconfirm}
      />
    </Tooltip>
  );
}

export default UnLock;
