import React, { useEffect, useState } from 'react';
import { Radio, Dialog, Button, Input, Icon } from '@alifd/next';
import IceNotification from '@icedesign/notification';
import { observer } from 'mobx-react';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import LoginStore from '@/stores/system/LoginStore';
import SysStore from '@/stores/system/SysStore';
import AppraisaApplySelStore from '@/stores/appraisa/AppraisaApplySelStore';
import { message } from 'antd';

import './SelectDailog.less';
import { useIntl } from 'umi';

const SelectDialStore = new AppraisaApplySelStore(``, true, true);
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
const DzwjzxSelectyjzlDailog = observer((props) => {
  const {
    params,
    callback,
    closeModal,
    umid = 'DAGSYJ0009',
    extendParams = {},
  } = props;
  const {
    spcode = 'gsyjsqd',
    spName = '移交',
    spUrl,
    ids = '',
    ztlx='',
  } = extendParams;
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

    SelectDialStore.setUrl(`/eps/control/main/${spUrl}`);
    SelectDialStore.queryForList({
      yjzt: 'I',
      yjrmc: SysStore.getCurrentUser().yhmc,
      ztlx: ztlx,
      dakid: params.dakid,
    });
    SelectDialStore.setSaveParams(
      'title',
      `移交` +
        `-${params.mc}-${curdate.format('YYYY')}${curdate.format(
          'MM',
        )}${curdate.format('DD')}`,
    );
    SelectDialStore.setSaveParams('remark', ``);
  }, [params]);
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    SelectDialStore.setColumns([
      {
        title: '申请',
        dataIndex: 'title',
        width: 300,
      },
    ]);
  }, []);

  // begin ******************** 以下是事件响应
  const genSQD = (autosubmit) => {
    const { ...keys } = params;
    if (
      SelectDialStore.saveParams.id &&
      SelectDialStore.saveParams.id != 'new'
    ) {
      keys['id'] = SelectDialStore.saveParams.id;
    } else {
      keys['title'] = SelectDialStore.saveParams.title || '';
    }
    keys['remark'] = SelectDialStore.saveParams.remark || '';

    keys['sqrmc'] = SysStore.getCurrentUser().yhmc;
    keys['sqsj'] = getDate;
    keys['dw'] = SysStore.getCurrentUser().dwid;
    keys['dwmc'] = SysStore.getCurrentCmp().mc;
    keys['qzh'] = SysStore.getCurrentUser().dwid;
    keys['sqrid'] = SysStore.getCurrentUser().id;
    keys['sqr'] = SysStore.getCurrentUser().yhmc;
    keys['sqrbh'] = SysStore.getCurrentUser().id;
    keys['sqbmid'] = SysStore.getCurrentUser().bmid;
    keys['ids'] = ids;
    keys['ztlx'] = ztlx;
    keys[spcode] = 'D';
    SelectDialStore.gszxyjsqdAdd(keys).then((res) => {
      debugger
      if (res && (res.success || res.wfid)) {
        callback && callback(res);
        message.info({ type: 'success', content: `${spName}申请单提交成功` });
        props.closeModal();
      }else{
        message.error(`${res.message} `);
      }
    });
  };

  const doOk = (autosubmit) => {
    if (!SelectDialStore.saveParams.id) {
      message.info('info', '请选择一条申请单或者新建一条申请单');
      return;
    }
    genSQD(autosubmit);
  };

  // end **************

  return (
    <div className="dagl023-file-list-dialog">
      <div className="body">
        <p className="c-title">{`选择或新建${spName}申请单`}</p>

        <h5>选择已有的申请单</h5>
        <br />
        <Radio.Group
          itemDirection="ver"
          value={SelectDialStore.saveParams.id}
          onChange={(v) => SelectDialStore.setSaveParams('id', v)}
          className="radiogrp"
        >
          <div className="choose-list">
            {SelectDialStore.list &&
              SelectDialStore.list.map((item) => (
                <li key={`li-${item.id}`} className="item">
                  <Radio value={item.id}>
                    <span style={{ marginLeft: 10, color: '#999' }}>
                      {item.title}
                    </span>
                  </Radio>
                </li>
              ))}
          </div>
          <div className="check-input">
            <Radio value="new">
              <Input
                style={{ marginLeft: 10, width: 505 }}
                maxLength={100}
                placeholder="新增申请单"
                value={SelectDialStore.saveParams.title}
                onChange={(v) => SelectDialStore.setSaveParams('title', v)}
              ></Input>
            </Radio>
          </div>
        </Radio.Group>
        <p className="desc"></p>
        <p className="c-title">{`${spName}`}说明</p>
        <Input.TextArea
          style={{ width: '100%', fontSize: 14, padding: 8, marginBottom: 5 }}
          autoHeight={{ minRows: 2, maxRows: 6 }}
          maxLength={300}
          value={SelectDialStore.saveParams.remark}
          onChange={(v) => SelectDialStore.setSaveParams('remark', v)}
        />
        <p className="desc"></p>
        <div className="btns">
          {SelectDialStore.saveParams.id == 'new' && (
            <Button
              type="primary"
              style={{ margin: '0 20px' }}
              onClick={() => doOk(true)}
            >
              加入清单并提交
            </Button>
          )}
          <Button
            type="primary"
            style={{ margin: '0 20px' }}
            onClick={() => doOk()}
          >
            加入清单
          </Button>
          <Button onClick={() => props.closeModal()}>取消</Button>
        </div>
      </div>
    </div>
  );
});

export default DzwjzxSelectyjzlDailog;
