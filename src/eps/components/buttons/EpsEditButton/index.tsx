import { EpsSource } from '@/eps/commons/declare';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EditOutlined } from '@ant-design/icons';
import { Modal, Tooltip, Form, message, Button, FormInstance } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import EpsForm from '../../form/EpsForm';
import { EpsTableStore } from '../../panel/EpsPanel';
import EpsTreeStore from '../../panel/EpsPanel2/EpsTreeStore';


export interface IProps{
  column: EpsSource[],
  title: string;
  data: unknown[];
  width?: number;
  store: EpsTableStore;
  customForm?: Function;
  treeStore?: EpsTreeStore;
  refresh?: boolean;
  labelColSpan?: number;
  onClick?: (form: FormInstance, record: Record<string, any>) => void;
  afterEdit?: (store: EpsTableStore, data?: Record<string, unknown>) => void;
}

function EpsEditButton(props: IProps) {

  const [visible, setVisible] = useState(false);
  const [modalWidth, setModalWidth] = useState(500)
  const [source, setSource] = useState<EpsSource[]>([])
  const [formData,setFormData] = useState({})

  const [form]= Form.useForm()

  const showModal = (event) => {
    event.nativeEvent.stopImmediatePropagation()
    event.stopPropagation()
    setVisible(true)
    let fData = JSON.parse(JSON.stringify(props.data))
    props.column.forEach(item => {
      if(item.formType === EpsFormType.DatePicker){
        fData[item.code] = moment(props.data[item.code])
      }
    })
    setFormData(fData)
    if(props.onClick){
      props.onClick(form, fData)
    }
    form.setFieldsValue(fData);
  }

  useEffect(() => {
    form.resetFields();
    let _s = props.column.filter(item => item.formType !== EpsFormType.None);
    setSource(_s);
    if(!props.width || props.width <= 0){
      let res1 = parseInt(props.column.length / 10)
      let res2 = props.column.length % 10
      let res3 = res1 + (res2 === 0 ? 0 : 1) >= 4 ? 4 : (res1 + (res2 === 0 ? 0 : 1))
      setModalWidth(res3 * 450)
    }
    // SetModalWidth((parseInt(_s.length / 6)+1) * 500)
  }, [])

  return (
    <>
    <Tooltip title="修改" >
      <Button size="small"  style={{fontSize: '12px', color: '#08c'}} shape="circle" icon={<EditOutlined />} onClick={(event) => showModal(event)}/>
    </Tooltip>
    <Modal
        title={props.title}
        centered
        visible={visible}
        onOk={() => {form
          .validateFields()
          .then(values => {
            values['id'] = props.data?.id
            // 修改Switch的值
            const switchs = source.filter(item => item.formType === EpsFormType.Switch)
            if(switchs){
              switchs.forEach(it => {
                let result = it.dataSource
                values[it.code] = values[it.code] ? result[0]?.key : result[1]?.key
              })
            }
            props.store.update(values).then(res => {
                message.success('数据修改成功')
                props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
                if (props.refresh) {
                  props.treeStore?.findTree(props.treeStore?.key)
                }
                setVisible(false);
                form.resetFields();
                if (props.afterEdit) {
                  props.afterEdit
                }
              }
            ).catch(info => {
              if (info.errorFields.length > 0) {
                return;
              }
              form.resetFields();
            })
          })
          .catch(info => {

          });}}
        onCancel={() => setVisible(false)}
        width={props.width || modalWidth}
      >
        <EpsForm modal='modify' source={source} detailVisible={visible} form={form} data={formData} customForm={props.customForm && props.customForm(form, props.store)} labelColSpan={props.labelColSpan}></EpsForm>
      </Modal>
    </>
  );
}

export default EpsEditButton;
