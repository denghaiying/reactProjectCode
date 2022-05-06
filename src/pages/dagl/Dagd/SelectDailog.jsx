import React, { useEffect, useState } from 'react';
import { Radio, Dialog, Button, Input, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import { observer } from 'mobx-react';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import LoginStore from '../../../stores/system/LoginStore';
import DagdSelStore from '../../../stores/dagl/DagdSelStore';
import './index.less';

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
const DagdSelectDailog = observer(props => {
  const { intl: { formatMessage }, visible, params, callback, onChange } = props;
  const { userinfo } = LoginStore;
  const umid = 'DAGL024';
  const [dlgVisible, setDlgVisible] = useState(visible);
  useEffect(() => {
    setDlgVisible(visible);
  }, [visible]);
  useEffect(() => {
    const curdate = moment();
    DagdSelStore.queryForList({ zt: 'I', gdrid: userinfo.id, dakid: params.dakid });
    DagdSelStore.setSaveParams("title", `${params.dakmc}-${userinfo.orgmc}-${curdate.format("YYYY")}${curdate.format("MM")}`);
    setDlgVisible(true);
  }, [params]);
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    DagdSelStore.setColumns([{
      title: formatMessage({ id: 'e9.dagl.dagd.gdtitle' }),
      dataIndex: 'title',
      width: 300,
    }]);

  }, []);

  // begin ******************** 以下是事件响应
  const genSQD = (autosubmit) => {
    const { ...keys } = params;
    if (DagdSelStore.saveParams.id && DagdSelStore.saveParams.id != "new") {
      keys["id"] = DagdSelStore.saveParams.id;

    } else {
      keys["title"] = DagdSelStore.saveParams.title || '';
    }
    keys["remark"] = DagdSelStore.saveParams.remark || '';
    keys["autosubmit"] = autosubmit || false;
    DagdSelStore.addTm(keys).then(res => {
      if (res && res.success) {
        setDlgVisible(false);
        callback();
        IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: "加入归档申请单成功" });

      }
    })
  }



  const doOk = (autosubmit) => {
    if (!DagdSelStore.saveParams.id) {
      IceNotification.info("请选择一条申请单或者新建一条申请单");
      return;
    }
    genSQD(autosubmit);
  };

  // end ********************

  // begin *************以下是自定义函数区域



  // end **************

  return (
    <Dialog
      visible={dlgVisible}
      footer={false}
      closeMode={[]}
      className="dagl024-file-list-dialog"
    >
      <div className="head">
        <span className="title"><img src={require('./icon_yjqd_blue.png')} />{formatMessage({ id: 'e9.dagl.dagd.title' })}</span>
        <Icon type="close" size='small' style={{ color: '#8c8b8b', cursor: 'pointer' }} onClick={() => { onChange && onChange(null, false); setDlgVisible(false); }} />
      </div>
      <div className="body">
        <p className="c-title">选择或新建归档清单</p>
        <h5>选择已有的申请单</h5><br />
        <Radio.Group itemDirection="ver"
          value={DagdSelStore.saveParams.id}
          onChange={(v) => DagdSelStore.setSaveParams("id", v)} className="radiogrp">
          <div className="choose-list">
            {DagdSelStore.list && DagdSelStore.list.map(item =>
              <li key={`li-${item.id}`} className="item">
                <Radio value={item.id}><span style={{ marginLeft: 10, color: '#999' }}>{item.title}</span></Radio>
              </li>)}
          </div>
          <div className="check-input">
            <Radio value="new"><Input style={{ marginLeft: 10, width: 505 }} maxLength={100} placeholder="新增申请单" value={DagdSelStore.saveParams.title}
              onChange={(v) => DagdSelStore.setSaveParams("title", v)}></Input></Radio>
          </div>
        </Radio.Group>
        <p className="desc">标题简要说明归档的特征,必须填写，不能重复。</p>
        <p className="c-title">归档清单的归档说明</p>
        <Input.TextArea
          style={{ width: '100%', fontSize: 14, padding: 8, marginBottom: 5 }}
          autoHeight={{ minRows: 2, maxRows: 6 }}
          maxLength={300}
          value={DagdSelStore.saveParams.remark}
          onChange={(v) => DagdSelStore.setSaveParams("remark", v)}
        />
        <p className="desc">如选中多个档案，则归档说明会附在每个档案上。</p>
        <div className="btns">
          {DagdSelStore.saveParams.id == "new" && <Button type="primary" style={{ margin: '0 20px' }} onClick={() => doOk(true)}>加入清单并提交</Button>}
          <Button type="primary" style={{ margin: '0 20px' }} onClick={() => doOk()}>加入清单</Button>
          <Button onClick={() => { onChange && onChange(null, false); setDlgVisible(false); }}>取消</Button>
        </div>
      </div>
    </Dialog >
  );
});

export default injectIntl(DagdSelectDailog);
