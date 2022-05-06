import { EpsSource } from '@/eps/commons/declare';
import EpsFormType from '@/eps/commons/EpsFormType';
import { CopyOutlined } from '@ant-design/icons';
import { Modal, Tooltip, Form, message, Button } from 'antd';
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
  refresh?: boolean;
  treeStore?: EpsTreeStore;
}

function EpsCopyButton(props: IProps) {

  const [visible, setVisible] = useState(false);
  const [modalWidth, setModalWidth] = useState(500)
  const [source, setSource] = useState<EpsSource[]>([])
  const [formData,setFormData] = useState({})

  const [form]= Form.useForm()

  const showModal = () => {
    setVisible(true)
    let fData = JSON.parse(JSON.stringify(props.data))
    props.column.forEach(item => {
      if(item.formType === EpsFormType.DatePicker){
        fData[item.code] = moment(props.data[item.code])
      }
    })
    setFormData(fData)

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
    <Tooltip title="复制" >
      <Button size="small"  style={{fontSize: '12px', color: '#08c'}} shape="circle" icon={<CopyOutlined />} onClick={showModal}/>
    </Tooltip>
    <Modal
        title={props.title}
        centered
        visible={visible}
        onOk={() => {form
          .validateFields()
          .then(values => {
            // 修改Switch的值
            const switchs = source.filter(item => item.formType === EpsFormType.Switch)
            if(switchs){
              switchs.forEach(it => {
                let result = it.dataSource
                values[it.code] = values[it.code] ? result[0]?.key : result[1]?.key
              })
            }
            props.store.save(values).then(res => {
              message.success('数据复制并新增成功')
              props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
              setVisible(false);
              form.resetFields();
            }
            ).catch(err => {
              message.error(err)
              // form.resetFields();
            })
          })
          .catch(info => {

          });}}
        onCancel={() => setVisible(false)}
        width={props.width || modalWidth}
      >
        <EpsForm modal='add' source={source} detailVisible={visible} form={form} data={formData} customForm={props.customForm && props.customForm(form, props.store)}></EpsForm>
      </Modal>
    </>
  );
}

export default EpsCopyButton;
