import { EpsTableStore } from '@/eps/components/panel/EpsPanel';

import React, { useState } from 'react';

import { Tooltip, Modal, Button, message, Upload } from 'antd';

import './index.less';
import './add.less';
import { ImportOutlined, UploadOutlined } from '@ant-design/icons';

function ImportReportFile(props) {
  const { text, record, index, store: EpsTableStore } = props;
  const [visible, setVisible] = useState(false);

  /*  function beforeUpload(info) {
        console.log('beforeUpload callback : ', info);
    }
*/
  function onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  }

  function onVisiable() {
    if (record.designType == '2') {
      setVisible(true);
    }
  }

  return (
    <>
      <Tooltip title="导入报表">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<ImportOutlined />}
          onClick={() => onVisiable()}
        />

        {/*
                <img src={require('../../../../styles/assets/img/hall-regist/icon_tiaodang.png')} onClick={() => onVisiable()} style={{ width: 22 }} />
*/}
      </Tooltip>

      <Modal
        title={<span className="m-title">导入报表</span>}
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <Upload
          action="/api/eps/control/main/epsreport/importFileEPS9"
          /* beforeUpload={beforeUpload}*/
          data={{ id: record.id }}
          onChange={onChange}
          /* onSuccess={onSuccess}*/
          listType="text"
        >
          <Button
            icon={<UploadOutlined />}
            type="primary"
            style={{ margin: '0 0 10px' }}
          >
            报表文件上传
          </Button>
        </Upload>
      </Modal>
    </>
  );
}

export default ImportReportFile;
