import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';
import { Button, Form, message, Upload } from 'antd';

import fetch from '@/utils/fetch';
import moment from 'moment';
import { SaveOutlined } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import RightStore from '@/components/RightContent/RightStore';

const Apply = observer((props) => {
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const [tip, seTip] = useState('');

  const store = useLocalStore(() => ({
    list: [],

    async queryContent1() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhzytz`,
      );
      debugger;
      if (response.status === 200) {
        this.list = response.data;
      }
    },

    apply: async function (bdInfo) {
      const formData = new FormData();
      formData.append('name', bdInfo.name);
      formData.append('phone', bdInfo.phone);
      formData.append('lyfs', bdInfo.lyfs);
      formData.append('dalx', bdInfo.dalx);
      formData.append('lymd', bdInfo.lymd);
      formData.append('content', bdInfo.content);
      //  formData.append('tipmes', bdInfo.tipmes);
      // formData.append(
      //   'whr',
      //   SysStore.getCurrentUser().yhmc ? SysStore.getCurrentUser().yhmc : '',
      // );
      // formData.append(
      //   'whrid',
      //   SysStore.getCurrentUser().id ? SysStore.getCurrentUser().id : '',
      // );
      // formData.append(
      //   'whsj',
      //   SysStore.getCurrentUser().yhmc ? SysStore.getCurrentUser().yhmc : '',
      // );
      const response = await fetch.post(
        `/api/eps/portal/wxapply/add`,
        formData,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            dataType: 'json',
          },
        },
      );
      debugger;
      if (response && response.status === 200) {
        if (response.data.success) {
          // message.success(`??????????????????!`);
          seTip('?????????????????????');
        } else {
          //  message.error(`??????????????????!`);
          seTip('?????????????????????');
        }
      }
    },
  }));

  useEffect(() => {
    //  store.queryContent1();
  }, []);

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    form
      .validateFields()
      .then((data) => {
        store
          .apply(data)
          .then((res) => {
            debugger;
            //     message.success('???????????????');
            //    store.query();
            //     RightStore.queryAllCartCount();
          })
          .catch((err) => {
            message.error(err);
          });
      })
      .catch((err) => {
        message.error(err);
      });
  };

  return (
    <Form
      name="xtform"
      form={form}
      //  initialValues={XtStore.xtData}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
    >
      <div className="archives-apply">
        <div className="inner-content">
          <div className="table">
            <div className="row">
              <div className="cell">??????</div>
              <div className="cell input">
                <Form.Item
                  label=""
                  name="name"
                  rules={[{ required: true, message: '???????????????' }]}
                >
                  <input value="fsfdfdsf"></input>
                </Form.Item>
              </div>
              <div className="cell">????????????</div>
              <div className="cell input">
                <Form.Item
                  label=""
                  name="phone"
                  rules={[{ required: true, message: '?????????????????????' }]}
                >
                  <input></input>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="cell">????????????</div>
              <div className="cell input">
                <Form.Item
                  label=""
                  name="lyfs"
                  rules={[{ required: true, message: '?????????????????????' }]}
                >
                  <input></input>
                </Form.Item>
              </div>
              <div className="cell">????????????</div>
              <div className="cell input">
                <Form.Item
                  label=""
                  name="dalx"
                  rules={[{ required: true, message: '?????????????????????' }]}
                >
                  <input></input>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="cell">????????????</div>
              <div className="cell input">
                <Form.Item
                  label=""
                  name="lymd"
                  rules={[{ required: true, message: '?????????????????????' }]}
                >
                  <input></input>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="cell">????????????</div>
              <div className="cell input">
                <Form.Item
                  label=""
                  name="content"
                  rules={[{ required: true, message: '?????????????????????' }]}
                >
                  <input></input>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="cell">????????????</div>
              <div className="cell input">
                {/*<Form.Item label="" name="tipmes">*/}
                <input value={tip} className="tipinput"></input>
                {/*</Form.Item>*/}
              </div>
            </div>
          </div>
          {/*<Upload>*/}
          {/*  <div className="upload">*/}
          {/*    <span>+</span>*/}
          {/*    <span>????????????</span>*/}
          {/*  </div>*/}
          {/*</Upload>*/}
          <div className="btn">
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              ??????
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
});
export default Apply;
