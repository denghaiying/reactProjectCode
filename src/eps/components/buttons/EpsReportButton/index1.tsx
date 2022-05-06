import EpsFormType from '@/eps/commons/EpsFormType';
import { ITableService } from '@/eps/commons/panel';
import { FileAddOutlined } from '@ant-design/icons';
import {Button, Form, Modal, message, Input, Checkbox} from 'antd';
import React, { useEffect, useState } from 'react';
import { EpsPanel } from '@/eps/components/buttons/EpsReportButton/panel';
import { Form, Input, Select } from 'antd';
import { EpsTableStore } from '../../panel/EpsPanel';
//import {  ITable } from '@/eps/components/panel/EpsPanel3';
import {EpsProps, EpsSource, ITable, TabData, TableColumn} from "@/eps/commons/declare";import EpsReportStore from "@/stores/system/EpsReportStore";
import EpsReportService from "@/services/system/EpsReportService";
import {Field, Icon, Upload} from "@alifd/next";
import SysStore from "@/stores/system/SysStore";
import YjspStore from "@/stores/dagl/YjspStore";
import Store from "@/stores/system/YhStore";
import copyRole from "@/pages/sys/Role/copyRole";
import roleUser from "@/pages/sys/Role/roleUser";
import EpsEditButton from "@/eps/components/buttons/EpsEditButton";
import EpsDeleteButton from "@/eps/components/buttons/EpsDeleteButton";
const FormItem = Form.Item;


function EpsReportButton( store: EpsTableStore,umid:String) {

    const [visible, setVisible] = useState(false);
    const [modalWidth, SetModalWidth] = useState(900);
    const [defaultChecked,SetDefaultChecked] =useState(false);
    const [publicChecked,SetPublicChecked] =useState(false);

    const { Option } = Select;
    const [form]= Form.useForm();


    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            EpsReportStore.setSelectId(selectedRowKeys);
            EpsReportStore.setSelectedRow(selectedRows[0]);
            console.log("store.selectid====="+EpsReportStore.selectid);
            ;
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };


    const tableProp: ITable = {
        tableSearch: false,
        disableEdit: true,
        disableDelete:true,
        rowSelection: {
            type: 'radio',
            ...rowSelection,
        }
    }

    // useEffect(() => {
    //     // SearchStore.queryDw();
    //     EpsReportStore.queryForPage();
    // }, []);





    const source: EpsSource[] = [
        {
        title: '报表名称',
        code: 'name',
        align: 'center',
        formType: EpsFormType.Input
    },
        {
            title: '报表设计类型',
            code: 'designType',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if(text) {
                    if(text=='1'){
                        return text = 'BS报表';
                    }else if(text=='2'){
                        return text = '插件报表';
                    }else if (text=='3'){
                        return text = '离线报表';
                    }
                }else{
                    return text = "未知";
                }

            }
        },{
            title: "缺省",
            code: 'isdefault',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if(text) {
                    return text == 'N' ? '否' : '是';
                }else{
                    return text = "未知";
                }

            }

        },
        {
            title: "公用",
            code: "ispublic",
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if(text) {
                    return text == 'N' ? '否' : '是';
                }else{
                    return text = "未知";
                }

            }

        },
        {
            title: '维护人',
            code: 'whr',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '维护时间',
            code: 'whsj',
            align: 'center',
            formType: EpsFormType.Input
        }
    ]
    const title = {
        name: 'IP地址管理'
    }

    function onChangeDefault(e) {
        console.log(`checked = ${e.target.checked}`);
        SetDefaultChecked(e.target.checked);
    }


    function onChangePublic(e) {
        console.log(`checked = ${e.target.checked}`);
        SetPublicChecked(e.target.checked);
    }

    function beforeUpload(info) {
        console.log('beforeUpload callback : ', info);
    }

    function onChange(info) {
        console.log('onChange callback : ', info);
    }

    const handlelxChange=(value) =>{
        if(value=="3") {
            EpsReportStore.setUploadstate(false);
        }

    }

    // 自定义表单

    const customForm = () => {
        //自定义表单校验

        return (
            <>
                <Form.Item  label="报表名称:" name="name" required rules={[{ required: true, message: '请输入IP地址' }]}>
                    <Input allowClear />
                </Form.Item>

                <Form.Item label="缺省:" name="isdefault" >
                    <Checkbox checked={defaultChecked} onChange={onChangeDefault} />
                </Form.Item>

                <Form.Item label="公用:" name="ispublic" >
                    <Checkbox checked={publicChecked} onChange={onChangePublic} />
                </Form.Item>
                <Form.Item label="设计类型:" name="designType" >
                    <Select defaultValue="2" style={{ width: 120 }}
                            onChange={handlelxChange}>
                        <Option value="1">BS报表</Option>
                        <Option value="2">插件报表</Option>
                        <Option value="3">离线报表</Option>
                    </Select>
                </Form.Item>
                <Form.Item hidden={EpsReportStore.uploadstate}>
                    <Upload
                        action="/api/eps/control/main/epsreport/upload"
                        beforeUpload={beforeUpload}
                        data={{whr:SysStore.currentUser.yhmc,umid:EpsReportStore.umid}}
                        onChange={onChange}
                        /* onSuccess={onSuccess}*/
                        listType="text">
                        <Button type="primary" style={{margin: '0 0 10px'}}>报表文件上传</Button>
                    </Upload>
                </Form.Item>

                <Form.Item name="whr" label="维护人：">
                    <Input  initialValues={EpsReportStore.yhmc} disabled />
                </Form.Item>

                <Form.Item label="维护时间:" name="whsj" >
                    <Input  defaultValue={EpsReportStore.getDate} disabled />
                </Form.Item>

                <Form.Item name="whrid" >
                    <Input defaultValue={EpsReportStore.yhid} hidden />
                </Form.Item>
            </>
        )
    }


    const onButtonClick = () => {
        // `current` 指向已挂载到 DOM 上的文本输入元素
     //   let store = ref.current?.getTableStore()
    //    message.info(store.key || '当前未选中左侧树')
    };


    // 自定义功能按钮
    const customAction = (store: EpsTableStore) => {
        return ([<>
          {/*  {EpsEditButton()}
            {<EpsEditButton column={props.source} title={props.title.name} data={record} store={tableStore} customForm={customForm}/>}
            {<EpsDeleteButton data={text} store={tableStore} />}*/}
            {/*<Button onClick={() =>onButtonClick()}>复制</Button>
            <Button onClick={() =>onButtonClick()}>编辑</Button>
            <Button onClick={() =>onButtonClick()}>删除</Button>
            <Button onClick={() =>onButtonClick()}>查看</Button>
            <Button onClick={() =>onButtonClick()}>设计</Button>
            <Button onClick={() =>onButtonClick()}>导入</Button>
            <Button onClick={() =>onButtonClick()}>导出</Button>*/}
        </>])
    }

    // 自定义表格行按钮
    const customTableAction = (text, record, index, store) => {
        return (<>
            {[
                copyRole(text, record, index, store),
                roleUser(text, record, index, store)
            ]}
        </>)
    }

    return (
        <>
            <Button type="primary" style={{marginRight: 10}} onClick={() => {store.findByKey(store.key);setVisible(true)}}>
                报表
            </Button>
            <Modal
                title="报表设计"
                centered
                visible={visible}
                onOk={() => {
                    /*form
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
                        })*/
                }}
                onCancel={() => setVisible(false)}
                width={modalWidth}
            >
                <EpsPanel
                    title={title}
                    source={source}
                    // treeService={IpAddressesService}
                    tableProp={tableProp}
                   /* searchForm={searchFrom}            */      // 高级搜索组件，选填
                    tableService={EpsReportService}
                    customForm={customForm}
                    customAction={customAction}
                >
                </EpsPanel>
            </Modal>
        </>
    );
}

export default EpsReportButton;
