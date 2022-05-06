import React, { useState } from 'react';
import { message, Tooltip, Button, Modal } from 'antd';
import { CloseCircleTwoTone,ExclamationCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import 'antd/dist/antd.css';
import CqbcDakService from './service/CqbcDakService';

const { confirm } = Modal;

const deleteDakfz = observer((props) => {


    function showPopconfirm() {
        confirm({
          title: '确定要删除该档案库吗?',
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
    CqbcDakService.deleteDak({id: props.record.id}).then(res => {
        message.success('档案库删除成功')
        props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
        Modal.destroyAll();

    })
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

    return (
        <>
            <Tooltip title="删除档案库">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<CloseCircleTwoTone />} onClick={ showPopconfirm} />
            </Tooltip>
        </>
    )
});

export default deleteDakfz
