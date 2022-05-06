import React, { useEffect, useState } from 'react';
import { Input, message, Form, Tooltip, Modal, Button, Select, Switch, Col, Row } from 'antd';
import SysStore from '../../../stores/system/SysStore';
import { ToolTwoTone } from "@ant-design/icons";
import { observer, useLocalObservable } from "mobx-react";
import 'antd/dist/antd.css';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import CqbcDakService from './service/CqbcDakService';
import { thisTypeAnnotation } from '@babel/types';

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
        allDakMata:[],
        ftpMata:[],
        alljkMata:[],
        async queryMbList() {
            const response = await fetch.get(`/api/eps/control/main/mb/queryForPage`);
            if (response.status === 200) {
                if (response.data.length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
                        let newKey = {};
                        newKey = response.data[i];
                        newKey.key = newKey.id
                        newKey.value = newKey.id
                        newKey.id    = newKey.id
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
                        newKey.id    = newKey.id
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
        async mbChange() {

            const response = await fetch.get(`/api/eps/control/main/dak/queryForList?dwsid=${props.record.dw}`);
            if (response.status === 200) {
                if (response.data.length > 0) {
                    let  SxData = response.data.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.id }));
                    this.allDakMata=SxData;
                }
                return;
            }
        },
        async queryFtpList() {
            const response = await fetch.get(`/api/eps/wdgl/ftphttp/queryForList?uplx=2`);
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
    const [dakDatalist, setdakDatalist]= useState<Array<{id:string;label:string;value:string}>>([]);


     //点击后弹出页面
     const click = () => {
        form.resetFields();
        dakStore.queryMbID();
        dakStore.queryMbList();
        dakStore.queryMbDwList();
        dakStore.mbChange();
        dakStore.queryFtpList();
        //显示弹框页面
        setAddVisible(true);
    }
    //初始化加载数据
    useEffect(() => {
        form.resetFields();
        dakStore.queryMbList();
        dakStore.queryMbDwList();
        dakStore.queryMbID();
        dakStore.mbChange();
        dakStore.queryFtpList();
    }, [])


    const updateFunction = async (values) => {
        CqbcDakService.updateDak(values).then(res => {
            message.success('长期保存档案库修改成功')
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
    const span = 12;



    return (
        <>
            <Tooltip title="修改长期保存档案库">
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
                            values['dw'] = props.record.dw;
                            values['whrid'] = SysStore.getCurrentUser().id;
                            updateFunction(values);
                        })
                        .catch(info => {
                            message.success('档案库修改失败', info)
                        });
                }}
                onCancel={() => setAddVisible(false)}
                width="550px"

                style={{ height: 60 }}>

                <Form labelCol={{ span: 8 }} form={form} className="schedule-form" name="shForm" >
                    <FormItem label="模板:" name="mbid" required {...mbConfig} initialValue={dakStore.DakData.mbid}>
                        <Select
                            style={{ width: 250 }}
                            options={dakStore.allMbData}
                            disabled
                        />
                    </FormItem>
                    <FormItem label="对应档案:" name="dydakid" required {...dydakConfig} initialValue={dakStore.DakData.dydakid}>
                        <Select
                            style={{ width: 250 }}
                            placeholder="请选择模板"
                            options={dakStore.allDakMata}
                            disabled
                        />
                    </FormItem>
                    <FormItem label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]} initialValue={dakStore.DakData.mc}>
                        <Input style={{ width: '250px' }} />
                    </FormItem>

                    <FormItem label="编码:" name="bh" required rules={[{ required: true, message: '请输入编码' }]} initialValue={dakStore.DakData.bh}>
                        <Input style={{ width: '250px' }} />
                    </FormItem>
                    <FormItem label="序号:" name="xh" initialValue={dakStore.DakData.xh}>
                        <Input style={{ width: '250px' }} disabled />
                    </FormItem>
                    <FormItem label="物理表:" name="mbc" initialValue={dakStore.DakData.mbc}>
                        <Input style={{ width: '250px' }} disabled />
                    </FormItem>
                    <FormItem label="条目数:" name="tms" initialValue={dakStore.DakData.tms}>
                        <Input style={{ width: '250px' }} />
                    </FormItem>
                    <FormItem label="FTP:" name="ftp" initialValue={dakStore.DakData.ftp}>
                    <Select
                            style={{ width: 250 }}
                            placeholder="请选择FTP"
                            options={dakStore.ftpMata}
                        />
                    </FormItem>
                    <FormItem label="维护人:" name="whr" initialValue={dakStore.DakData.whr}>
                        <Input disabled style={{ width: '250px' }} />
                    </FormItem>
                    <FormItem label="维护时间:" name="whsj" initialValue={dakStore.DakData.whsj}>
                        <Input disabled style={{ width: '250px' }} />
                    </FormItem>
                </Form>

            </Modal>
        </>
    )
});

export default updateDak
