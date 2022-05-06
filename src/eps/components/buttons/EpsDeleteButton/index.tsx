import { Button, message, Modal, Tooltip } from 'antd';
import React from 'react';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { EpsTableStore } from '../../panel/EpsPanel';

const { confirm } = Modal;

export interface IDeleteBtnProps {
  store: EpsTableStore;
  data: Object;
  onClick: (date: any) => Promise<any>;
  deleteMessage?: string;
  afterDelete?: (store: EpsTableStore, data?: Record<string, unknown>) => void;
  isHref?: boolean;
}

function EpsDeleteButton(params: IDeleteBtnProps) {
  const handleOk = async () => {
    const res = await params.store.delete(params.data).catch((err) => {
      message.error(err.message || err);
    });
    if (res) {
      params.store.findByKey(
        params.store.key,
        params.store.page,
        params.store.size,
        params.store.params,
      );
    }
    Modal.destroyAll();
    if (params.afterDelete) {
      params.afterDelete(res);
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  function showConfrim() {
    confirm({
      title: '确定要删除该条数据么?',
      icon: <ExclamationCircleOutlined />,
      content: params.deleteMessage || '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleOk,
      onCancel: handleCancel,
    });
  }

  function showPopconfirm() {
    if (params.onClick) {
      params
        .onClick(params.data)
        .then(() => {
          showConfrim();
        })
        .catch((err) => {
          message.error(err);
        });
    } else {
      showConfrim();
    }
  }

  return params.isHref ? (
    <a style={{ fontSize: '12px' }} onClick={showPopconfirm}>
      删除
    </a>
  ) : (
    <Tooltip title="删除">
      <Button
        size="small"
        danger={true}
        style={{ fontSize: '12px' }}
        type={'primary'}
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={showPopconfirm}
      />
    </Tooltip>
  );
}

export default EpsDeleteButton;
