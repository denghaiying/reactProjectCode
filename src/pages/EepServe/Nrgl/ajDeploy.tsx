import React, { useEffect, useState } from 'react';
import { Table, message, Form, Tooltip, Modal, Button, Select, Input, TreeSelect } from 'antd';
import SysStore from '../../../stores/system/SysStore';
import { ScheduleOutlined } from "@ant-design/icons";
import { observer, useLocalObservable } from "mobx-react";
import moment from 'moment';
import './index.less'
import fetch from "../../../utils/fetch";

const ajDeploy = observer((props) => {
    const FormItem = Form.Item;
    const [form] = Form.useForm();
    const [ml_visible, setMlVisible] = useState(false)
    const AjDeployStore = useLocalObservable(() => (
        {
            ajdygxdata: {},
            ajmlTreedata: [],
            jnmlTreedata: [],
            opt: "add",
            async findAjdygxByid(params) {
                debugger
                const response = await fetch.get(`/api/eps/e9eep/ajdygx/list/`,params);
                if (response && response.status === 200) {
                    debugger
                    if (response.data.length===1) {
                        this.opt="edit";
                        this.ajdygxdata = response.data[0];
                        form.setFieldsValue(response.data[0])
                    } else {
                        this.opt="add"
                        form.setFieldsValue({ "eepcontentid": props.record.id })
                    }
                }
            },
            async findAjmlTree(params) {
                const response = await fetch.get("/api/eps/e9eep/comxml/getAjmlTree", params);
                if (response && response.status === 200) {
                    this.ajmlTreedata = response.data;
                }
            },
            async findJnmlTree(params) {
                const response = await fetch.get("/api/eps/e9eep/comxml/getJnmlTree", params);
                if (response && response.status === 200) {
                    this.jnmlTreedata = response.data;
                }
            },
            async saveData(values) {
                debugger
                if(AjDeployStore.opt==="add"){
                    const response = await fetch.post("/api/eps/e9eep/ajdygx/", values);
                    if (response && response.status === 201) {
                        message.success("??????????????????");
                        setMlVisible(false);
                    } else {
                        message.error("??????????????????!")
                    }
                }else if(AjDeployStore.opt==="edit"){
                    const response = await fetch.put(`/api/eps/e9eep/ajdygx/${values.id}`, values);
                    if (response && response.status === 200) {
                        message.success("??????????????????");
                        setMlVisible(false);
                    } else {
                        message.error("??????????????????!")
                    }
                }

            },
        }
    ));
    // ????????????????????????
    const click = () => {
        // ??????????????????
        setMlVisible(true);
        AjDeployStore.findAjdygxByid({ params: { eepcontentid: props.record.id} })
        AjDeployStore.findAjmlTree({ params: { comxmlmpid: props.record.id, comxmltype: "2" } });
        AjDeployStore.findJnmlTree({ params: { comxmlmpid: props.record.id, comxmltype: "1" } });
    }
    // ?????????????????????
    useEffect(() => {

    }, [])
    const handlEepjgOk = () => {
        form.validateFields().then(values => {
            const json = {};
            const { entries } = Object;
            entries(values).forEach(([key, value]) => {
                if (value) {
                    json[key] = value;
                }
            });
            debugger
            json.whrid = SysStore.getCurrentUser().id;
            json.whr = SysStore.getCurrentUser().yhmc;
            json.whsj = moment().format('YYYY-MM-DD HH:mm:ss');
            AjDeployStore.saveData(json)
        }
        )
    };

    const handleEepjgCancel = () => {
        setMlVisible(false);
        form.resetFields();
    };
    // ??????XML?????????????????????????????????????????????????????????????????????????????????M???????????????????????????
    const onAjXmlTreeChange = (value, label, extra) => {
        debugger
        const currentXml = extra.triggerNode.props
        form.setFieldsValue({ "ajcomxmlid": currentXml.value, "ajcorritem": currentXml.corritem });
    };
    const onJnXmlTreeChange = (value, label, extra) => {
        debugger
        const currentXml = extra.triggerNode.props
        form.setFieldsValue({ "jncomxmlid": currentXml.value, "jncorritem": currentXml.corritem });
    };
    return (
        <>
            <Tooltip title="??????????????????">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<ScheduleOutlined />} onClick={event => {
                    event.nativeEvent.stopImmediatePropagation()
                    event.stopPropagation()
                    click()
                }} />
            </Tooltip>
            <Modal title={<span className="m-title">?????????????????????????????????</span>}
                visible={ml_visible}
                onOk={event => {
                    event.nativeEvent.stopImmediatePropagation()
                    event.stopPropagation()
                    handlEepjgOk()
                }}
                onCancel={event => {
                    event.nativeEvent.stopImmediatePropagation()
                    event.stopPropagation()
                    handleEepjgCancel()
                }}
                width="450px">
                <div >
                    <Form form={form} component={false}>
                        <Form.Item label="????????????:" name="ajcomxmlid" required rules={[{ required: true, message: '?????????????????????' }]}>
                            <TreeSelect
                                style={{ width: 300 }}
                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                treeData={AjDeployStore.ajmlTreedata}
                                placeholder="?????????????????????"
                                treeDefaultExpandAll
                                onChange={onAjXmlTreeChange}
                            />
                        </Form.Item>
                        <Form.Item label="???????????????:" name="ajcorritem">
                            <Input allowClear style={{ width: 300 }} disabled />
                        </Form.Item>
                        <Form.Item label="????????????:" name="jncomxmlid" required rules={[{ required: true, message: '?????????????????????' }]}>
                            <TreeSelect
                                style={{ width: 300 }}
                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                treeData={AjDeployStore.jnmlTreedata}
                                placeholder="?????????????????????"
                                treeDefaultExpandAll
                                onChange={onJnXmlTreeChange}
                            />
                        </Form.Item>
                        <Form.Item label="???????????????:" name="jncorritem">
                            <Input allowClear style={{ width: 300 }} disabled />
                        </Form.Item>
                        <Form.Item name="eepcontentid" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    )
});

export default ajDeploy
