import { Button, Modal, notification, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { EpsTableStore } from '../../panel/EpsPanel';
import EpsReportStore from '@/eps/components/buttons/EpsReportButton/store/EpsReportStore';
import fetch from '@/utils/fetch';

const { confirm } = Modal;

export interface IDeleteBtnProps {
  store: EpsTableStore;
  data: Object;
}

function ExportReportFile(props) {
  const { text, record, index, store: EpsTableStore } = props;
  //初始化
  useEffect(() => {
    EpsReportStore.queryForId(record.id);
  }, []);

  function showPopconfirm() {
    if (record.designType == '2') {
      if (
        EpsReportStore.epsReportEntity &&
        EpsReportStore.epsReportEntity.xmlc == null
      ) {
        notification.open({
          message: '提示',
          description: '报表还没有设计，请先设计报表！',
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      } else {
        confirm({
          title: '导出报表?',
          icon: <ExclamationCircleOutlined />,
          content: '确定要导出报表么?',
          okText: '导出',
          okType: 'danger',
          cancelText: '取消',
          onOk: handleOk,
          onCancel: handleCancel,
        });
      }
    }
  }

  const handleOk = async () => {
    const param = new FormData();
    param.append('id', record.id);
    const response = await fetch.post(
      `/api/eps/control/main/epsreport/exportFile`,
      param,
      {
        responseType: 'blob',
      },
    );
    if (response && response.status === 200) {
      const type =
        response.headers['context-type'] && 'application/octet-stream';
      let filename = response.headers['content-disposition'];
      const pos = filename.indexOf('filename=');
      if (pos > 0) {
        filename = filename.substring(pos + 9);
        if (filename.indexOf('"') > -1) {
          filename = filename.substring(1, filename.length - 1);
        }
      }
      const blob = new Blob([response.data], { type });
      const url = window.URL.createObjectURL(blob);
      const aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.href = url;
      aLink.setAttribute('download', decodeURIComponent(filename));
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      window.URL.revokeObjectURL(url);
    }
    if (response) {
      notification.success({ message: '导出报表成功' });
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  return (
    <Tooltip title="导出">
      <Button
        size="small"
        style={{ fontSize: '12px' }}
        type="primary"
        shape="circle"
        icon={<DownloadOutlined />}
        onClick={showPopconfirm}
      />

      {/*
            <img src={require('../../../../styles/assets/img/hall-regist/icon_xiugai.png')} alt="" style={{width: 22, margin: '0 2px'}} onClick={showPopconfirm}/>
*/}
    </Tooltip>
  );
}

export default ExportReportFile;
