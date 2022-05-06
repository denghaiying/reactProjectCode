import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import {Col, Form, Input, Row, Select} from 'antd';
import ysjService from '@/services/base/ysj/YsjService';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';

import { observer, useLocalObservable } from 'mobx-react';
const FormItem = Form.Item;


const Ysj = observer((props) => {
    /**
     * 获取当前用户
     */
    const yhmc = SysStore.getCurrentUser().yhmc;
    /**
     * 获取当前时间
     */
    const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const umid="JC007";
    /**
     * childStore
     */
    const ysjStore = useLocalObservable(() => (
        {
            lxData: [],
            page_No : 1,
            page_Size : 20,
            ysjlxData:[],
            ysjsxData:[],

            async queryYsjfl() {
                const response = await fetch.get(`/api/eps/control/main/ysjwh/queryysjlxlist`);
                if (response && response.status === 200) {
                    this.ysjlxData = response.data.map(o => ({ 'id': o.id, 'label': o.bh+"|"+o.mc, 'value': o.id }));
                }else {
                    return;
                }
            },

            async queryYsjsx() {
                const response = await fetch.get(`/api/eps/control/main/ysjsxwh/queryForList`);
                if (response && response.status === 200) {
                    this.ysjsxData = response.data.map(o => ({ 'id': o.id, 'label': o.bh+"|"+o.mc, 'value': o.id }));
                }else {
                    return;
                }
            },
        }
    ));




    const tableProp: ITable = {
        tableSearch: false,
        disableCopy: true,
    }

//自定义表单校验
    const dagConfig = {
        rules: [{ required: true, message: '请选择' }],
    };

// 自定义表单

    const span = 24/2;
    const _width = 240


    const customForm = () => {

        return (
            <>
                <Row gutter={20}>
                    <Col span={span}>
                        <Form.Item label="字段名称:" name="zdmc" required rules={[{ required: true, message: '请输入字段名称' }]}>
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="字段描述:" name="zdms" required rules={[{ required: true, message: '请输入字段描述' }]}>
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="字段英文描述:" name="zdywms" required rules={[{ required: true, message: '请输入字段英文描述' }]}>
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="字段长度:"  name="zdcd" required rules={[{ required: true, message: '请输入字段长度' }]} initialValue={50}>
                            <Input className="ant-input"  style={{width:  _width}} value={50} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="字段属性:" name="zdsx" required rules={[{ required: true, message: '请选择字段属性' }]}>
                            <Select
                                className="ant-select"  style={{width:  _width}}
                                placeholder="请选择字段属性"
                                options={ysjStore.ysjsxData}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={span}>
                        <Form.Item label="字段类型:" name="zdlx" required rules={[{ required: true, message: '请选择字段类型' }]}>
                            <Select
                                className="ant-select"  style={{width:  _width}}
                                placeholder="请选择字段类型" value="C" >
                                <option value="C">文本型</option>
                                <option value="N">数值型</option>
                                <option value="D">日期型</option>
                                <option value="T">日期时间型</option>
                                <option value="B">大文本型</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="编辑框类型:" name="zdbjk" required rules={[{ required: true, message: '请选择编辑框类型' }]}>
                            <Select
                                className="ant-select"  style={{width:  _width}}
                                placeholder="请选择编辑框类型" value="C" >
                                <option value="C">文本框</option>
                                <option value="L">下拉选择框</option>
                                <option value="N">数值框</option>
                                <option value="D">日期框</option>
                                <option value="T">日期时间框</option>
                                <option value="B">大文本框</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="字段默认值:" name="zdmrz"  >
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="元数据分类:" name="zdfl" required rules={[{ required: true, message: '请选择元数据分类' }]}>
                            <Select
                                className="ant-select"  style={{width:  _width}}
                                placeholder="请选择元数据分类"
                                options={ysjStore.ysjlxData}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="列表长度:" name="lbcd" required rules={[{ required: true, message: '请选择列表长度' }]} >
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="卡片宽度:" name="kpkd"  required rules={[{ required: true, message: '请选择卡片宽度' }]} >
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="排序:" name="px"  >
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="维护人:" name="whr" >
                            <Input className="ant-input"  style={{width:  _width}} disabled defaultValue={yhmc} />
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
        ysjStore.queryYsjfl();
        ysjStore.queryYsjsx();
    }, []);

    const source: EpsSource[] = [
        {
            title: '字段名称',
            code: 'zdmc',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '字段描述',
            code: 'zdms',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '字段英文描述',
            code: 'zdywms',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '字段长度',
            code: 'zdcd',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '字段属性',
            code: 'zdsx',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                let lxlist=ysjStore.ysjsxData;
                let aa = lxlist.filter(item => {
                    return item.value === text
                })
                return aa[0]?.label
            },

        },
        {
            title: '字段类型',
            code: 'zdlx',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if (text === 'C') {
                    return '文本型';
                }else if(text === 'N'){
                    return '数值型';
                }else if(text === 'D'){
                    return '日期型';
                }else if(text === 'T'){
                    return '日期时间型';
                }else if(text === 'B'){
                    return '大文本型';
                }else {
                    return text = "未知";
                }

            }
        },
        {
            title: '编辑框类型',
            code: 'zdbjk',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if (text === 'C') {
                    return '文本框';
                }else if(text === 'N'){
                    return '数值框';
                }else if(text === 'L'){
                    return '下拉选择框';
                }else if(text === 'D'){
                    return '日期框';
                }else if(text === 'T'){
                    return '日期时间框';
                }else if(text === 'B'){
                    return '大文本框';
                }else {
                    return text = "未知";
                }

            }
        },
        {
            title: '字段默认值',
            code: 'zdmrz',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '元数据分类',
            code: 'zdfl',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                let lxlist=ysjStore.ysjlxData;
                let aa = lxlist.filter(item => {
                    return item.value === text
                })
                return aa[0]?.label
            },
        },
        {
            title: '列表长度',
            code: 'lbcd',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '卡片宽度',
            code: 'kpkd',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '排序',
            code: 'px',
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
        name: '元数据'
    }

    const searchFrom = () => {
        return (
            <>
                <FormItem label="字段名称" className="form-item" name="cx_zdmc">
                    <Input placeholder="请输入字段名称" />
                </FormItem >
                <FormItem label="元数据类型" className="form-item" name="cx_lx">
                    <Select
                        style={{ width: 300 }}
                        placeholder="请选择分类"
                        options={ysjStore.ysjlxData}
                    />
                </FormItem >
                <FormItem label="字段描述" className="form-item" name="cx_zdms">
                    <Input placeholder="请输入字段描述" />
                </FormItem >
            </>
        )
    }


    /**
     * 查询
     * @param {*} current
     */
    const OnSearch = (values: any, store: EpsTableStore) => {
        store && store.findByKey(store.key, 1, store.size, values);
    };

    // 自定义查询按钮
    const customAction = (store: EpsTableStore) => {
        return ([
            <>
                {/* <Form layout="inline" style={{ width: '100vw' }} onFinish={(value) => OnSearch(value, store)}>
         <Form.Item label="" className="form-item" name="dwid">
                      <TreeSelect style={{ width: 250 }}
                          treeData={systemConfStore.dwTreeData}
                          placeholder="选择单位"
                          treeDefaultExpandAll
                          allowClear
                      />
                  </Form.Item>
          <Form.Item label="" className="form-item" name="cx_bh">

          </Form.Item >
          <Form.Item label="" className="form-item" name="cx_mc">
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="" className="form-item" name="name">
            <Button type="primary" htmlType="submit">查询</Button>
          </Form.Item>
        </Form> */}
            </>
        ])
    }



    return (
        <EpsPanel
            title={title}                            // 组件标题，必填
            source={source}                          // 组件元数据，必填
            ref={ref}
            tableProp={tableProp}                    // 右侧表格设置属性，选填
            tableService={ysjService}                 // 右侧表格实现类，必填
            formWidth={850}
            initParams={initParams}
            tableRowClick={(record) => console.log('abcef', record)}
            searchForm={searchFrom}
            customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        >
        </EpsPanel>
    );
})

export default Ysj;
