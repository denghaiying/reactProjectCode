import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import fetch from "../../../utils/fetch";
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import CjDakService from '@/services/base/dak/CjDakService';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import { useRef } from 'react';
import SysStore from '../../../stores/system/SysStore';
import { runInAction } from 'mobx';

const roleConf = observer((props) => {
    const FormItem = Form.Item;
    const ref = useRef()
    /**
     * 获取当前时间
     */
    const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

    /**
     * childStore
     */
    const referStore = useLocalObservable(() => (
        {
            dakListData: [],
            mbzlxListData: [],
            yDakListData: [],
            yMbzlxListData: [],

            //mbzlx/queryForList

            // async queryMbID() {
            //     const response = await fetch.get(`/api/eps/control/main/dak/queryForId?id=${props.params.id}`);
            //     if (response.status === 200) {
            //         if (response && response.data) {
            //             this.DakData = response.data.mbid
            //             console.log("this.DakData", response.data.mbid);
            //         }
            //         return;
            //     }
            // },




            async queryYDakList() {
                const response = await fetch.get(`/api/eps/control/main/dak/queryForList?dw=${props.params.dw}&noshowdw='Y'`);
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
                        runInAction(() => {
                            this.yDakListData = sjData;
                            console.log("this.yDakListData", this.yDakListData);
                        })

                    }
                    return;
                }
            },

            async queryDakList() {
                const response = await fetch.get(`/api/eps/control/main/dak/queryForList?dw=${props.params.dw}&noshowdw='Y'`);
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
                        runInAction(() => {
                            this.dakListData = sjData;
                            console.log("this.dakListData", this.dakListData);
                        })

                    }
                    return;
                }
            },


            async queryMbzlxList() {
                //根据id获取DAK数据
                var mbid = "";
                const responseDak = await fetch.get(`/api/eps/control/main/dak/queryForId?id=${props.params.id}`);
                if (responseDak.status === 200) {
                    if (responseDak && responseDak.data) {
                        mbid = responseDak.data.mbid
                        console.log("this.mbid", responseDak.data.mbid);
                    }
                }
                const response = await fetch.get(`/api/eps/control/main/mbzlx/queryForList?dw=${props.params.dw}&mbid=${mbid}`);
                if (response.status === 200) {
                    var sjData = [];
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            let newKey = {};
                            newKey = response.data[i];
                            newKey.key = newKey.id
                            newKey.value = newKey.mc
                            newKey.label = newKey.mc
                            sjData.push(newKey)
                        }
                        runInAction(() => {
                            this.mbzlxListData = sjData;
                        })
                    }
                    return;
                }
            },
            async queryYMbzlxList() {
                //根据id获取DAK数据
                var mbid = "";
                const responseDak = await fetch.get(`/api/eps/control/main/dak/queryForId?id=${props.params.id}`);
                if (responseDak.status === 200) {
                    if (responseDak && responseDak.data) {
                        mbid = responseDak.data.mbid
                        console.log("this.mbid", responseDak.data.mbid);
                    }
                }

                const response = await fetch.get(`/api/eps/control/main/mbzlx/queryForList?dw=${props.params.dw}&mbid=${mbid}`);
                if (response.status === 200) {
                    var sjData = [];
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            let newKey = {};
                            newKey = response.data[i];
                            newKey.key = newKey.id
                            newKey.value = newKey.mc
                            newKey.label = newKey.mc
                            sjData.push(newKey)
                        }
                        runInAction(() => {
                            this.yMbzlxListData = sjData;
                        })
                    }
                    return;
                }
            },
        }
    ));
    //初始化数据
    useEffect(() => {
        //初始化添加页面档案库数据
        referStore.queryDakList();
        referStore.queryMbzlxList();
        referStore.queryYDakList();
        referStore.queryYMbzlxList();
    }, [])



    const tableProp: ITable = {
        tableSearch: false,
        disableAdd: false,
        disableEdit: false,
        disableDelete: false,
        disableCopy:true,

    }
    // 自定义编辑表单
    const customForm = () => {

        return (
            <>
                <FormItem label="原档案库:" name="ydak" initialValue={props.params.id}>
                    <Select
                        style={{ width: 250 }}
                        options={referStore.yDakListData}
                        disabled
                    />
                </FormItem>

                <Form.Item label="原参见字段:" name="ycjzd" >
                    <Select
                        style={{ width: 250 }}
                        placeholder="请选择原参见字段"
                        options={referStore.yMbzlxListData}

                    />
                </Form.Item>

                <Form.Item label="参见档案库:" name="cjdak" >
                    <Select
                        style={{ width: 250 }}
                        placeholder="请选择参见档案库"
                        options={referStore.dakListData}

                    />
                </Form.Item>
                <Form.Item label="参见字段:" name="cjzd" >
                    <Select
                        style={{ width: 250 }}
                        placeholder="请选择参见字段"
                        options={referStore.mbzlxListData}

                    />
                </Form.Item>

                <Form.Item label="维护人:" name="whr" initialValue={SysStore.getCurrentUser().yhmc}>
                    <Input allowClear disabled />
                </Form.Item>
                <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
                    <Input allowClear disabled />
                </Form.Item>
                <Form.Item label="" name="whrid" initialValue={SysStore.getCurrentUser().id} >
                    <Input hidden />
                </Form.Item>

            </>
        )
    }

    const source: EpsSource[] = [{
        title: '原档案库',
        code: 'ydakmc',
        align: 'center',
        ellipsis: true,         // 字段过长自动东隐藏
        fixed: 'left',
        width: 120,
        formType: EpsFormType.Input
    }, {
        title: '原参见字段',
        code: 'ycjzd',
        align: 'center',
        width: 60,
        formType: EpsFormType.Input
    },

    {
        title: "参见档案库",
        code: 'dakmc',
        align: 'center',
        formType: EpsFormType.Input,
        width: 120,

    }, {
        title: "参见字段",
        code: 'cjzd',
        align: 'center',
        width: 60,
        formType: EpsFormType.Input,

    },

    {
        title: "维护人",
        code: 'whr',
        width: 100,
        align: 'center',
        formType: EpsFormType.Input,

    }, {
        title: '维护时间',
        code: 'whsj',
        width: 120,
        align: 'center',
        formType: EpsFormType.None
    }]

    const title: ITitle = {
        name: '参见档案库'
    }

    return (
        <>

            <EpsPanel title={title}                    // 组件标题，必填
                source={source}                          // 组件元数据，必填
                tableProp={tableProp}                    // 右侧表格设置属性，选填
                tableService={CjDakService}             // 右侧表格实现类，必填
                ref={ref}                                // 获取组件实例，选填
                formWidth={500}
                initParams={props.params}
                //tableRowClick={(record) => console.log('abcef', record)} //点击事件
                //searchForm={searchFrom}
                customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            //customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
            // customAction={customAction}              // 自定义全局按钮（如新增、导入、查询条件、全局打印 等），选填
            >
            </EpsPanel>
        </>
    )
})
export default roleConf
