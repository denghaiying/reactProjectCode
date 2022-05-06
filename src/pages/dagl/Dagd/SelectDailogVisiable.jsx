import React, { useEffect, useState } from 'react';
import { Radio, Dialog, Button, Input, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import { observer } from 'mobx-react';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import LoginStore from '../../../stores/system/LoginStore';
import YjspSelStore from '../../../stores/dagl/YjspSelStore';
import './SelectDailogVisable.less';
import { useIntl } from 'umi';
import SysStore from '@/stores/system/SysStore';

/**
 * @Author: Mr.Wang
 * @Date: 2019/9/16 15:45
 * @Version: 9.0b
 * @Content:
 *    2019/12/10 王祥
 *    修改：
 *      1.状态组件由IceStore改成mobx
 *    2019/9/16 王祥
 *      新增代码
 */

const SelectDailogVisiable = observer((props) => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { visible = true, params, callback, onChange } = props;
  const userinfo = SysStore.getCurrentUser();
  const umid = 'DAGL023';
  const [dlgVisible, setDlgVisible] = useState(visible);
  console.log('userinfo', userinfo);
  debugger;
  useEffect(() => {
    setDlgVisible(visible);
  }, [visible]);
  useEffect(() => {
    const curdate = moment();
    YjspSelStore.queryForList({
      zt: 'I',
      yjrid: userinfo && userinfo.id,
      dakid: params.dakid,
    });
    YjspSelStore.setSaveParams(
      'title',
      `${params.dakmc}-${userinfo && userinfo.orgmc}-${
        userinfo && userinfo.yhmc
      }`,
    );
    setDlgVisible(true);
  }, [params]);
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    YjspSelStore.setColumns([
      {
        title: formatMessage({ id: 'e9.dagl.yjsp.yjtitle' }),
        dataIndex: 'title',
        width: 300,
      },
    ]);
  }, []);

  // begin ******************** 以下是事件响应
  const genSQD = (autosubmit) => {
    const { ...keys } = params;
    if (YjspSelStore.saveParams.id && YjspSelStore.saveParams.id != 'new') {
      keys['id'] = YjspSelStore.saveParams.id;
    } else {
      keys['title'] = YjspSelStore.saveParams.title || '';
    }
    keys['remark'] = YjspSelStore.saveParams.remark || '';
    //   keys["autosubmit"] = autosubmit || false;
    YjspSelStore.addTm(keys).then((res) => {
      if (res) {
        debugger;
        if (res.id) {
          setDlgVisible(false);
          if (autosubmit) {
            window.top.Eps.top().runFunc(umid, {});
          }
          parent.closeIFrame();
          window.close();
          window.parent.close();
          // callback();
          IceNotification.info({
            message: formatMessage({ id: 'e9.info.info' }),
            description: '加入移交申请单成功',
          });
        } else {
          IceNotification.info({
            message: formatMessage({ id: 'e9.info.info' }),
            description: '加入移交申请单失败！\r\n' + res.message,
          });
        }
      }
    });
  };

  const doOk = (autosubmit) => {
    if (!YjspSelStore.saveParams.id) {
      IceNotification.info('请选择一条申请单或者新建一条申请单');
      return;
    }
    genSQD(autosubmit);
  };

  // end ********************

  // begin *************以下是自定义函数区域

  // end **************

  return (
    <div className="dagl023-file-list-dialog">
      <div className="body">
        <p className="c-title">选择或新建移交清单</p>

        <h5>选择已有的申请单</h5>
        <br />
        <Radio.Group
          itemDirection="ver"
          value={YjspSelStore.saveParams.id}
          onChange={(v) => YjspSelStore.setSaveParams('id', v)}
          className="radiogrp"
        >
          <div className="choose-list">
            {YjspSelStore.list &&
              YjspSelStore.list.map((item) => (
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
                value={YjspSelStore.saveParams.title}
                onChange={(v) => YjspSelStore.setSaveParams('title', v)}
              ></Input>
            </Radio>
          </div>
        </Radio.Group>
        <p className="desc">标题简要说明移交的特征,必须填写，不能重复。</p>
        <p className="c-title">移交清单的移交说明</p>
        <Input.TextArea
          style={{ width: '100%', fontSize: 14, padding: 8, marginBottom: 5 }}
          autoHeight={{ minRows: 2, maxRows: 6 }}
          maxLength={300}
          value={YjspSelStore.saveParams.remark}
          onChange={(v) => YjspSelStore.setSaveParams('remark', v)}
        />
        <p className="desc">如选中多个档案，则移交说明会附在每个档案上。</p>
        <div className="btns">
          {YjspSelStore.saveParams.id == 'new' && (
            <Button
              type="primary"
              style={{ margin: '0 20px' }}
              onClick={() => doOk(true)}
            >
              加入清单并查看
            </Button>
          )}
          <Button
            type="primary"
            style={{ margin: '0 20px' }}
            onClick={() => doOk()}
          >
            加入清单
          </Button>
        </div>
      </div>
    </div>
  );
});

export default SelectDailogVisiable;
