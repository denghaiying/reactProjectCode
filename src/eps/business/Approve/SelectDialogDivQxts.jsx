import React, { useEffect, useState } from 'react';
import { Radio, Dialog, Button, Input, Icon } from '@alifd/next';
import { Select } from 'antd';
import IceNotification from '@icedesign/notification';
import { observer } from 'mobx-react';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import LoginStore from '@/stores/system/LoginStore';
import SysStore from '@/stores/system/SysStore';
import AppraisaApplySelStore from '@/stores/appraisa/QxtsStore';
import { message } from 'antd';

import './SelectDailog.less';
import { useIntl } from 'umi';

const SelectDialStore = new AppraisaApplySelStore(``, true, true);

const SelectDailog = observer((props) => {
  const {
    params,
    callback,
    closeModal,
    umid = 'DAGL023',
    extendParams = {},
  } = props;
  const {
    spcode = 'kfjd',
    spName = '鉴定',
    spUrl,
    ids = '',
    mbid,
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
      zt: 'I',
      yjrid: currentUser.id,
      dakid: params.dakid,
    });
    SelectDialStore.querySjzdmx('保管期限');

    SelectDialStore.setSaveParams(
      'title',
      `${spName}申请单-${params.mc}-${curdate.format('YYYY')}${curdate.format(
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
    keys['bgqx'] = SelectDialStore.saveParams.bgqx || '';
    keys['autosubmit'] = autosubmit || false;
    keys['dwid'] = SysStore.getCurrentCmp().id;
    keys['bmid'] = SysStore.getCurrentUser().bmid;

    keys['publishTo'] = SelectDialStore.saveParams.publishTo || '内网';
    keys['ids'] = ids;
    keys['mbid'] = mbid;
    keys[spcode] = 'D';
    SelectDialStore.addTm(keys).then((res) => {
      if (res && (res.success || res.wfid)) {
        callback && callback(res);
        message.info({ type: 'success', content: `提交成功` });
        props.closeModal();
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
        <p style={{ height: '120px' }}>
          <Select
            placeholder="保管期限"
            className="ant-select"
            inputValue=""
            onChange={(v) => SelectDialStore.setSaveParams('bgqx', v)}
            options={SelectDialStore.publishTo}
            style={{ width: '98%' }}
          />
        </p>

        <div className="btns">
          {SelectDialStore.saveParams.id == 'new' && (
            <Button
              type="primary"
              style={{ margin: '0 20px' }}
              onClick={() => doOk(true)}
            >
              确定
            </Button>
          )}

          <Button onClick={() => props.closeModal()}>取消</Button>
        </div>
      </div>
    </div>
  );
});

export default SelectDailog;
