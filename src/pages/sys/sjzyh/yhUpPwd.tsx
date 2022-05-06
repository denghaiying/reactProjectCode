import {
  Modal,
  Tooltip,
  Form,
  message,
  Button,
  notification,
  Checkbox,
  Select,
  Col,
  Row,
} from 'antd';
import React, { useState } from 'react';
import EpsForm from '@/eps/components/form/EpsForm';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsSource } from '@/eps/components/panel/EpsPanel/EpsPanel';
import { Input } from '@alifd/next';
import YhStore from '@/stores/system/YhStore';
import { FormOutlined } from '@ant-design/icons';

export interface IProps {
  column: Array<EpsSource>;
  title: string;
  data: object;
  store: EpsTableStore;
  customForm?: Function;
}

function yhUpPwd(text, record, index, store: EpsTableStore) {
  const [uppwdvisible, setUpPwdVisible] = useState(false);
  const [source, setSource] = useState<Array<EpsSource>>([]);
  const [form] = Form.useForm();

  const mc = record.yhmc;
  const yhid = record.id;

  const showModal = () => {
    setUpPwdVisible(true);
    console.log('yhid====' + record.id);
  };

  /**
   * 提交审核
   */
  /* const onPwd_Add = () => {

        let url = "/api/eps/control/main/yh/changepassword?yhid=" + record.id +
            "&password=" + record.pwd + "&yhmc=" + record.yhmc + "&oldpassword=";

        const response =  fetch.post(url);
        if (response.success) {
            notification.success({ message: "修改密码成功！" });
        } else {
            notification.error({ message: "修改密码失败！" });
        }

        setUpPwdVisible(false);
    }*/

  // 自定义表单
  const span = 24;
  const _width = 240;

  const customForm = () => {
    //自定义表单校验

    return (
      <>
        <Row gutter={12}>
          <Col span={span}>
            <Form.Item name="yhmc" label="用户名称：" initialValue={mc}>
              <Input defaultValue={mc} disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="新密码:"
              name="pwd"
              required
              rules={[{ required: true, message: '请输入新密码！' }]}
            >
              <Input.Password style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item name="id" initialValue={yhid}>
              <Input defaultValue={yhid} style={{ display: 'none' }} />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <>
      <Tooltip title="修改密码">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<FormOutlined />}
          onClick={showModal}
        />
        {/*"
                <img src={require('@/styles/assets/img/leftNav/icon_canshu.png')} alt="" style={{width: 22, margin: '0 2px'}} onClick={showModal}/>
*/}
      </Tooltip>
      <Modal
        title="修改密码"
        centered
        visible={uppwdvisible}
        onCancel={() => setUpPwdVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              YhStore.changepassword(values)
                .then((res) => {
                  //          message.success('密码修改成功');
                  setUpPwdVisible(false);
                  form.resetFields();
                })
                .catch((err) => {
                  message.error(err);
                });
            })
            .catch((info) => {
              message.error('密码修改失败,' + info);
            });
        }}
        width={500}
      >
        <EpsForm
          source={source}
          form={form}
          data={record}
          customForm={customForm}
        ></EpsForm>
      </Modal>
    </>
  );
}
export default yhUpPwd;
