import React, { useEffect, useState } from 'react';
import { Input, message, Form, Tooltip, Modal, Button, Select, Switch, Col, Row } from 'antd';
import SysStore from '../../../stores/system/SysStore';
import { PlusCircleTwoTone } from "@ant-design/icons";
import { observer, useLocalObservable } from "mobx-react";
import 'antd/dist/antd.css';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import CqbcDakService from './service/CqbcDakService';

const addDak = observer((props) => {
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
            allMbData: [],
            dakData:[],
            ftpMata:[],
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
            async queryFtpList() {
                const response = await fetch.get(`/api/eps/wdgl/ftphttp/queryForList`);
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        let  SxData = response.data.map(o => ({ 'id': o.id, 'label': o.name, 'value': o.id }));
                        this.ftpMata=SxData;
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
        dakStore.queryFtpList();
    }, [])

    const [dakDatalist, setdakDatalist]= useState<Array<{id:string;label:string;value:string}>>([]);
    const mbChange = async (record: any) => {

        const response = await fetch.get(`/api/eps/control/main/dak/queryNotByDw?dwid=${props.record.dw}&mbid=${record}`);
        if (response.status === 200) {
            if (response.data.length > 0) {
                let  SxData = response.data.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.id }));
                setdakDatalist(SxData);
            }

        }
    }

    const addFunction = async (values) => {
        CqbcDakService.addDak(values).then(res => {
            message.success('长期保存档案库添加成功')
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
            setAddVisible(false);
        })
    }

    const mbConfig = {
        rules: [{ required: true, message: '请选择模版' }],
    };

    const dydakConfig = {
        rules: [{ required: true, message: '请选择对应档案库' }],
    };
    return (
        <>
            <Tooltip title="新建档案库">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<PlusCircleTwoTone />} onClick={() => click()} />
            </Tooltip>
            <Modal title={<span className="m-title">新建档案库</span>}
                visible={add_visible}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            values['dw'] = props.record.dw;;
                            values['whrid'] = SysStore.getCurrentUser().id;
                            values['fid'] = props.record.id;//传递父ID
                            addFunction(values);
                        })
                        .catch(info => {

                        });
                }}
                onCancel={() => setAddVisible(false)}
                width="550px"

                style={{ height: 60 }}>

                <Form labelCol={{ span: 8 }} form={form} className="schedule-form" name="shForm" initialValues={{}}>
                    <FormItem label="模板:" name="mbid" required {...mbConfig}>
                        <Select
                            style={{ width: 300 }}
                            placeholder="请选择模板"
                            options={dakStore.allMbData}  onChange={mbChange}
                        />
                    </FormItem>
                    <FormItem label="对应档案:" name="dydakid" required {...dydakConfig}>
                        <Select
                            style={{ width: 300 }}
                            placeholder="请选择对应档案库"
                            options={dakDatalist}
                        />
                    </FormItem>
                    <FormItem label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]}>
                        <Input style={{ width: '300px' }} />
                    </FormItem>

                    <FormItem label="编码:" name="bh" required rules={[{ required: true, message: '请输入编码' }]}>
                        <Input style={{ width: '300px' }} />
                    </FormItem>
                    <FormItem label="序号:" name="xh" >
                        <Input style={{ width: '300px' }} disabled />
                    </FormItem>
                    <FormItem label="物理表:" name="wlb" >
                        <Input style={{ width: '300px' }} disabled />
                    </FormItem>
                    <FormItem label="条目数:" name="tms" initialValue={"50"}>
                        <Input style={{ width: '300px' }} />
                    </FormItem>
                    <FormItem label="FTP:" name="ftp" initialValue={dakStore.DakData.ftp}>
                    <Select
                            style={{ width: 250 }}
                            placeholder="请选择FTP"
                            options={dakStore.ftpMata}
                        />
                    </FormItem>
                    <FormItem label="维护人:" name="whr" initialValue={SysStore.getCurrentUser().yhmc}>
                        <Input disabled style={{ width: '300px' }} />
                    </FormItem>
                    <FormItem label="维护时间:" name="whsj" initialValue={getDate}>
                        <Input disabled style={{ width: '300px' }} />
                    </FormItem>
                </Form>

            </Modal>
        </>
    )
});

export default addDak
