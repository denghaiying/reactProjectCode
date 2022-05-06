import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import {Col, Form, Input, Row, Select} from 'antd';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';

import { observer } from 'mobx-react';
import sjqxgzService from "@/pages/base/sjqxgz/sjqxgzService";
const FormItem = Form.Item;


const Sjqxgz = observer((props) => {
    /**
     * 获取当前用户
     */
    const yhmc = SysStore.getCurrentUser().yhmc;
    /**
     * 获取当前时间
     */
    const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const umid="JC052";

    /**
     * childStore
     */
        // const sjqxgzStore = useLocalObservable(() => (
        //     {


        //     }
        // ));


    const { TextArea } = Input;

    const tableProp: ITable = {
        tableSearch: false,
    }

//自定义表单校验
    const dagConfig = {
        rules: [{ required: true, message: '请选择' }],
    };

// 自定义表单

    const span = 24;
    const _width = 360;


    const customForm = () => {

        return (
            <>
                <Row gutter={20}>
                    <Col span={span}>
                        <Form.Item label="类型:" name="lx" required rules={[{ required: true, message: '请选择类型' }]}>
                            <Select
                                className="ant-select"  style={{width:  _width}}
                                placeholder="请选择字段类型" >
                                <option value=""></option>
                                <option value="A">条目</option>
                                <option value="B">原文</option>
                                <option value="C">全文检索条目</option>
                                <option value="D">全文检索原文</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="编号:" name="code" required rules={[{ required: true, message: '请输入编号' }]}>
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="名称:" name="name" required rules={[{ required: true, message: '请输入名称' }]}>
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="规则定义:" name="sqltext" required rules={[{ required: true, message: '请输入规则定义' }]}>
                            <TextArea  rows={8} className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>

                    <Col span={span}>
                        <Form.Item label="维护人:" name="whr" >
                            <Input className="ant-input"  style={{width:  _width}} disabled defaultValue={yhmc}  />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="维护时间:" name="whsj" >
                            <Input className="ant-input"  style={{width:  _width}} disabled defaultValue={getDate}  />
                        </Form.Item>
                    </Col>
                </Row>
            </>
        )
    }


    const [initParams, setInitParams] = useState({})
    const ref = useRef();
    useEffect(() => {

    }, []);

    const source: EpsSource[] = [
        {
            title: '类型',
            code: 'lx',
            align: 'center',
            formType: EpsFormType.Input,
            width: 100,
            render: (text, record, index) => {
                if (text === 'A') {
                    return '条目';
                }else if(text === 'B'){
                    return '原文';
                }else if(text === 'C'){
                    return '全文检索条目';
                }else if(text === 'D'){
                    return '全文检索原文';
                }else {
                    return text = "未知";
                }

            }
        },
        {
            title: '编号',
            code: 'code',
            align: 'center',
            width: 100,
            formType: EpsFormType.Input
        },
        {
            title: '名称',
            code: 'name',
            align: 'center',
            width: 120,
            formType: EpsFormType.Input
        },
        {
          title: '规则定义',
          code: 'sqltext',
          align: 'center',
          ellipsis: true,         // 字段过长自动东隐藏
          formType: EpsFormType.Input

        },
        {
            title: '维护人',
            code: 'whr',
            align: 'center',
           width: 100,
            formType: EpsFormType.Input
        },
        {
            title: '维护时间',
            code: 'whsj',
            align: 'center',
            width: 160,
            formType: EpsFormType.Input
        }
    ]
    const title = {
        name: '数据权限规则'
    }



    return (
        <EpsPanel
            title={title}                            // 组件标题，必填
            source={source}                          // 组件元数据，必填
            //treeService={DwService}                  // 左侧树 实现类，必填
            ref={ref}
            tableProp={tableProp}                    // 右侧表格设置属性，选填
            tableService={sjqxgzService}                 // 右侧表格实现类，必填
            formWidth={580}
            initParams={initParams}
            tableRowClick={(record) => console.log('abcef', record)}
            //      searchForm={searchFrom}
            customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        >
        </EpsPanel>
    );
})

export default Sjqxgz;
