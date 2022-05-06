import EpsFormType from '@/eps/commons/EpsFormType';
import { ITableService } from '@/eps/commons/panel';
import { FileAddOutlined } from '@ant-design/icons';
import { Button, Form, Modal, message, FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';
import EpsForm from '../../form/EpsForm';
import { EpsTableStore } from '../../panel/EpsPanel';
import { EpsSource } from '../../panel/EpsPanel/EpsPanel';

export interface IProps{
  column: EpsSource[],
  title: string;
  service: ITableService;
  store: EpsTableStore;
  customForm?: Function;
  width?: number;
  labelColSpan?: number;
  disabled?: boolean;
  onClick?: (form: FormInstance) => void | boolean;
  afterAdd?: (store: EpsTableStore, data?: Record<string, unknown>) => void;
}

function EpsAddButton(props: IProps) {
  const [visible, setVisible] = useState(false);
  const [modalWidth, setModalWidth] = useState(500)
  const [source, setSource] = useState<EpsSource[]>([])

  const [form]= Form.useForm()

  useEffect(() => {
    form.resetFields();
    let _s = props.column.filter(item => item.formType !== EpsFormType.None);
    setSource(_s);
    // SetModalWidth((parseInt(_s.length / 6)+1) * 500)
    if(!props.width || props.width <= 0){
      let res1 = parseInt(props.column.length / 10)
      let res2 = props.column.length % 10
      let res3 = res1 + (res2 === 0 ? 0 : 1) >= 4 ? 4 : (res1 + (res2 === 0 ? 0 : 1))
      setModalWidth(res3 * 450)
    }
  }, [])


  return (
    <>
      <Button type="primary" style={{marginRight: 10}} disabled={props.disabled} onClick={() => {
        form.resetFields();
        let result: boolean = true
        if (props.onClick) {
          const flag = props.onClick(form)
          result = flag === undefined ? true : flag;
        }
        setVisible(result)
      }}
      >
        <FileAddOutlined/>新建
      </Button>
      <Modal
        title={props.title}
        style={{zIndex: 11}}
        centered
        visible={visible}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              props.store.save(values).then(res => {
                message.success('数据添加成功');
                props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
                setVisible(false);
                form.resetFields();
                if (props.afterAdd) {
                  props.afterAdd
                }
              }).catch(err => {
                message.error(err)
              })
            })
            .catch(info => {
              if (info.errorFields.length > 0) {
                return;
              }
              message.error(`数据添加失败,${info}`)
            })
        }}
        onCancel={() => setVisible(false)}
        width={props.width || modalWidth}
      >
        <EpsForm modal='add' source={source} form={form} data={{}}
                 customForm={props.customForm && props.customForm(form, props.store)}
                 labelColSpan={props.labelColSpan}></EpsForm>
      </Modal>
    </>
  );
}

export default EpsAddButton;
