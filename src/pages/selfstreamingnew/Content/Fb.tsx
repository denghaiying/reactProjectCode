import {Button, message, Modal, Tooltip} from 'antd';
import React from 'react';
import {CloudUploadOutlined, ExclamationCircleOutlined, UnlockOutlined} from '@ant-design/icons';
import YhStore from "@/stores/system/YhStore";
import {EpsTableStore} from "@/eps/components/panel/EpsPanel";
import { EpsSource } from '@/eps/components/panel/EpsPanel/EpsPanel';
import ContentStore from "@/stores/selfstreaming/content/Content";
import HttpRequest from "@/eps/commons/HttpRequest";
import SysStore from "@/stores/system/SysStore";
import fetch from "@/utils/fetch";

const { confirm } = Modal;


function Fb(props) {
  const { text, record, index, store: EpsTableStore } = props;


  function showPopconfirm() {
    confirm({
      title: '确定要发布么?',
      icon: <ExclamationCircleOutlined />,
      content: '将发布此内容！',
      okText: '发布',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleOk,
      onCancel: handleCancel,
    });
  }

  const handleOk = async () => {
    if (record.contentfbstate === "1") {
      message.warning(`此内容已经发布!`);
      return;
    }
    const records=record;
    records.contentfbstate="1";
    records.contentauthor=SysStore.getCurrentUser().yhmc;
    const response = await fetch .put(`/api/streamingapi/content/updatecontentfb`, records);
    if (response && response.status === 201) {
      props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
    }
    Modal.destroyAll();

  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  return (
    <Tooltip title="发布">
      <Button size="small"  style={{fontSize: '12px'}} type={'primary'} shape="circle" icon={<CloudUploadOutlined />} onClick={showPopconfirm}/>
    </Tooltip>
  );
}

export default Fb;
