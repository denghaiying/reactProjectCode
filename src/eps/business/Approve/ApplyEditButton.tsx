import EpsFormType from '@/eps/commons/EpsFormType';
import { Modal, Tooltip, Form, message, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import EpsForm from '@/eps/components/form/EpsForm';
import { EpsSource } from '@/eps/components/panel/EpsPanel/EpsPanel';

import applyService from './ApplyEditButtonService';
import ApplyEditButtonStore from './ApplyEditbuttonStore';
import { PicCenterOutlined } from '@ant-design/icons';
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
  const [modalWidth, SetModalWidth] = useState(600);
  const [source, setSource] = useState<Array<EpsSource>>([]);
  const [formData, setFormData] = useState({});

  const [form] = Form.useForm();

  const showModal = () => {
    debugger;
    if (props.allSelect && !props.fid) {
      message.warning('请选择审批单!');
      return;
    }
    if (!props.data.daid && !props.allSelect) {
      message.warning('请至少选择一行数据!');
      return;
    }
    setVisible(true);
    applyService.findByKey(props.data).then((res) => {
      if (res) {
        var params = { ...props.data, ...res };
        if (res.sprq) {
          params.sprq = moment(res.sprq);
        }
        setFormData(params);
        store.setData(params);
        form.setFieldsValue(params);
      } else {
        setFormData(props.data);
        store.setData(props.data);
        form.setFieldsValue(props.data);
      }
    });
  };

  useEffect(() => {
    form.resetFields();
    let _s = props.column.filter((item) => item.formType !== EpsFormType.None);
    setSource(_s);
    // SetModalWidth((parseInt(_s.length / 6)+1) * 500)
  }, []);

  return (
    <>
      {props.isButton ? (
        <Button type="primary" onClick={showModal}>
          {props.title}
        </Button>
      ) : (
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
        title={props.title}
        centered
        width={props.width}
        visible={visible}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              values['id'] = formData.id;
              values['daid'] = formData.daid;
              values['wpid'] = formData.wpid;
              values['zt'] = formData.zt;
              values['jdlx'] = formData.jdlx;
              values['kfjdmxid'] = formData.kfjdmxid;
              values['sprid'] = formData.sprid;
              if (formData.applyLevel) {
                values['applylevel'] = formData.applylevel;
              }
              // 审批全部
              if (props.allSelect && props.fid) {
                form.resetFields();
                values['fid'] = props.fid;
                store
                  .updateAllDetail(values)
                  .then((res) => {
                    message.success('数据修改成功');
                    props.refreshDetail();
                    setVisible(false);
                  })
                  .catch((err) => message.error(err));
              } else if (
                formData.kfjdmxid &&
                formData.kfjdmxid.indexOf(',') >= 0
              ) {
                form.resetFields();

                store
                  .updateBatch(values)
                  .then((res) => {
                    debugger;
                    message.success('数据修改成功');
                    props.refreshDetail();
                    setVisible(false);
                  })
                  .catch((err) => message.error(err));
              } else if (formData.id && formData.kfjdmxid.indexOf(',') < 0) {
                store
                  .update(values)
                  .then((res) => {
                    message.success('数据修改成功');
                    props.refreshDetail();
                    setVisible(false);
                  })
                  .catch((err) => message.error(err));
              } else {
                debugger;
                store
                  .save(values)
                  .then((res) => {
                    message.success('数据修改成功');
                    //   store.findByKey(props.store.key)
                    props.refreshDetail();
                    setVisible(false);
                  })
                  .catch((err) => message.error(err));
              }
            })
            .catch((info) => {});
        }}
        onCancel={() => setVisible(false)}
        width={modalWidth}
      >
        <EpsForm
          source={source}
          form={form}
          data={formData}
          customForm={props.customForm}
        ></EpsForm>
      </Modal>
    </>
  );
}

export default EpsEditButton;
