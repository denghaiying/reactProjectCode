import { Button, message, Modal, Tooltip } from 'antd';
import React from 'react';
import { DeleteOutlined, DeleteRowOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { EpsTableStore } from '../../panel/EpsPanel2';

const { confirm } = Modal;

export interface IDeleteBtnProps {
  store: EpsTableStore;
  data: any[];
}

function EpsDeleteButton(params: IDeleteBtnProps) {

  function showPopconfirm() {
    confirm({
      title: `确定要删除这${params.data.length}条数据么?`,
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
    try{
        const res = await params.store.batchDelete(params.data);
        if (res) {
          params.store.findByKey(params.store.key, params.store.page, params.store.size, params.store.params);
          Modal.destroyAll();
        }else{
          message.error('数据删除错误，请联系系统管理员')
        }
    } catch( err ){
      console.error(err)
      message.error('数据删除错误，请联系系统管理员')
    }

  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  return (
      <Button danger={true} style={{fontSize: '12px'}} type={'primary'}  icon={<DeleteRowOutlined />} onClick={showPopconfirm}>批量删除</Button>
  );
}

export default EpsDeleteButton;
