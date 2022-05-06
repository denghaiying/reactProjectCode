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
  const { spcode = "kfjd", spname = "鉴定", spUrl,ids="" } = extendParams
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
    const curdate = moment();

    SelectDialStore.setUrl(`/eps/control/main/${spUrl}`)
    SelectDialStore.queryForList({ zt: 'I', yjrid: currentUser.id, dakid: params.dakid });
    SelectDialStore.setSaveParams("title", `${params.mc}-${curdate.format("YYYY")}${curdate.format("MM")}`);
    SelectDialStore.setSaveParams("remark", ``);

  }, [params]);
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    SelectDialStore.setColumns([{
      title: "申请",
      dataIndex: 'title',
      width: 300,
    }]);

  }, []);

  // begin ******************** 以下是事件响应
  const genSQD = (isPublish) => {
    const { ...keys } = params;
    if (SelectDialStore.saveParams.id && SelectDialStore.saveParams.id != "new") {
      keys["id"] = SelectDialStore.saveParams.id;

    } else {
      keys["title"] = SelectDialStore.saveParams.title || '';
    }
    keys["zjjd"]="Y";
    keys["remark"] = SelectDialStore.saveParams.remark || '';
    keys["autosubmit"] =true;
    keys["dakf"]=isPublish;
    keys["ids"]=ids;
    keys[spcode] = "D";
    SelectDialStore.addTm(keys).then(res => {
      if (res && res.success) {
        //setDlgVisible(false);
        callback && callback(res);
        //IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: "加入申请单成功" });
        message.info({ type: 'success', content: '提交成功' })
        props.closeModal()
      }
    })
  }



  const doOk = (isPublish) => {
    genSQD(isPublish);
  };



  // end **************

  return (
    <div className="dagl023-file-list-dialog">
   
      <div className="body">
    

        <p className="c-title">{`${spname}`}说明</p>
        <Input.TextArea
          style={{ width: '100%', fontSize: 14, padding: 8, marginBottom: 5 }}
          autoHeight={{ minRows: 2, maxRows: 6 }}
          maxLength={300}
          value={SelectDialStore.saveParams.remark}
          onChange={(v) => SelectDialStore.setSaveParams("remark", v)}
        />
        <p className="desc"></p>
        <div className="btns">
          {SelectDialStore.saveParams.id == "new" && <Button type="primary" style={{ margin: '0 20px' }} onClick={() => doOk("Y")}>{props.extendParams.disagreeBtn || "不通过"}</Button>}
          <Button type="primary" style={{ margin: '0 20px' }} onClick={() => doOk("N")}>{props.extendParams.agreeBtn || "通过"}</Button>
          <Button onClick={() => props.closeModal()}>取消</Button>
        </div>
      </div>
    </div>
  );
});

export default SelectDailog;
