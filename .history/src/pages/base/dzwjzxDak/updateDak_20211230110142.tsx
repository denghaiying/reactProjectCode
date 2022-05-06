import React, { useEffect, useState } from 'react';
import { Input, message, Form, Tooltip, Modal, Button, Select, Switch, Col, Row } from 'antd';
import SysStore from '../../../stores/system/SysStore';
import { ToolTwoTone } from "@ant-design/icons";
import { observer, useLocalObservable } from "mobx-react";

import fetch from "../../../utils/fetch";
import moment from 'moment';
import DakService from '@/services/base/dak/DakService';

const updateDak = observer((props) => {
    const FormItem = Form.Item;
    const [form] = Form.useForm();

    /**
 * 下拉框选择
 */
    const Option = Select.Option;
    /**
 * 获取当前时间
 */
    const getDate = moment().format('YYYY-MM-DD HH:mm:ss');




    /**
     * childStore
     */
    const dakStore = useLocalObservable(() => (
        {
            DakData: "",
            allMbData: [],
            async queryMbList() {
                const response = await fetch.get(`/api/eps/control/main/mb/queryForPage`);
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            let newKey = {};
                            newKey = response.data[i];
                            newKey.key = newKey.id
                            newKey.value = newKey.id
                            newKey.title = newKey.lable
                            this.allMbData.push(newKey)
                        }
                    }
                    return;
                }
            },

            async queryMbDwList() {
                const response = await fetch.get(`/api/eps/control/main/mb/queryForPage?dwid=${props.record.dw}`);
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            let newKey = {};
                            newKey = response.data[i];
                            newKey.key = newKey.id
                            newKey.value = newKey.id
                            newKey.title = newKey.lable
                            this.allMbData.push(newKey)
                        }
                    }
                    return;
                }
            },

            async queryMbID() {
                const response = await fetch.get(`/api/eps/control/main/dak/queryForId?id=${props.record.id}`);
                if (response.status === 200) {
                    if (response && response.data) {
                        this.DakData = response.data
                    }
                    return;
                }
            },
        }
    ));
    const [add_visible, setAddVisible] = useState(false)
    //点击后弹出页面
    const click = () => {
        //显示弹框页面
        setAddVisible(true);
    }
    //初始化加载数据
    useEffect(() => {
        form.resetFields();
        dakStore.queryMbList();
        dakStore.queryMbDwList();
        dakStore.queryMbID();
    }, [])


    const updateFunction = async (values) => {
        DakService.updateDak(values).then(res => {
            message.success('档案库修改成功')
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
            setAddVisible(false);
        })
    }

    const mbConfig = {
        rules: [{ required: true, message: '请选择模版' }],
    };
    const span = 12;



    return (
        <>
            <Tooltip title="修改档案库">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<ToolTwoTone />} onClick={() => click()} />
            </Tooltip>
            <Modal title={<span className="m-title">修改档案库</span>}
                visible={add_visible}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            values['id'] = props.record.id;
                            values['dw'] = props.record.dw;;
                            values['whrid'] = SysStore.getCurrentUser().id;
                            //values['fid'] = props.record.id;//传递父ID
                            updateFunction(values);
                        })
                        .catch(info => {
                            message.success('档案库修改失败',info)
                        });
                }}
                onCancel={() => setAddVisible(false)}
                width="1000px"

                style={{ height: 60 }}>

                <Form labelCol={{ span: 8 }} form={form} className="schedule-form" name="shForm" >
                    <Row gutter={20}>
                        <Col span={span}>
                            <FormItem label="模板:" name="mbid" required {...mbConfig} initialValue={dakStore.DakData.mbid}>
                                <Select
                                    style={{ width: 250 }}
                                    options={dakStore.allMbData}
                                    disabled
                                />
                            </FormItem>
                        </Col>
                        <Col span={span}>
                            <FormItem label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]} initialValue={dakStore.DakData.mc}>
                                <Input style={{ width: '250px' }} />
                            </FormItem>
                        </Col>

                        <Col span={span}>
                            <FormItem label="编码:" name="bh" required rules={[{ required: true, message: '请输入编码' }]} initialValue={dakStore.DakData.bh}>
                                <Input style={{ width: '250px' }} />
                            </FormItem>
                        </Col>
                        <Col span={span}>
                            <FormItem label="序号:" name="xh" initialValue={dakStore.DakData.xh}>
                                <Input style={{ width: '250px' }} disabled />
                            </FormItem>
                        </Col>
                        <Col span={span}>
                            <FormItem label="物理表:" name="mbc" initialValue={dakStore.DakData.mbc}>
                                <Input style={{ width: '250px' }} disabled />
                            </FormItem>
                        </Col>
                        <Col span={span}>
                            <FormItem label="条目数:" name="tms" initialValue={dakStore.DakData.tms}>
                                <Input style={{ width: '250px' }} />
                            </FormItem>
                        </Col>

                        <Col span={span}>
                            <FormItem label="维护人:" name="whr" initialValue={dakStore.DakData.whr}>
                                <Input disabled style={{ width: '250px' }} />
                            </FormItem>
                        </Col>
                        <Col span={span}>
                            <FormItem label="维护时间:" name="whsj" initialValue={dakStore.DakData.whsj}>
                                <Input disabled style={{ width: '250px' }} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>

            </Modal>
        </>
    )
});

export default updateDak
