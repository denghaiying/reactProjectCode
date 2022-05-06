import EpsFormType from "@/eps/commons/EpsFormType";
import { Modal, Tooltip, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import EpsForm from "@/eps/components/form/EpsForm";
import { EpsSource } from "@/eps/components/panel/EpsPanel/EpsPanel";
import ApplyStore from "./ApplyStore";
import applyService from "./ApplyService";

export interface IProps {
  column: Array<EpsSource>;
  title: string;
  data: object;
  store: any;
  customForm?: Function;
}
const store = new ApplyStore(applyService);
function EpsEditButton(props: IProps) {
  const [visible, setVisible] = useState(false);
  const [modalWidth, SetModalWidth] = useState(500);
  const [source, setSource] = useState<Array<EpsSource>>([]);
  const [formData, setFormData] = useState({});

  const [form] = Form.useForm();

  const showModal = () => {
    setVisible(true);

    applyService.findByKey(props.data).then(res=>{
      if(res){
        setFormData({...props.data,...res});
        store.setData({...props.data,...res});
        form.setFieldsValue({...props.data,...res});
      }else{
        setFormData(props.data);
        store.setData(props.data);
        form.setFieldsValue(props.data);
      }
    })
  };

   useEffect(() => {
    form.resetFields();
    let _s = props.column.filter((item) => item.formType !== EpsFormType.None);
    setSource(_s);
    // SetModalWidth((parseInt(_s.length / 6)+1) * 500)
  }, []);


  useEffect(() => {
    form.resetFields();
    let _s = props.column.filter((item) => item.formType !== EpsFormType.None);
    setSource(_s);
    // SetModalWidth((parseInt(_s.length / 6)+1) * 500)
  }, []);

  useEffect(() => {
    form.resetFields();
    let _s = props.column.filter((item) => item.formType !== EpsFormType.None);
    setSource(_s);
    // SetModalWidth((parseInt(_s.length / 6)+1) * 500)
  }, []);

  return (
    <>
      <a style={{ width: 22, margin: "0 2px" }} onClick={showModal}>
        {props.title}
      </a>
      <Modal
        title={props.title}
        centered
        visible={visible}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              values["id"] = formData.id;
              values["daid"] = formData.daid;
              values["wpid"] = formData.wpid;
              values["zt"] = formData.zt;
              values["jdlx"] = formData.jdlx;
              values["kfjdmxid"]=formData.kfjdmxid;
              values["sprid"] = formData.sprid;
              if (formData.id) {
                store
                  .update(values)
                  .then((res) => {
                    message.success("数据修改成功");
                    //    store.findByKey(props.store.key)
                    props.store.queryForPage();
                    setVisible(false);
                  })
                  .catch((err) => message.error(err));
              } else {
                store
                  .save(values)
                  .then((res) => {
                    message.success("数据修改成功");
                    //   store.findByKey(props.store.key)
                    props.store.queryForPage();
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
