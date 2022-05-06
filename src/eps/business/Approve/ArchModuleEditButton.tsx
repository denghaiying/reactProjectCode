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
import React, { useEffect, useState } from 'react';
import EpsForm from '@/eps/components/form/EpsForm';
import { EpsSource } from '@/eps/components/panel/EpsPanel/EpsPanel';
import {
  PicCenterOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import NewDajyStore from '@/stores/daly/NewDajyStore';
import applyService from './ApplyEditButtonService';
import ApplyEditButtonStore from './ApplyEditbuttonStore';
import ApplyDetailService from './ApplyDetailService';

import moment from 'moment';
const { TextArea } = Input;
export interface IProps {
  column: Array<EpsSource>;
  title: string;
  data: object;
  store: any;
  customForm?: Function;
}
const store = new ApplyEditButtonStore(applyService);
function ArchModuleEditButton(props: IProps) {
  const [visible, setVisible] = useState(false);
  const [xgfkForm] = Form.useForm();
  const [source, setSource] = useState<Array<EpsSource>>([]);

  const showModal = () => {
    if (props.allSelect && !props.fid) {
      message.warning('请选择审批单!');
      return;
    }
    if (!props.data.daid && !props.allSelect) {
      message.warning('请至少选择一行数据!');
      return;
    }
    let ck;
    let dy;
    let xz;

    if (props.data.mxck === 'Y') {
      ck = true;
    } else {
      ck = false;
    }
    if (props.data.mxdy === 'Y') {
      dy = true;
    } else {
      dy = false;
    }
    if (props.data.mxxz === 'Y') {
      xz = true;
    } else {
      xz = false;
    }

    xgfkForm.setFieldsValue({
      mxck: ck,
      mxdy: dy,
      mxxz: xz,
    });

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
   * 修改打印下载查看
   */
  const onPut_Xg = async (value) => {
    value.id = props.data.jydid;
    const res = await NewDajyStore.updateJydmx(value);
    await props.refreshDetail();
    setVisible(false);

    // await props.store.findByKey('', 1, store.size, {
    //   fid: props.fid,
    //   ...props.detailParams,
    // });

  };

  useEffect(() => { }, []);

  const span = 8;
  const _width = 240;

  const findByDataLx = () => {
    if (props.isButton) {
      return <Tooltip title={props.title}>  <Button size="small" style={{ fontSize: '12px' }} type={'primary'} shape="circle" icon={<PicCenterOutlined />} onClick={showModal}
/>
      </Tooltip>
    }
  }

  return (
    <>

      {/* {findByDataLx()} */}
      {props.isButton ? (
        <Button type="primary" onClick={showModal}> {props.title}</Button> )
         : (
        <Tooltip title={props.title}>
          <Button
            size="small"
            style={{ fontSize: '12px' }}
            type={'primary'}
            shape="circle"
            icon={<PicCenterOutlined />}
            onClick={showModal}
          />
        </Tooltip>
      )}


      <Modal
        title={<span className="m-title">审批</span>}
        visible={visible}
        onOk={() => {
          xgfkForm.validateFields().then((values) => {
            xgfkForm.resetFields();
            onPut_Xg(values);
            props.clearTableRowClick();
          });
        }}
        onCancel={() => setVisible(false)}
      // width="30%"
      //style={{ top: 50 }}
      >
        <Form className="schedule-form" name="xgfkForm" form={xgfkForm}>
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

export default ArchModuleEditButton;
