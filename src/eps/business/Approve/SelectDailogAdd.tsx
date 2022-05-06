import React, { useEffect, useState } from 'react';
import {
  Col,
  Form,
  Row,
  Select,
  Space,
  TreeSelect,
  Button,
  Input,
  message,
} from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import SysStore from '@/stores/system/SysStore';
import AppraisaApplySelStore from '@/stores/appraisa/AppraisaApplySelStore';

import './SelectDailog.less';
import DakSelectTree from '../DakSelectTree';
const SelectDialStore = new AppraisaApplySelStore(``, true, true);

const formItemLayout = {
  colon: false,
  labelCol: {
    span: 6,
  },
};
/**
 * 弹框选择
 */
const SelectDailog = observer((props) => {
  const [form] = Form.useForm();
  const {
    params,
    callback,
    closeModal,
    umid = 'DAGL023',
    extendParams = {},
  } = props;
  const { spcode = 'kfjd', spName = '鉴定', spUrl, ids = '' } = params;
  SelectDialStore.setUrl(`/eps/control/main/${spUrl}`);

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

    SelectDialStore.setTitle(
      `${spName}申请单-${curdate.format('YYYY')}${curdate.format(
        'MM',
      )}${curdate.format('DD')}`,
    );
    SelectDialStore.setSaveParams(
      'title',
      `${spName}申请单-${curdate.format('YYYY')}${curdate.format(
        'MM',
      )}${curdate.format('DD')}`,
    );
    SelectDialStore.setSaveParams('remark', ``);

    SelectDialStore.setColumns([
      {
        title: '申请',
        dataIndex: 'title',
        width: 300,
      },
    ]);
  }, []);

  const setDakInfo = (node) => {
    SelectDialStore.setSaveParams('bmc', node.mbc);
    SelectDialStore.setSaveParams('dakid', node.id);
    SelectDialStore.setSaveParams('mc', node.mc);
  };

  // begin ******************** 以下是事件响应
  const genSQD = (autosubmit) => {
    form
      .validateFields()
      .then((values) => {
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
        keys['autosubmit'] = false;
        keys['dwid'] = SysStore.getCurrentCmp().id;
        keys['bmid'] = SysStore.getCurrentUser().bmid;
        keys['bmc'] = SelectDialStore.saveParams.bmc || '';
        keys['dakid'] = SelectDialStore.saveParams.dakid || '';
        keys['mc'] = SelectDialStore.saveParams.mc || '';

        //  keys['ids'] = ids;
        keys[spcode] = 'D';
        SelectDialStore.addTm(keys).then((res) => {
          if (res && (res.success || res.wfid)) {
            callback && callback(res);
            message.info({
              type: 'success',
              content: `${spName}申请单提交成功`,
            });
            props.closeModal();
          }
        });
      })
      .catch((info) => {
        console.log(info);
        message.error(`操作失败,请检查数据!`);
      });
  };

  const onCancel = () => {
    debugger;
    props.closeModal();
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
    <div style={{ padding: '10px 0px' }}>
      <Form form={form} {...formItemLayout}>
        <Form.Item label="档案库:" required name="fid">
          <DakSelectTree
            style={{ width: 380 }}
            // treeData={DwStore.dwTreeData}
            onSelect={(_, node) => {
              setDakInfo(node);
            }}
            placeholder="请选择档案库"
            treeDefaultExpandAll
            allowClear
          />
        </Form.Item>
        {SelectDialStore.saveParams.title && (
          <Form.Item
            label="标题:"
            name="title"
            initialValue={SelectDialStore.saveParams.title}
            required
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input
              defaultValue={SelectDialStore.saveParams.title}
              onChange={(e) =>
                SelectDialStore.setSaveParams('title', e.target.value)
              }
              style={{ width: 380 }}
            />
          </Form.Item>
        )}
        <Form.Item label="说明:" name="bz">
          <Input.TextArea showCount maxLength={500} style={{ width: 380 }} />
        </Form.Item>
        <Form.Item
          style={{ padding: '20px 0px' }}
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Space style={{ float: 'right' }}>
            <Button type="primary" onClick={doOk}>
              提交并调档
            </Button>
            <Button onClick={onCancel}>关闭</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
});

export default SelectDailog;
