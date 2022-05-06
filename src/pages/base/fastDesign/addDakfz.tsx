import React, { useEffect, useState } from 'react';
import { Input, message, Form, Tooltip, Modal, Button } from 'antd';

import SysStore from '../../../stores/system/SysStore';
import { FolderAddTwoTone } from "@ant-design/icons";
import { observer, useLocalObservable } from "mobx-react";
import 'antd/dist/antd.css';

import moment from 'moment';

import CqbcDakService from './service/CqbcDakService';

const addDakfz = observer((props) => {
    const FormItem = Form.Item;
    const [form] = Form.useForm();
    /**
 * 获取当前时间
 */
    const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const [add_visible, setAddVisible] = useState(false)
    //点击后初始化用户角色页面
    const click = () => {
        //显示弹框页面
        setAddVisible(true);
    }
    //初始化加载数据
    useEffect(() => {
        form.resetFields();
        // RoleStore.queryTreeDwList();
    }, [])


    const addFunction = async (values) => {
        CqbcDakService.addDakFz(values).then(res => {
            message.success('长期保存档案库分组添加成功')
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
            setAddVisible(false);
        })
    }

    return (
        <>
            <Tooltip title="新建档案库分组">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<FolderAddTwoTone />} onClick={() => click()} />
            </Tooltip>
            <Modal title={<span className="m-title">新建档案库分组</span>}
                visible={add_visible}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            values['id'] = props.record.id;
                            values['key'] = props.record.id;
                            values['dw'] = props.record.dw;
                            values['whr'] = SysStore.getCurrentUser().yhmc;
                            values['whrid'] = SysStore.getCurrentUser().id;
                            values['whsj'] = getDate;
                            values['lx'] = "FD";
                            values['fid'] = props.record.id;//传递父ID
                            addFunction(values);
                        })
                        .catch(info => {

                        });
                }}
                onCancel={() => setAddVisible(false)}
                width="550px"

                style={{ height: 60 }}>
                <div >
                    <Form labelCol={{ span: 5 }} form={form} className="schedule-form" name="shForm">
                        <FormItem label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]}>
                            <Input style={{ width: '250px' }} />
                        </FormItem>
                        <FormItem label="编码:" name="bh" required rules={[{ required: true, message: '请输入编码' }]}>
                            <Input style={{ width: '250px' }} />
                        </FormItem>
                        <FormItem label="维护人:" name="whr" >
                            <Input defaultValue={SysStore.getCurrentUser().yhmc} disabled style={{ width: '250px' }} />
                        </FormItem>
                        <FormItem label="维护时间:" name="whsj">
                            <Input defaultValue={getDate} disabled style={{ width: '250px' }} />
                        </FormItem>
                    </Form>

                </div>
            </Modal>
        </>
    )
});

export default addDakfz
