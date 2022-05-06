import React, { useEffect, useState } from 'react';
import { Radio, Dialog, Button, Input, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import { observer } from 'mobx-react';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import LoginStore from '@/stores/system/LoginStore';
import SysStore from '@/stores/system/SysStore';
//import SelectDialStore from "@/stores/appraisa/AppraisaApplySelStore";
import './SelectDailog.less';

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
const SelectDailog = observer(props => {
  const { intl: { formatMessage },  params, callback, onChange,SelectDialStore,umid='DAGL023',jdcode="kfjd",jdname="鉴定"} = props;
  const { userinfo } = LoginStore;
  //const umid = 'DAGL023';
  const { dlgVisible, setDlgVisible } = SelectDialStore;
  const { currentUser  } = SysStore;
  // useEffect(() => {
  //   setDlgVisible(visible);
  // }, [visible]);
  useEffect(() => {
    const curdate = moment();
     SelectDialStore.queryForList({ zt: 'I', yjrid: currentUser.id, dakid: params.dakid });
     SelectDialStore.setSaveParams("title", `${params.dakmc}-${curdate.format("YYYY")}${curdate.format("MM")}`);
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
  const genSQD = (autosubmit) => {
    const { ...keys } = params;
    if (SelectDialStore.saveParams.id && SelectDialStore.saveParams.id != "new") {
      keys["id"] = SelectDialStore.saveParams.id;

    } else {
      keys["title"] = SelectDialStore.saveParams.title || '';
    }
    keys["remark"] = SelectDialStore.saveParams.remark || '';
    keys["autosubmit"] = autosubmit || false;
    keys[jdcode]="D";
    SelectDialStore.addTm(keys).then(res => {
      if (res && res.success) {
        //setDlgVisible(false);
        callback && callback(res);
        IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: "加入申请单成功" });
        SelectDialStore.setDlgVisible(false)
      }
    })
  }



  const doOk = (autosubmit) => {
    if (!SelectDialStore.saveParams.id) {
      IceNotification.info("请选择一条申请单或者新建一条申请单");
      return;
    }
    genSQD(autosubmit);
  };



  // end **************

  return (
    <Dialog
      visible={dlgVisible}
      footer={false}
      closeMode={[]}
      className="dagl023-file-list-dialog"
      onClose={() => { onChange && onChange(null, false); setDlgVisible(false)}}
    >
      <div className="head">
        <span className="title"><img src={require('./icon_yjqd_blue.png')} />{"申请单"}</span>
    
      </div>
      <div className="body">
        <p className="c-title">{`选择或新建${jdname}申请单`}</p>

        <h5>选择已有的申请单</h5><br />
        <Radio.Group itemDirection="ver"
          value={SelectDialStore.saveParams.id}
          onChange={(v) => SelectDialStore.setSaveParams("id", v)} className="radiogrp">
          <div className="choose-list">
            {SelectDialStore.list && SelectDialStore.list.map(item =>
              <li key={`li-${item.id}`} className="item">
                <Radio value={item.id}><span style={{ marginLeft: 10, color: '#999' }}>{item.title}</span></Radio>
              </li>)}
          </div>
          <div className="check-input">
            <Radio value="new"><Input style={{ marginLeft: 10, width: 505 }} maxLength={100} placeholder="新增申请单" value={SelectDialStore.saveParams.title}
              onChange={(v) => SelectDialStore.setSaveParams("title", v)}></Input></Radio>
          </div>
        </Radio.Group>
        <p className="desc"></p>
        <p className="c-title">{`${jdname}`}说明</p>
        <Input.TextArea
          style={{ width: '100%', fontSize: 14, padding: 8, marginBottom: 5 }}
          autoHeight={{ minRows: 2, maxRows: 6 }}
          maxLength={300}
          value={SelectDialStore.saveParams.remark}
          onChange={(v) => SelectDialStore.setSaveParams("remark", v)}
        />
        <p className="desc"></p>
        <div className="btns">
          {SelectDialStore.saveParams.id == "new" && <Button type="primary" style={{ margin: '0 20px' }} onClick={() => doOk(true)}>加入清单并提交</Button>}
          <Button type="primary" style={{ margin: '0 20px' }} onClick={() => doOk()}>加入清单</Button>
          <Button onClick={() => { onChange && onChange(null, false);setDlgVisible(false) }}>取消</Button>
        </div>
      </div>
    </Dialog >
  );
});

export default injectIntl(SelectDailog);
