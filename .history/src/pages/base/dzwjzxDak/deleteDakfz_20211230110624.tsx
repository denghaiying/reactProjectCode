import React, { useState } from 'react';
import { message, Tooltip, Button, Modal } from 'antd';
import { DeleteTwoTone,ExclamationCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import DzwjzxDakService from './service/DzwjzxDakService';

const { confirm } = Modal;

const deleteDakfz = observer((props) => {


    function showPopconfirm() {
        confirm({
          title: '确定要删除该电子文件中心档案库分组吗?',
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
    DzwjzxDakService.deleteDakfz({id: props.record.id}).then(res => {
        message.success('电子文件中心档案库分组删除成功')
        props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
        Modal.destroyAll();

    })
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

    return (
        <>
            <Tooltip title="删除电子文件中心档案库分组">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<DeleteTwoTone />} onClick={ showPopconfirm} />
            </Tooltip>
        </>
    )
});

export default deleteDakfz
