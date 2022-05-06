import React, { useEffect, useState } from 'react';
import { message, Tooltip, Modal, Button, Card, Steps, Form, Row, Col, Input, Select, Divider, TreeSelect, Checkbox, DatePicker, Upload } from 'antd';
import { LoadingOutlined, FileSearchOutlined, UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { observer, useLocalObservable } from "mobx-react";
import SysStore from '../../../stores/system/SysStore';
import './index.less';
import fetch from "../../../utils/fetch";
import moment from 'moment';
const { Step } = Steps;
const FormItem = Form.Item;

const dshyw = observer((props) => {
    const [cxdagcdform] = Form.useForm();
    const [visible, setVisible] = useState(false)
    const [sqxxqrvisible, setSqxxqrvisible] = useState(false)
    const [step, setStep] = useState(0);
    const [ddisable, setDdisable] = useState(false);
    const [jdsj, setJdsj] = useState();
    const [sftgfyjchecked, setSftgfyjchecked] = useState(false);
    const [sfcjdazmschecked, setSfcjdazmschecked] = useState(false);
    const [sfbylychecked, setSfbylychecked] = useState(false);
    const [sfwzdsxdachecked, setSfwzdsxdachecked] = useState(false);
    const [sfupload, setSfupload] = useState(true);
    const DshywStore = useLocalObservable(() => (
        {
            cdgdata: {},
            cdata: {},
            async saveData(values) {
                const { ...v } = this.cdgdata;
                this.cdgdata = { ...v, ...values };
                console.log(this.cdata)
            },
            async getData(id) {
                const res = await fetch.get("/api/eps/e9msdaly/lasqd/" + id);
                if (res.status == 200) {
                    const data = res.data;
                    if (!data) {
                        message.error("该受理单不存在！");
                    } else {
                        setVisible(true);
                        this.cdgdata = data;
                        this.cdata = data;
                        cxdagcdform.setFieldsValue(data)
                        setDdisable(data.status != 3);
                        setJdsj(moment(data.jdsj).format('YYYY-MM-DD HH:mm:ss'))
                        debugger
                        if (data.hasOwnProperty('ftpid')) {
                            setSfupload(false)
                        }
                    }
                }
            },
            async downloadPackage(id) {
                debugger
                return await fetch.post('/api/eps/e9msdaly/lasqd/downloadPackage', { id: id }, { responseType: 'blob' });
            },

        }
    ));
    // 点击后初始化页面
    const click = () => {
        DshywStore.getData(props.record.id);
        cxdagcdform.setFieldsValue({ "cdgtel": SysStore.getCurrentUser().sjh, "cdglxr": SysStore.getCurrentUser().yhmc });
    }
    // 初始化加载数据
    useEffect(() => {
    }, [])
    const handleDshywCancel = () => {
        setVisible(false);
    };
    const onFinish = (values: any) => {
        // setStep(step + 1);
        debugger
        if (!DshywStore.cdgdata.hasOwnProperty('sftgfyj') && !DshywStore.cdgdata.hasOwnProperty('sfcjzms')
            && !DshywStore.cdgdata.hasOwnProperty('byly') && !DshywStore.cdgdata.hasOwnProperty('wzdda')) {
            //if(DshywStore.cdgdata.sftgfyj===null||DshywStore.cdgdata.sfcjzms===null||DshywStore.cdgdata.byly===null||DshywStore.cdgdata.wzdda===null){
            message.warning('当前未办理结果，请办理！', 1.5);
            // }
        } else {
            DshywStore.cdgdata["status"] = 4;
            DshywStore.cdgdata["cdjssj"] = DshywStore.cdgdata.cdjssj.format("YYYY-MM-DD HH:mm:ss");
            if (DshywStore.cdgdata.wzdda === "Y") {
                DshywStore.cdgdata["comple"] = 3;//未找到档案也要结束当前记录
                fetch.post(`/api/eps/e9msdaly/lasqd/repeat/${DshywStore.cdgdata.id}`, DshywStore.cdgdata).then(response => {
                    if (response.status === 201) {
                        setDdisable(true);
                        message.info('提交受理馆成功！', 1.5);
                        setVisible(false);
                        props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
                    } else {
                        message.error(response.statusText);
                    }
                });
            } else {
                fetch.put(`/api/eps/e9msdaly/lasqd/${DshywStore.cdgdata.id}`, DshywStore.cdgdata).then(response => {
                    if (response.status === 200) {
                        setDdisable(true);
                        message.info('提交受理馆成功！', 1.5);
                        setVisible(false);
                        props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
                    } else {
                        message.error(response.statusText);
                    }
                });
            }
        }
    };
    const onPrint = () => {
        setSqxxqrvisible(true);
    }
    const handleViewSqxxqrCancel = () => {
        setSqxxqrvisible(false);
    };
    const doSqxxqrPrint = () => {
        //'dialogWidth:200mm;dialogHeight:297mm;innerHeight:297mm;innerWidthL200mm;edge:Raised;center:yes;help:no;resizable:no;status:no;scroll:no'
        const sqxxqrPrintDiv = document.getElementById('sqxxqrPrint');
        const iframe = document.createElement('IFRAME');
        let doc = null;
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:500px;top:500px;');
        document.body.appendChild(iframe);

        doc = iframe.contentWindow.document;
        // 打印时去掉页眉页脚
        doc.write('<style media="print">@page {size: auto;  margin: 0mm; }</style>');

        doc.write(sqxxqrPrintDiv.innerHTML);
        doc.close();
        // 获取iframe的焦点，从iframe开始打印
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            //打印完删除iframe
            document.body.removeChild(iframe);
        }
    };
    const onSftgfyjChange = (e) => {
        if (e.target.checked) {
            setSftgfyjchecked(true)
            cxdagcdform.setFieldsValue({ "sftgfyj": "Y", "fyfs": null, "bylyly": null, "wzdyy": null, "byly": null, "sfcjzms": null, "wzdda": null });
        } else {
            setSftgfyjchecked(false)
            cxdagcdform.setFieldsValue({ "sftgfyj": "N", "fyfs": null, "bylyly": null, "wzdyy": null, "byly": null, "sfcjzms": null, "wzdda": null });
        }
        setSfcjdazmschecked(false)
        setSfbylychecked(false)
        setSfwzdsxdachecked(false)
    }
    const onSfcjdazmsChange = (e) => {
        if (e.target.checked) {
            setSfcjdazmschecked(true)
            cxdagcdform.setFieldsValue({ "sfcjzms": "Y", "fyfs": null, "bylyly": null, "wzdyy": null, "byly": null, "sftgfyj": null, "wzdda": null });
        } else {
            setSfcjdazmschecked(false)
            cxdagcdform.setFieldsValue({ "sfcjzms": "N", "fyfs": null, "bylyly": null, "wzdyy": null, "byly": null, "sftgfyj": null, "wzdda": null });
        }
        setSftgfyjchecked(false)
        setSfbylychecked(false)
        setSfwzdsxdachecked(false)
    }
    const onSfbylyChange = (e) => {
        debugger
        console.log(`checked = ${e.target.checked}`);
        if (e.target.checked) {
            setSfbylychecked(true)
            cxdagcdform.setFieldsValue({ "byly": "Y", "fyfs": null, "bylyly": null, "wzdyy": null, "sfcjzms": null, "sftgfyj": null, "wzdda": null });
        } else {
            setSfbylychecked(false)
            cxdagcdform.setFieldsValue({ "byly": "N", "fyfs": null, "bylyly": null, "wzdyy": null, "sfcjzms": null, "sftgfyj": null, "wzdda": null });
        }
        setSftgfyjchecked(false)
        setSfcjdazmschecked(false)
        setSfwzdsxdachecked(false)
    }
    const onSfwzdsxdaChange = (e) => {
        debugger
        console.log(`checked = ${e.target.checked}`);
        if (e.target.checked) {
            setSfwzdsxdachecked(true)
            cxdagcdform.setFieldsValue({ "wzdda": "Y", "fyfs": null, "bylyly": null, "wzdyy": null, "sfcjzms": null, "sftgfyj": null, "byly": null });
        } else {
            setSfwzdsxdachecked(false)
            cxdagcdform.setFieldsValue({ "wzdda": "N", "fyfs": null, "bylyly": null, "wzdyy": null, "sfcjzms": null, "sftgfyj": null, "byly": null });
        }
        setSftgfyjchecked(false)
        setSfcjdazmschecked(false)
        setSfbylychecked(false)
    }
    const onChange = (info) => {
        debugger
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功.`);
            setSfupload(false)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败.`);
        }
        DshywStore.getData(props.record.id);
    }
    //下载申请包点击事件
    const downLoadOnClick = () => {
        const id = props.record.id;
        // const params = { id: id, packetfilepath: record.packetfilepath };
        DshywStore.downloadPackage(id).then((res) => {
            debugger
            if (res && res.status === 200) {
                debugger
                const type = res.headers['content-type'] && 'application/octet-stream';
                debugger
                const blob = new Blob([res.data], { type });
                const url = window.URL.createObjectURL(blob);
                const aLink = document.createElement('a');
                aLink.style.display = 'none';
                aLink.href = url;
                const disposition = res.headers["content-disposition"];
                debugger
                const startIndex = disposition.indexOf("filename=")
                const filename = disposition.substring(startIndex + 9);
                debugger
                aLink.setAttribute('download', decodeURIComponent("SQB_" + filename));
                document.body.appendChild(aLink);
                aLink.click();
                document.body.removeChild(aLink);
                window.URL.revokeObjectURL(url);

                message.success("下载成功");
            } else {
                message.error("下载失败");
            }
        });
    }
    const renderCxdagcd = () => {
        return (
            < >
                <Form
                    labelAlign="left"
                    form={cxdagcdform}
                    onFinish={onFinish}
                >
                    <Row>
                        <Card style={{ width: '100%' }}>
                            <Col span={24}>
                                <Card title="查档线索" extra={ <Button icon={<DownloadOutlined />} type="primary" style={{ margin: '0px 10px 0px 10px' }} onClick={downLoadOnClick}>下载申请包</Button>}  style={{ width: '100%' }}>
                                    {DshywStore.cdgdata.dalxmc === "婚姻档案" && (<><Row >
                                        <Col span={12}>
                                            <FormItem label="男方姓名：" name="mfxm">
                                                <Input disabled={true} style={{ width: 300 }} />
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label="男方出生年月：" name="mfcsrq">
                                                <Input style={{ width: 300 }} disabled={true} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                        <Row >
                                            <Col span={12}>
                                                <FormItem label="女方姓名：" name="wfxm">
                                                    <Input disabled={true} style={{ width: 300 }} />
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="女方出生年月：" name="wfcsrq">
                                                    <Input style={{ width: 300 }} disabled={true} />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </>)}
                                    <Row >
                                        <Col span={24}>
                                            <FormItem label="其他查档线索:" name="cdxs" >
                                                <Input.TextArea showCount maxLength={500} style={{ height: '20px', width: '100%' }} disabled={true} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card title="办理结果" style={{ width: '100%' }}>
                                    <Row >
                                        <Col span={12}>
                                            <FormItem name="sftgfyj">
                                                <Checkbox checked={sftgfyjchecked} onChange={onSftgfyjChange}>提供档案全文复印件</Checkbox>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col span={12}>
                                            <FormItem label="复印页数：" name="fyfs" required={sftgfyjchecked} rules={[{ required: sftgfyjchecked, message: '请输入复印页数' }]}>
                                                <Input allowClear style={{ width: 300 }} placeholder="复印多少页" disabled={!sftgfyjchecked} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <Row >
                                        <Col span={12}>
                                            <FormItem name="sfcjzms" >
                                                <Checkbox checked={sfcjdazmschecked} onChange={onSfcjdazmsChange}>出具档案证明书</Checkbox>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <Row >
                                        <Col span={12}>
                                            <FormItem name="byly">
                                                <Checkbox checked={sfbylychecked} onChange={onSfbylyChange}>不予利用</Checkbox>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col span={24}>
                                            <FormItem label="不予利用理由：" name="bylyly" required={sfbylychecked} rules={[{ required: sfbylychecked, message: '请输入不予利用理由' }]}>
                                                <Input.TextArea allowClear showCount maxLength={500} style={{ height: '20px', width: '100%' }} disabled={!sfbylychecked} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <Row >
                                        <Col span={12}>
                                            <FormItem name="wzdda">
                                                <Checkbox checked={sfwzdsxdachecked} onChange={onSfwzdsxdaChange}>未找到所需档案</Checkbox>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col span={24}>
                                            <FormItem label="未找到原因：" name="wzdyy" required={sfwzdsxdachecked} rules={[{ required: sfwzdsxdachecked, message: '请输入未找到原因' }]}>
                                                <Input.TextArea allowClear showCount maxLength={500} style={{ height: '20px', width: '100%' }} disabled={!sfwzdsxdachecked} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card title="查档档案馆信息" style={{ width: '100%' }}>
                                    <Row >
                                        <Col span={12}>
                                            <FormItem required label="查档档案馆名称：" name="cdgmc" rules={[{ required: true, message: '请输入查档档案馆名称' }]}>
                                                <Input allowClear style={{ width: 300 }} placeholder="查档档案馆名称" disabled={true} />
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label="查档档案馆传真电话：" name="cdgtax" >
                                                <Input allowClear style={{ width: 300 }} placeholder="查档档案馆传真电话" disabled={ddisable} />
                                            </FormItem>
                                        </Col>

                                    </Row>
                                    <Row >
                                        <Col span={12}>
                                            <FormItem required label="&emsp;工作人员姓名：" name="cdglxr" rules={[{ required: true, message: '请输入工作人员姓名' }]}>
                                                <Input allowClear style={{ width: 300 }} placeholder="工作人员姓名" disabled={ddisable} />
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem required label="&emsp; 联&emsp;系&emsp;电&emsp;话&emsp;：" name="cdgtel" rules={[{ required: true, message: '请输入联系电话' }]}>
                                                <Input allowClear style={{ width: 300 }} placeholder="联系电话" disabled={ddisable} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col span={12}>
                                            <FormItem required label="&emsp;查档开始时间：" name="cdkssj" >
                                                <Input disabled={true} style={{ width: 300 }} />
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem required label="&emsp;查 档 结 束 时 间&emsp;：" name="cdjssj" rules={[{ required: true, message: '请输入查档结束时间' }]} >
                                                <DatePicker showTime style={{ width: 300 }} format="YYYY-MM-DD HH:mm:ss" />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card title="受理档案馆信息" style={{ width: '100%' }}>
                                    <Row >
                                        <Col span={12}>
                                            <FormItem label="受理档案馆：" name="sldagmc">
                                                <Input disabled={true} style={{ width: 300 }} />
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label="受理人：" name="jdr">
                                                <Input style={{ width: 300 }} disabled={true} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col span={12}>
                                            <FormItem label="&emsp;联系电话：" name="sldagtel">
                                                <Input disabled={true} style={{ width: 300 }} />
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label="受理时间：" name="jdsj">
                                                <Input disabled={true} style={{ width: 300 }} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card title="利用者信息" style={{ width: '100%' }}>
                                    <Row >
                                        <Col span={12}>
                                            <FormItem label="利用者姓名：" name="lyzxm">
                                                <Input disabled={true} style={{ width: 300 }} />
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label="联系电话：" name="lyzdh">
                                                <Input style={{ width: 300 }} disabled={true} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col span={12}>
                                            <FormItem label="&emsp;证件号码：" name="zjhm">
                                                <Input disabled={true} style={{ width: 300 }} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col >
                            {sfupload && (<Col span={24} style={{ textAlign: 'center' }}>
                                {(!sfbylychecked && !sfwzdsxdachecked) &&
                                    (<>
                                        <Upload action="/api/eps/e9msdaly/lasqd/uploadfile" onChange={onChange}
                                            showUploadList={false}
                                            accept=".zip" data={{ 'sqdid': props.record.id, 'scrid': SysStore.getCurrentUser().id, 'scrmc': SysStore.getCurrentUser().yhmc }}
                                            multiple listType="text">
                                            <br />
                                            <Button icon={<UploadOutlined />} type="primary" style={{ margin: '0px 10px 0px 10px' }}>上传查档结果</Button>
                                        </Upload>

                                    </>
                                    )}
                            </Col >)}

                        </Card>
                        <Col span={24} style={{ padding: '10px' }}>
                            <Button.Group style={{ float: 'right' }}>
                                <Button type="primary" onClick={onPrint}>申请打印</Button >
                                {DshywStore.cdgdata.status === 3 && (<Form.Item>
                                    <Button type="primary" htmlType="submit" onClick={doSaveData}>提交受理档案馆处理</Button>
                                </Form.Item>)
                                }
                            </Button.Group>
                        </Col >
                    </Row>
                </Form>
            </>
        )
    }
    const doSaveData = () => {
        switch (step) {
            case 0:
                cxdagcdform.validateFields().then(values => {
                    const entity = {};
                    const { entries } = Object;
                    entries(values).forEach(([key, value]) => {
                        if (value) {
                            entity[key] = value;
                        }
                    })
                    DshywStore.saveData(entity);
                })
                break;
        }
    }
    return (
        <>
            <Tooltip title="待审核">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<FileSearchOutlined />} onClick={event => {
                    event.nativeEvent.stopImmediatePropagation()
                    event.stopPropagation()
                    click()
                }} />
            </Tooltip>
            <Modal title={<span className="m-title">查档档案馆待审核业务步骤</span>}
                visible={visible}
                onCancel={event => {
                    event.nativeEvent.stopImmediatePropagation()
                    event.stopPropagation()
                    handleDshywCancel()
                }}
                footer={null}
                style={{ paddingLeft: '24px 0', paddingRight: '24px 0', paddingTop: '24px 0' }}
                width="70%">
                <div className="hall-regist" >
                    <div className="editform">
                        <Steps current={step}>
                            <Step title="查档档案馆查档" key={0} />
                            <Step title="待受理档案馆处理" key={1} icon={DshywStore.cdgdata.status === 4 && (<LoadingOutlined />)} />
                            <Step title="完成" key={6} />
                        </Steps>
                        <div className="editContext">
                            <Card style={{ width: '100%', height: '100%' }}>
                                {step === 0 && renderCxdagcd()}
                            </Card>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal title={<span className="m-title">民生档案“异地查档、便民服务”申请表</span>}
                visible={sqxxqrvisible}
                onCancel={event => {
                    event.nativeEvent.stopImmediatePropagation()
                    event.stopPropagation()
                    handleViewSqxxqrCancel()
                }}
                footer={null}
                style={{ paddingLeft: '24px 0', paddingRight: '24px 0', paddingTop: '24px 0' }}
                width="60%">
                <Row>
                    <Card style={{ width: '100%' }}>
                        <Row >
                            <Col span={24} style={{ margin: '0 auto' }}>
                                <div id="sqxxqrPrint">
                                    <div align="center">
                                        <h1>
                                            <font face="verdana">民生档案“异地查档、便民服务”</font>
                                        </h1>
                                        <h1>
                                            <font face="verdana">申请表</font>
                                        </h1>
                                        <pre>                      {moment(jdsj).format('YYYY')}年{moment(jdsj).format('MM')}月{moment(jdsj).format('DD')}日 ● 编号:{DshywStore.cdata.id}</pre>
                                        <table border="1px" cellspacing="0px" style={{ width: '100%' }}>
                                            <tr>
                                                <td style={{ width: '20%', textAlign: 'center' }}>
                                                    <b>利用者姓名</b>
                                                </td>
                                                <td style={{ width: '30%' }}>
                                                    {DshywStore.cdata.lyzxm}
                                                </td>
                                                <td style={{ width: '20%', textAlign: 'center' }}>
                                                    <b>联系电话</b>
                                                </td>
                                                <td style={{ width: '30%' }}>
                                                    {DshywStore.cdata.lyzdh}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <b>证件类型</b>
                                                </td>
                                                <td>
                                                    <pre>
                                                        {DshywStore.cdata.zjlx === '01' ? <span>√</span> : <span>□</span>} 居民身份证<br />
                                                        {DshywStore.cdata.zjlx === '02' ? <span>√</span> : <span>□</span>} 军官证<br />
                                                        {DshywStore.cdata.zjlx === '99' ? <span>√</span> : <span>□</span>} 其他<br />
                                                    </pre>
                                                </td>
                                                <td style={{ textAlign: 'center' }}> <b>证件号码</b> </td>
                                                <td>
                                                    {DshywStore.cdata.zjhm}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <b>利用目的</b>
                                                </td>
                                                <td> {DshywStore.cdata.lymd}</td>
                                                <td style={{ textAlign: 'center' }}><b>档案种类</b></td>
                                                <td>
                                                    {DshywStore.cdata.dalxmc}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <b>查档线索</b>
                                                </td>
                                                <td colSpan={3}>
                                                    <pre>
                                                        档案记载的                     保管档案的档案馆<br />
                                                        当事人姓名：                     (查档档案馆)名称：{DshywStore.cdata.cdgmc}}<br />



                                                        其他查档内容:
                                                    </pre>
                                                </td>

                                            </tr>
                                            <tr>
                                                <td rowSpan={2} style={{ textAlign: 'center' }}>
                                                    <b >档案送交方式</b>
                                                </td>
                                                <td colSpan={3}>
                                                    <pre>
                                                        {DshywStore.cdata.czfs === '01' ? <span>√</span> : <span>□</span>} 邮寄： {DshywStore.cdata.yjfs === '01' ? <span>●</span> : <span>○</span>} EMS(到付自费)  {DshywStore.cdata.yjfs === '02' ? <span>●</span> : <span>○</span>}挂号(免邮费)
                                                        <br />
                                                        &emsp;&emsp;告知：1、为便于利用者及时收到所需档案材料，利用者应当如实提供确切的地址。<br />
                                                        &emsp;&emsp;&emsp;&emsp; 2、如果送达地址有变更，利用者应当及时书面告知受理点。若因提供的地址不确<br />
                                                        &emsp;&emsp;&emsp;&emsp; 切，或不及时告知变更后的地址，使档案无法及时送达，利用者自行承担后果。<br />
                                                        <br />
                                                        &emsp;收 件 人：{DshywStore.cdata.sjr}  邮政编码：{DshywStore.cdata.yzbm}<br />
                                                        <br />
                                                        &emsp;邮寄地址:{DshywStore.cdata.yjdz}
                                                    </pre>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3}>
                                                    <pre>
                                                        {DshywStore.cdata.czfs === '02' ? <span>√</span> : <span>□</span>}上门领取 请核对联系电话准确无误。
                                                    </pre>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <b>告知承诺</b>
                                                </td>
                                                <td colSpan={3}>
                                                    <pre>
                                                        请利用者仔细阅读下文并签名:<br />
                                                        &emsp;&emsp;1.异地查档申请和档案材料传输过程有可能造成个人信息泄露风险。<br />
                                                        &emsp;&emsp;2.本申请表适用于公民异地查询利用记载本人信息的民生档案，不能申请利用<br />
                                                        &emsp;&emsp;其他公民或组织的档案。<br />
                                                        &emsp;&emsp;3.利用者承诺提供的身份证件真实有效。<br />
                                                        &emsp;&emsp;4.是否准予复制档案及可复制档案的内容、数量，由查档档案馆决定。<br />
                                                        &emsp;&emsp;5.本次复制的档案及其相关信息仅供利用者陈述之查档目的;未经查档档案馆<br />
                                                        &emsp;&emsp;同意,不得擅自向社会公布。<br />
                                                        &emsp;&emsp;6.不得利用上述档案材料及其相关内容从事法律法规禁止的行为。<br />
                                                        &emsp;&emsp;本人承诺遵守上述内容。<br />
                                                        <b>&emsp;&emsp;利用者签名：       日期：   </b>
                                                    </pre>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} style={{ backgroundColor: '#6A4313', textAlign: 'center' }}>
                                                    <font color="#FFFFFF">以下由受理档案馆
                                                        工作人员填写</font>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <b>是否受理</b>
                                                </td>
                                                <td>
                                                    <pre>{DshywStore.cdata.sfsl === 'Y' ? <span>√</span> : <span>□</span>}予以受理<br />
                                                        {DshywStore.cdata.sfsl !== 'Y' ? <span>√</span> : <span>□</span>}不予受理，理由：<br />
                                                        {DshywStore.cdata.bslyy}
                                                    </pre>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <b>受理签章</b>
                                                </td>
                                                <td>
                                                    <pre>
                                                        （盖章处）<br />
                                                        <br />
                                                        <br />
                                                        <br />
                                                        受理人员签名：
                                                    </pre>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <b>受理档案馆及工作人员信息</b>
                                                </td>
                                                <td >
                                                    <pre>
                                                        {DshywStore.cdata.sldagmc}，工作人员{DshywStore.cdata.jdr}<br />
                                                        电话号码：({DshywStore.cdata.sldagtel})，传真号：({DshywStore.cdata.sldagtax})
                                                    </pre>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </Col>
                            <Col span={24} style={{ padding: '10px' }}>
                                <Button type="primary" onClick={doSqxxqrPrint} style={{ float: 'right' }}>
                                    打印
                                </Button >
                            </Col >
                        </Row>
                    </Card>
                </Row>
            </Modal>
        </>
    )
});

export default dshyw
