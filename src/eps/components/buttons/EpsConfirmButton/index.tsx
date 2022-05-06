import { Button, Modal, Tooltip } from 'antd';
import React from 'react';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { EpsTableStore } from '../../panel/EpsPanel';

const { confirm } = Modal;

export interface IDeleteBtnProps {
  store: EpsTableStore;
  data: Object;
}

function EpsDeleteButton(params: IDeleteBtnProps) {

  function showPopconfirm() {
    confirm({
      title: '确定要删除该条数据么?',
      icon: <ExclamationCircleOutlined />,
      content: '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleOk,
      onCancel: handleCancel,
    });
  }

  const handleOk = async () => {
    const res = await params.store.delete(params.data);
    if (res) {
      params.store.findByKey(params.store.key);
      Modal.destroyAll();
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  return (
    <Tooltip title="删除">
      <Button size="small" danger={true} style={{fontSize: '12px'}} type={'primary'} shape="circle" icon={<DeleteOutlined />} onClick={showPopconfirm}/>
    </Tooltip>
  );
}

export default EpsDeleteButton;
