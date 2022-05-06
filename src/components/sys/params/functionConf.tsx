import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, TreeSelect } from 'antd';
import fetch from "../../../utils/fetch";
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import paramsService from '@/services/system/QueryParamsValueService';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
const { Option } = Select;
import { observer, useLocalObservable } from 'mobx-react';
import { useRef } from 'react';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';

const functionConf = observer((props) => {
    /**
   * childStore
   */
    /**
         * childStore
         */
    const systemConfStore = useLocalObservable(() => (
        {
            //获取当前用户名称
            yhmc: SysStore.getCurrentUser().yhmc,
            //获取当前用户ID
            yhid: SysStore.getCurrentUser().id,
            //获取当前默认单位id
            dwid: SysStore.getCurrentUser().dwid,
            //获取当前默认用户的角色
            roleCode: SysStore.getCurrentUser().golbalrole,
            //获取当前时间
            getDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            params: {},
            dwTreeData: [],
            dwData: [],
            selectOptionValue: [],



            async queryTreeDwList() {
                if (!this.dwData || this.dwData.length === 0) {
                    if (this.roleCode === 'SYSROLE01' || this.roleCode === 'SYSROLE02') {
                        const response = await fetch.get(`/api/eps/control/main/dw/queryForList_e9_superUser`);
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
                                this.dwTreeData = sjData;
                                console.log("this.dwTreeData0000000", this.dwTreeData);
                            }
                            return;
                        }
                    } else {
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
                                this.dwTreeData = sjData;
                            }
                            return;
                        }
                    }
                }
            },



            getOptionValues() {
                if (props.params.qslx === 'S') {
                    var a = props.params.zy.split(";");
                    var b = a.map(it => { var c = it.split(":"); return { value: c[0], label: c[1] } })
                    this.selectOptionValue = b;
                    setOptionValues(true);
                } else {
                    setOptionValues(false)
                }
            },
        }
    ));
    const ref = useRef()
    const [optionValues, setOptionValues] = useState(true)

    //初始化数据
    useEffect(() => {
        //初始化单位列表
        systemConfStore.queryTreeDwList();
        systemConfStore.getOptionValues();

    }, [])

    /**
      * 查询
      * @param {*} current
      */
    const OnSearch = (values: any) => {

        values.code = props.params.code;
        values.pzfs = props.params.pzfs;
        const tableStore = ref.current?.getTableStore();
        tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, values);
    };

    // 自定义功能按钮
    const customAction = (store: EpsTableStore) => {
        return ([
            <>
                <Form layout="inline" style={{ width: '100vw' }}
                    onFinish={OnSearch}
                >
                    <Form.Item label="" className="form-item" name="ypz" initialValue="Y">
                        <Select
                            defaultValue="已配置"
                            style={{ width: 100 }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                        >
                            <Option value="">全部</Option>
                            <Option value="Y">已配置</Option>
                            <Option value="N">未配置</Option>

                        </Select>
                    </Form.Item>

                    <Form.Item label="" className="form-item" name="dwid">
                        <TreeSelect style={{ width: 250 }}
                            treeData={systemConfStore.dwTreeData}
                            placeholder="选择单位"
                            treeDefaultExpandAll
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item label="" className="form-item" name="rolecode">
                        <Input placeholder="请输编码" />
                    </Form.Item >
                    <Form.Item label="" className="form-item" name="gnid">
                        <Input placeholder="请输入功能号" />
                    </Form.Item>
                    <Form.Item label="" className="form-item" name="name">
                        <Button type="primary" htmlType="submit">查询</Button>
                    </Form.Item>
                </Form>
            </>
        ])
    }


    const tableProp: ITable = {
        tableSearch: false,
        disableAdd: true,
        disableEdit: false,
        disableDelete: true,
        disableCopy: true,

    }
    // 自定义编辑表单
    const customForm = () => {

        return (
            <>
                <Form.Item label="参数编码:" name="pcode" >
                    <Input allowClear disabled />
                </Form.Item>

                <Form.Item label="角色编码:" name="rolecode" >
                    <Input allowClear disabled />
                </Form.Item>

                <Form.Item label="功能号:" name="gnid" >
                    <Input allowClear disabled />
                </Form.Item>
                <Form.Item label="功能名称:" name="gnname" >
                    <Input allowClear disabled />
                </Form.Item>
                <Form.Item label="维护人:" name="whr" initialValue={systemConfStore.yhmc}>
                    <Input allowClear disabled />
                </Form.Item>
                <Form.Item label="维护时间:" name="whsj" initialValue={systemConfStore.getDate}>
                    <Input allowClear disabled />
                </Form.Item>
                <Form.Item label="值:" name="value" >
                    {
                        optionValues ?
                            <Select className="ant-select" options={systemConfStore.selectOptionValue} />
                            :
                            <Input allowClear />
                    }
                </Form.Item>

                <Form.Item name="whrid" hidden>
                    <Input allowClear disabled />
                </Form.Item>
            </>
        )
    }

    const source: EpsSource[] = [{
        title: '参数编码',
        code: 'pcode',
        align: 'center',
        ellipsis: true,         // 字段过长自动东隐藏
        fixed: 'left',
        width: 200,
        formType: EpsFormType.Input
    }, {
        title: '角色编码',
        code: 'rolecode',
        align: 'center',
        width: 120,
        formType: EpsFormType.Input
    },

    {
        title: "角色名称",
        code: 'rolename',
        align: 'center',
        formType: EpsFormType.Input,
        width: 140,

    }, {
        title: "功能号",
        code: 'gnid',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,

    }, {
        title: "功能名称",
        code: "gnname",
        align: 'center',

        width: 100,
        formType: EpsFormType.Input,

    },
    {
        title: "值",
        code: "value",
        align: 'center',

        width: 100,
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
        width: 160,
        align: 'center',
        formType: EpsFormType.None
    }]

    const title: ITitle = {
        name: '参数管理'
    }

    return (
        <>

            <EpsPanel title={title}                    // 组件标题，必填
                source={source}                          // 组件元数据，必填
                tableProp={tableProp}                    // 右侧表格设置属性，选填
                tableService={paramsService}             // 右侧表格实现类，必填
                ref={ref}                                // 获取组件实例，选填
                formWidth={500}
                initParams={props.params}
                //tableRowClick={(record) => console.log('abcef', record)} //点击事件
                //searchForm={searchFrom}
                customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
                //customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
                customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            >
            </EpsPanel>
        </>
    )
})
export default functionConf
