import React, {useEffect, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import MkService from '@/services/system/MkService';
import { EpsSource, ITable } from "@/eps/commons/declare";
import {Col, Form, Input, Row} from 'antd';
import EpsReportButton from "@/eps/components/buttons/EpsReportButton/index";
import Detail from "@/pages/sys/Mk/Detail";
import { observer } from 'mobx-react';
const FormItem = Form.Item;

const tableProp: ITable = {
    tableSearch: true,
    disableEdit: true,
    disableDelete:true,
    disableAdd:true,
    disableCopy:true
}


//function Mk() {
const Mk = observer((props) =>{

    const [umid, setUmid] = useState('');


    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(MkService));
    const customTableAction = (text, record, index, store) => {
        
        return (<>
            {[
                //  <Detail title="模块详情" column={ource} data={record} store={tableStore} customForm={customForm} />,
            ]}
        </>)}

    useEffect(() => {
        // SearchStore.queryDw();
        setUmid('CONTROL0005');
    }, []);

    const customAction = (store: EpsTableStore) => {
        return ([<>
            {/* <EpsReportButton store={store} umid={umid} /> */}
            //        <EpsReportButton store={store} umid={umid} />
        </>])
    }

    const span = 24;
    const _width = 240


// 自定义表单

    const customForm = () => {
        //自定义表单校验


        return (
            <>
                <Row gutter={20}>
                    <Col span={span}>
                        <Form.Item label="编号" name="mkbh" >
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="名称" name="mc" >
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="版本" name="bb">
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="URL" name="url">
                            <Input style={{width:  _width}} className="ant-input" />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="停用" name="tymc">
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="停用日期" name="tyrq">
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="维护人" name="whr">
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="维护时间" name="whsj">
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                </Row>
            </>
        )
    }

    const source: EpsSource[] = [{
        title: '编号',
        code: 'mkbh',
        align: 'center',
        formType: EpsFormType.Input
    },
        {
            title: '名称',
            code: 'mc',
            align: 'center',
            formType: EpsFormType.Input
        }, {
            title: "版本",
            code: "bb",
            align: 'center',
            formType: EpsFormType.Input

        }, {
            title: "URL",
            code: 'baseurl',
            align: 'center',
            formType: EpsFormType.Input
        }, {
            title: "停用",
            code: 'tymc',
            align: 'center',
            formType: EpsFormType.Input
        }, {
            title: "停用日期",
            code: 'tyrq',
            align: 'center',
            formType: EpsFormType.Input
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
        name: '模块管理'
    }

    return (
        <EpsPanel
            title={title}
            source={source}
            tableProp={tableProp}
            formWidth={500}
            //customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={MkService}
            customForm={customForm}
            //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        >
        </EpsPanel>
    );
})

export default Mk;
