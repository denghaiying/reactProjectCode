import EpsFormType from "@/eps/commons/EpsFormType";
import { Modal, Tooltip, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import EpsForm from "@/eps/components/form/EpsForm";
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
const  EpsEditButton=observer((props: IProps)=> {
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
        visible={applyStore.visible}
        onOk={() => {
          debugger
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              values["daid"] = formData.daid;
              values["kfjdmxid"] = formData.kfjdmxid;
              values["wpid"] = formData.wpid;
              values["zt"] = formData.zt;
              values["jdlx"] = formData.jdlx;
              values["sprid"] = formData.sprid;
              if (formData.kfjdmxid) {
                applyStore
                  .updateBatch(values)
                  .then((res) => {
                    debugger
                    message.success("数据修改成功");
                    //    store.findByKey(props.store.key)
                    props.store.queryForPage();
                    applyStore.setVisible(false);
                  })
                  .catch((err) => message.error(err));
              }
            })
            .catch((info) => {});
        }}
        onCancel={() => applyStore.setVisible(false)}
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
})

export default EpsEditButton;
