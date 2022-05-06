import EpsFormType from "@/eps/commons/EpsFormType";
import { Modal, Tooltip, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import { EpsSource } from "@/eps/components/panel/EpsPanel/EpsPanel";
import { observer } from 'mobx-react';
export interface IProps {
  column: Array<EpsSource>;
  title: string;
  data: object;
  store: any;
  applyStore: any;
  customForm?: Function;
  applyService:any;
}
const  EpsButtonDialog=observer((props: IProps)=> {
  const {applyStore,applyService} = props;
  const [visible, setVisible] = useState(false);
  const [modalWidth, SetModalWidth] = useState(500);
  const [source, setSource] = useState<Array<EpsSource>>([]);
  const [formData, setFormData] = useState({});

  const [form] = Form.useForm();



  useEffect(() => {
    setFormData(props.data);
    applyStore.setData(props.data);
    form.setFieldsValue(props.data);
  }, [props.data]);

  useEffect(() => {
    form.resetFields();
    let _s = props.column.filter((item) => item.formType !== EpsFormType.None);
    setSource(_s);
    // SetModalWidth((parseInt(_s.length / 6)+1) * 500)
  }, []);

  return (
    <>
      <Modal
        title={props.title}
        centered
        visible={props.visible}
        footer={props.footer}
        onOk={props.onOk}>
            {props.content}
      </Modal>
    </>
  );
})

export default EpsButtonDialog;
