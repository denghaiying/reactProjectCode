import EpsFormType from '@/eps/commons/EpsFormType';
import {Modal, Tooltip, Form, message, Button} from 'antd';
import React, { useEffect, useState } from 'react';
import EpsForm from '@/eps/components/form/EpsForm';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsSource } from '@/eps/components/panel/EpsPanel/EpsPanel';
import { CopyOutlined} from "@ant-design/icons";


export interface IProps{
    column: Array<EpsSource>,
    title: string;
    data: object;
    store: EpsTableStore;
    customForm?: Function;
}

function CopyOrg(props:IProps) {

    const [visible, setVisible] = useState(false);
    const [source, setSource] = useState<Array<EpsSource>>([])
    const [formData,setFormData] = useState({})

    const [form]= Form.useForm()

    const showModal = () => {
        setVisible(true)
        setFormData(props.data)

        form.setFieldsValue(props.data);
    }

    useEffect(() => {
        form.resetFields();
        let _s = props.column.filter(item => item.formType !== EpsFormType.None);
        setSource(_s);
        // SetModalWidth((parseInt(_s.length / 6)+1) * 500)
    }, [])


    return (
        <>
            <Tooltip title="复制">
                <Button size="small" style={{fontSize: '12px'}} type="primary" shape="circle" icon={<CopyOutlined /> } onClick={showModal}/>
            </Tooltip>
            <Modal
                title={props.title}
                centered
                visible={visible}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            props.store.save(values).then(res => {
                                message.success('数据添加成功');
                                props.store.findByKey(props.store.key);
                                setVisible(false);
                                form.resetFields();
                            }).catch(err => {
                                message.error(err)
                            })
                        })
                        .catch(info => {
                            message.error('数据添加失败,' + info)
                        })
                }
                }
                onCancel={() => setVisible(false)}
                width={450}
            >
                <EpsForm source={source} form={form} data={props.data} customForm={props.customForm}></EpsForm>
            </Modal>
        </>
    );
}

export default CopyOrg;
