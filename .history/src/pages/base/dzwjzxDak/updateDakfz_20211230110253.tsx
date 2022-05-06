import React, { useEffect, useState } from 'react';
import { Input, message, Form, Tooltip, Modal, Button } from 'antd';

import SysStore from '../../../stores/system/SysStore';
import { EditTwoTone } from "@ant-design/icons";
import { observer, useLocalObservable } from "mobx-react";

import moment from 'moment';
import DakService from '@/services/base/dak/DakService';
const updateDakfz = observer((props) => {
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


    const updateFunction = async (values) => {
        DakService.updateDakfz(values).then(res => {
            message.success('电子文件中心档案库分组修改成功')
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
            setAddVisible(false);
        })
    }

    return (
        <>
            <Tooltip title="修改电子文件中心档案库分组">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<EditTwoTone />} onClick={() => click()} />
            </Tooltip>
            <Modal title={<span className="m-title">新建电子文件中心档案库分组</span>}
                visible={add_visible}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            values['id'] = props.record.id;
                            values['key'] = props.record.id;
                            values['dw'] = props.record.dw;;
                            values['whr'] = SysStore.getCurrentUser().yhmc;
                            values['whrid'] = SysStore.getCurrentUser().id;
                            values['whsj'] = getDate;
                            values['lx'] = "DZ";
                            if (props.record.fid != 'undefined') {
                                values['fid'] = props.record.fid;//传递父ID
                            }
                            updateFunction(values);
                        })
                        .catch(info => {

                        });
                }}
                onCancel={() => setAddVisible(false)}
                width="550px"

                style={{ height: 60 }}>
                <div >
                    <Form labelCol={{ span: 5 }} form={form} className="schedule-form" name="shForm">
                        <FormItem label="名称:" name="mc" required rules={[{ required: true, message: '请修改名称' }]} initialValue={props.record.mc}>
                            <Input style={{ width: '250px' }}  />
                        </FormItem>
                        <FormItem label="编码:" name="bh" required rules={[{ required: true, message: '请修改编码' }]} initialValue={props.record.bh}>
                            <Input style={{ width: '250px' }} defaultValue={props.record.bh} />
                        </FormItem>
                        <FormItem label="维护人:" name="whr"  initialValue={SysStore.getCurrentUser().yhmc}>
                            <Input disabled style={{ width: '250px' }} />
                        </FormItem>
                        <FormItem label="维护时间:" name="whsj" initialValue={getDate}>
                            <Input  disabled style={{ width: '250px' }} />
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        </>
    )
});

export default updateDakfz
