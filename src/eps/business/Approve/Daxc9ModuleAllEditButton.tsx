import EpsFormType from '@/eps/commons/EpsFormType';
import {
  Modal,
  Tooltip,
  Form,
  message,
  Button,
  Input,
  Switch,
  Row,
  Col,
} from 'antd';
import {
  PicCenterOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import EpsForm from '@/eps/components/form/EpsForm';
import { EpsSource } from '@/eps/components/panel/EpsPanel/EpsPanel';
import applyService from './ApplyEditButtonService';
import ApplyEditButtonStore from './ApplyEditbuttonStore';
import NewDajyStore from '@/stores/daly/NewDajyStore';
import moment from 'moment';

export interface IProps {
  column: Array<EpsSource>;
  title: string;
  data: object;
  store: any;
  customForm?: Function;
}
const store = new ApplyEditButtonStore(applyService);
function EpsEditButton(props: IProps) {
  const [visible, setVisible] = useState(false);
  const [source, setSource] = useState<Array<EpsSource>>([]);
  const [xgfkForm] = Form.useForm();

  const [form] = Form.useForm();

  const showModal = () => {
    if (props.allSelect && !props.fid) {
      message.warning('请选择审批单!');
      return;
    }
    if (!props.data.daid && !props.allSelect) {
      message.warning('请至少选择一行数据!');
      return;
    }
    setVisible(true);
    // applyService.findByKey(props.data).then(res => {
    //   if (res) {
    //     var params={ ...props.data, ...res }
    //     if(res.sprq){
    //       params.sprq= moment(res.sprq)
    //     }
    //     setFormData(params);
    //     store.setData(params);
    //     form.setFieldsValue(params);
    //   } else {
    //     setFormData(props.data);
    //     store.setData(props.data);
    //     form.setFieldsValue(props.data);
    //   }
    // })
  };

  /**
   * 修改效果反馈
   */
  const onPut_Xg = async (value) => {
    value.id = props.data.jydmxid;
    const res = await NewDajyStore.updateXcdmxs(value);
    await props.refreshDetail();
    setVisible(false);
    message.success({ type: 'success', content: '修改成功!' });
  };

  useEffect(() => {
    xgfkForm.resetFields();
    let _s = props.column.filter((item) => item.formType !== EpsFormType.None);
    setSource(_s);
  }, []);
  const span = 8;

  const findByDataLx = () => {
    if (props.isButton && props.jyRecord?.wpid !== 'ZZZZ') {
      return <Button type="primary" onClick={showModal}>批量审核</Button>
    }
  }
  return (
    <>
      {findByDataLx()}
      <Modal
        title={<span className="m-title">审批</span>}
        visible={visible}
        onOk={() => {
          xgfkForm.validateFields().then((values) => {
            xgfkForm.resetFields();
            onPut_Xg(values);
          });
        }}
        onCancel={() => setVisible(false)}
      // width="30%"
      //style={{ top: 50 }}
      >
        <Form className="schedule-form" name="xgfkForm" form={xgfkForm}>

          <Row>
            <Col span={span}>
              <Form.Item label="电子借阅" name="dzjy" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>

            <Col span={span}>
              <Form.Item label="实体借阅" name="stjy" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={span}>
              <Form.Item label="文件查看" name="mxck" valuePropName="checked">
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={span}>
              <Form.Item label="文件打印:" name="mxdy" valuePropName="checked">
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>

            <Col span={span}>
              <Form.Item label="文件下载:" name="mxxz" valuePropName="checked">
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>

          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default EpsEditButton;
