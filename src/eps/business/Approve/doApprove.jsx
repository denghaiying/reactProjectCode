import React, { useEffect, useState } from 'react';
import { Radio, Dialog, Button, Input, Icon } from '@alifd/next';
import IceNotification from '@icedesign/notification';
import { observer } from 'mobx-react';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import LoginStore from '@/stores/system/LoginStore';
import SysStore from '@/stores/system/SysStore';
import AppraisaApplySelStore from "@/stores/appraisa/AppraisaApplySelStore";
import { message } from 'antd';

import './SelectDailog.less';
import { useIntl } from 'umi';

const SelectDialStore = new AppraisaApplySelStore(
  ``,
  true,
  true
);

const SelectDailog = observer(props => {

  const { params, callback, closeModal, umid = 'DAGL023', extendParams = {} } = props;
  const { spcode = "kfjd", spname = "鉴定", spUrl } = extendParams
  SelectDialStore.setUrl(`/eps/control/main/${spUrl}`);
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { userinfo } = LoginStore;
  //const umid = 'DAGL023';
  const { dlgVisible, setDlgVisible } = SelectDialStore;
  const { currentUser } = SysStore;
  // useEffect(() => {
  //   setDlgVisible(visible);
  // }, [visible]);
  useEffect(() => {
   
  }, [params]);
  useEffect(() => {
  

  }, []);

  

  const doOk = (autosubmit) => {
    debugger
    if (!SelectDialStore.saveParams.id) {
      message.info("info","请选择一条申请单或者新建一条申请单");
      return;
    }
  
  };



  // end **************

  return (
    <div className="dagl023-file-list-dialog">
      
    </div>
  );
});

export default SelectDailog;
