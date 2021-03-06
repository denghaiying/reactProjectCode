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
        title: '????????????',
        code: 'name',
        align: 'center',
        formType: EpsFormType.Input
    },
        {
            title: '??????????????????',
            code: 'designType',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if(text) {
                    if(text=='1'){
                        return text = 'BS??????';
                    }else if(text=='2'){
                        return text = '????????????';
                    }else if (text=='3'){
                        return text = '????????????';
                    }
                }else{
                    return text = "??????";
                }

            }
        },{
            title: "??????",
            code: 'isdefault',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if(text) {
                    return text == 'N' ? '???' : '???';
                }else{
                    return text = "??????";
                }

            }

        },
        {
            title: "??????",
            code: "ispublic",
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if(text) {
                    return text == 'N' ? '???' : '???';
                }else{
                    return text = "??????";
                }

            }

        },
        {
            title: '?????????',
            code: 'whr',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '????????????',
            code: 'whsj',
            align: 'center',
            formType: EpsFormType.Input
        }
    ]
    const title = {
        name: 'IP????????????'
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

    // ???????????????

    const customForm = () => {
        //?????????????????????

        return (
            <>
                <Form.Item  label="????????????:" name="name" required rules={[{ required: true, message: '?????????IP??????' }]}>
                    <Input allowClear />
                </Form.Item>

                <Form.Item label="??????:" name="isdefault" >
                    <Checkbox checked={defaultChecked} onChange={onChangeDefault} />
                </Form.Item>

                <Form.Item label="??????:" name="ispublic" >
                    <Checkbox checked={publicChecked} onChange={onChangePublic} />
                </Form.Item>
                <Form.Item label="????????????:" name="designType" >
                    <Select defaultValue="2" style={{ width: 120 }}
                            onChange={handlelxChange}>
                        <Option value="1">BS??????</Option>
                        <Option value="2">????????????</Option>
                        <Option value="3">????????????</Option>
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
                        <Button type="primary" style={{margin: '0 0 10px'}}>??????????????????</Button>
                    </Upload>
                </Form.Item>

                <Form.Item name="whr" label="????????????">
                    <Input  initialValues={EpsReportStore.yhmc} disabled />
                </Form.Item>

                <Form.Item label="????????????:" name="whsj" >
                    <Input  defaultValue={EpsReportStore.getDate} disabled />
                </Form.Item>

                <Form.Item name="whrid" >
                    <Input defaultValue={EpsReportStore.yhid} hidden />
                </Form.Item>
            </>
        )
    }


    const onButtonClick = () => {
        // `current` ?????????????????? DOM ????????????????????????
     //   let store = ref.current?.getTableStore()
    //    message.info(store.key || '????????????????????????')
    };


    // ?????????????????????
    const customAction = (store: EpsTableStore) => {
        return ([<>
          {/*  {EpsEditButton()}
            {<EpsEditButton column={props.source} title={props.title.name} data={record} store={tableStore} customForm={customForm}/>}
            {<EpsDeleteButton data={text} store={tableStore} />}*/}
            {/*<Button onClick={() =>onButtonClick()}>??????</Button>
            <Button onClick={() =>onButtonClick()}>??????</Button>
            <Button onClick={() =>onButtonClick()}>??????</Button>
            <Button onClick={() =>onButtonClick()}>??????</Button>
            <Button onClick={() =>onButtonClick()}>??????</Button>
            <Button onClick={() =>onButtonClick()}>??????</Button>
            <Button onClick={() =>onButtonClick()}>??????</Button>*/}
        </>])
    }

    // ????????????????????????
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
                ??????
            </Button>
            <Modal
                title="????????????"
                centered
                visible={visible}
                onOk={() => {
                    /*form
                        .validateFields()
                        .then(values => {
                            props.store.save(values).then(res => {
                                message.success('??????????????????');
                                props.store.findByKey(props.store.key);
                                setVisible(false);
                                form.resetFields();
                            }).catch(err => {
                                message.error(err)
                            })
                        })
                        .catch(info => {
                            message.error('??????????????????,' + info)
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
                   /* searchForm={searchFrom}            */      // ???????????????????????????
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
