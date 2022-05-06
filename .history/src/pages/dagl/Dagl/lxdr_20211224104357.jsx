import React, { useEffect, useState } from 'react';
import { Button, Upload,} from 'antd';
import { injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import { observer } from 'mobx-react';
import moment from 'moment';
import { UploadOutlinedn } from '@ant-design/icons';

//import SelectDialStore from "@/stores/appraisa/AppraisaApplySelStore";

/**
 * @Author: Mr.Wang
 * @Date: 2019/9/16 15:45
 * @Version: 9.0
 * @Content:
 *    2019/12/10 王祥
 *    修改：
 *      1.状态组件由IceStore改成mobx
 *    2019/9/16 王祥
 *      新增代码
 */
const Lxdr = observer(props => {
  const { filter } = props;
  const [eepparams, setEepparams] = useState({});
  useEffect(() => {

  }, [params]);
  useEffect(() => {

    setEepparams(filter);
    debugger
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

  function beforeUpload(file) {
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
      <div style={{ height: '350px' }}>
          <Upload
            action="/api/eps/control/main/gszxyjcx/importEepInfonew"
            onChange={onuploadChange}
            beforeUpload={beforeUpload}
            name="Fdata"
            data={eepparams}
          >
            <br />
            <Button
              icon={<UploadOutlined />}
              type="primary"
              style={{ margin: '0 0 10px' }}
            >
              选择导入EEP
            </Button>
          </Upload>
        </div>
  );
});

export default injectIntl(Lxdr);
