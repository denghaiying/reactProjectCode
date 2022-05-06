import React, { useEffect, useState, useRef } from 'react';
import {  EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, Select, TreeSelect } from 'antd';
import StflService from '@/services/base/stfl/StflService';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import DwTableLayout from '@/eps/business/DwTableLayout'
import SelectService from "@/pages/base/sjzdmx/selectService";
const FormItem = Form.Item;


const Sjzdmx = observer((props) => {
    /**
     * 获取当前用户
     */
    const yhmc = SysStore.getCurrentUser().yhmc;
    /**
     * 获取当前时间
     */
    const getDate = moment().format('YYYY-MM-DD HH:mm:ss');


    /**
     * childStore
     */
    const stflStore = useLocalObservable(() => (
        {
            params: {},
            dwTreeData: [],
            dwData: [],
            async queryTreeDwList() {
                // if (!this.dwData || this.dwData.length === 0) {
                const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
                if (response.status === 200) {
                    var sjData = [];
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            let newKey = {};
                            newKey = response.data[i];
                            newKey.key = newKey.id
                            newKey.title = newKey.mc
                            sjData.push(newKey)
                        }
                        console.log("sjData",sjData);
                        this.dwTreeData = sjData;
                    }
                    return;
                }
                // }
            },

            async queryDwList() {
                // if (!this.dwData || this.dwData.length === 0) {
                const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid`);
                if (response.status === 200) {
                    var sjData = [];
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            let newKey = {};
                            newKey = response.data[i];
                            newKey.key = newKey.id
                            newKey.value = newKey.id
                            newKey.label = newKey.mc
                            sjData.push(newKey)
                        }
                        console.log("sjData",sjData);
                        this.dwData = sjData;
                    }
                    return;
                }
                // }
            },

            async querySjzdList() {
                // if (!this.dwData || this.dwData.length === 0) {
                const response = await fetch.get(`/api/eps/control/main/sjzdmx/querySJZdTree?dwid=`);
                if (response.status === 200) {
                    var sjData = [];
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            let newKey = {};
                            newKey = response.data[i];
                            newKey.key = newKey.id
                            newKey.value = newKey.id
                            newKey.label = newKey.mc
                            sjData.push(newKey)
                        }
                        console.log("sjData",sjData);
                        this.dwData = sjData;
                    }
                    return;
                }
                // }
            },
        }

    ));




    const tableProp: ITable = {
        tableSearch: false,
    }

    //自定义表单校验
    const dagConfig = {
        rules: [{ required: true, message: '请选择' }],
    };

    // 自定义表单


    const customForm = () => {

        return (
            <>

                <Form.Item label="数据字典:" name="fid" required rules={[{ required: true, message: '请输入编号' }]}>
                    <Select
                        style={{ width: 100 }}
                        placeholder="请选择"

                    >
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>

                    </Select>
                </Form.Item>
                <Form.Item label="编号:" name="bh" required rules={[{ required: true, message: '请输入编号' }]}>
                    <Input allowClear style={{ width: 300 }} />
                </Form.Item>
                <Form.Item label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]}>
                    <Input allowClear style={{ width: 300 }} />
                </Form.Item>
                <Form.Item label="默认值:" name="defalutvalue" required rules={[{ required: true, message: '请输入名称' }]}>
                    <Input allowClear style={{ width: 300 }} />
                </Form.Item>

                <Form.Item label="维护人:" name="whr" >
                    <Input disabled defaultValue={yhmc} style={{ width: 300 }} />
                </Form.Item>
                <Form.Item label="维护时间:" name="whsj" >
                    <Input disabled defaultValue={getDate} style={{ width: 300 }} />
                </Form.Item>
                {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
            </>
        )
    }


    const [initParams, setInitParams] = useState({})
    const ref = useRef();
    useEffect(() => {
        stflStore.queryTreeDwList();
        stflStore.queryDwList();
    }, []);

    const source: EpsSource[] = [

        {
            title: '编号',
            code: 'bh',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '名称',
            code: 'mc',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '默认值',
            code: 'defalutvalue',
            align: 'center',
            formType: EpsFormType.Input,
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
        name: '数据字典明细'
    }

    const umid="JC004";

    const searchFrom = () => {
        return (
            <>
                <FormItem label="名称" className="form-item" name="cx_mc"><Input placeholder="请输入名称" /></FormItem >

                <FormItem label="编号" className="form-item" name="cx_bh"><Input placeholder="请输入编号" /></FormItem >
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

            </>
        ])
    }



    return (
        <DwTableLayout
            title={title}                            // 组件标题，必填
            source={source}                          // 组件元数据，必填
            //treeService={DwService}                  // 左侧树 实现类，必填
            ref={ref}
            noRender={true}
            selectService={SelectService}
            tableProp={tableProp}
            tableProp={tableProp}                    // 右侧表格设置属性，选填
            tableService={StflService}                 // 右侧表格实现类，必填
            formWidth={500}
            initParams={initParams}
            tableRowClick={(record) => console.log('abcef', record)}
            searchForm={searchFrom}
            customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        >
        </DwTableLayout>
    );
})

export default Sjzdmx;
