import React, { useEffect, useState } from 'react';
import { Button, Upload,} from 'antd';
import { injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import { observer } from 'mobx-react';
import moment from 'moment';
import { UploadOutlinedn } from '@ant-design/icons';

const EepLxdr = observer(props => {
  const { params,  filter = {} } = props;
  const [eepparams, setEepparams] = useState({});
  useEffect(() => {


  }, []);



  const onuploadChange = (info) => {
    if (info.file.status === 'done') {
      const res = info.file.response;
      if (!res.success) {
        message.error(`${res.message} `);
        return;
      }
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  };

  const beforeUpload  = (file) => {
    let isJpgOrPng = true;
    const fname = file.name;
    const extName = fname.substring(fname.lastIndexOf('.') + 1);
    if (extName != 'eep') {
      isJpgOrPng = false;
      message.error('只能上传eep文件!');
    }
    return isJpgOrPng;
  }



  // end **************

  return (
    <div className="dagl023-file-list-dialog">
      <div className="body">
        <h5>选择已有的申请单</h5><br />
        <p className="desc"></p>
        <p className="desc"></p>
        <div className="btns">
          <Button type="primary" style={{ margin: '0 20px' }} >加入清单</Button>
          <Button >取消</Button>
        </div>
      </div>
    </div>
  );
});

export default EepLxdr;
