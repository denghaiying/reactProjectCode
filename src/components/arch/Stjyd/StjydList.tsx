import React, { useEffect, useState } from 'react';
import { runInAction } from 'mobx';
import { Form, Input, Button, Select, TreeSelect, DatePicker } from 'antd';
import fetch from "../../../utils/fetch";
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import StjycService from '@/services/daly/stjyd/StjycService';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
const { Option } = Select;
import { observer, useLocalObservable } from 'mobx-react';
import { useRef } from 'react';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
const { RangePicker } = DatePicker;
import AddStjyd from './addStjyd';
import { useForm } from 'antd/lib/form/Form';

//实体借阅单
const StjydList = observer((props) => {
    //系统参数指允许按照系统配置

    const ref = useRef()

    const [form] = useForm()

    //初始化数据
    useEffect(() => {
        //初始化单位列表
        systemConfStore.queryTreeDwList();

    }, [])
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
            //获取开始时间
            startRq: "",
            //获取结束时间
            endRq: "",
            //部门ID
            bm_id: '',
            //默认当前用户所在单位
            dw_id: SysStore.getCurrentCmp().id,

            dwTreeData: [],
            dw_mc: '',
            async queryTreeDwList() {
                if (!this.dwTreeData || this.dwTreeData.length === 0) {

                    if (this.roleCode === 'SYSROLE01' || this.roleCode === 'SYSROLE02') {
                        const response = await fetch.get(`/api/eps/control/main/dw/queryForList_e9_superUser`);

                        console.log("response", response.data)
                        if (response.status === 200) {
                            // runInAction(() => {
                            var sjData = [];
                            if (response.data.length > 0) {
                                for (var i = 0; i < response.data.length; i++) {
                                    let newKey = {};
                                    newKey = response.data[i];
                                    newKey.key = newKey.id;
                                    newKey.title = newKey.mc;

                                    sjData.push(newKey);
                                }
                                this.dwTreeData = sjData;
                            }
                            return;
                            // });
                        }
                    } else {
                        const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
                        if (response.status === 200) {
                            runInAction(() => {
                                var sjData = [];
                                if (response.data.length > 0) {
                                    for (var i = 0; i < response.data.length; i++) {
                                        let newKey = {};
                                        newKey = response.data[i];
                                        newKey.key = newKey.id;
                                        newKey.title = newKey.mc;

                                        sjData.push(newKey);
                                    }
                                    this.dwTreeData = sjData;
                                    console.log(" this.dwTreeData", this.dwTreeData)
                                }
                                return;
                            });
                        }
                    }
                }
            },


            orgData: [],
            org_page_No: 1,
            org_page_Size: 1,
            org_dw_id: SysStore.getCurrentCmp().id,
            bm_mc: '',
            async queryDwOrgTree() {
                const response = await fetch.get(`/api/eps/control/main/org/queryDwOrgTreeAntD?dwid=${this.org_dw_id}&pageIndex=${this.org_page_No}&pageSize=${this.org_page_Size}`);
                if (response.status === 200) {
                    this.orgData = response.data;
                    return;
                }
            },
        }
    ));



    // 自定义表格行按钮
    const customTableAction = (text, record, index, store) => {
        return [
            <AddStjyd record={record} ids={props.store.ids} store={store} key={'addStjyd' + index} />

        ];
    };



    /**
      * 查询
      * @param {*} current
      */
    const OnSearch = (values: any) => {
        let dmc = systemConfStore.dw_mc.toString().split("|");
        let bm = systemConfStore.bm_mc.toString();
        var len = dmc.length;
        values['dwmc'] = dmc[len - 1];
        values['bm'] = bm;
        const tableStore = ref.current?.getTableStore();
        tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, values);
    };



    /**
 * 获取treeSelect值
 */
    const [treeValue, setTreeValue] = useState();

    const handleBmChange = (value, label) => {
        systemConfStore.bm_mc = label;
    };

    const handleDwChange = (value, label) => {
        console.log("选中的值", value)
        systemConfStore.org_dw_id = value;
        systemConfStore.dw_id = value;
        systemConfStore.dw_mc = label;

    };

    useEffect(() => {
        systemConfStore.queryDwOrgTree();
        form.setFieldsValue({ bm: '' })
    }, [systemConfStore.org_dw_id])

    // 自定义功能按钮
    const customAction = (store: EpsTableStore) => {
        return ([
            <>

                <Form form={form} layout="inline" style={{ width: '100vw' }} onFinish={OnSearch} >
                    <Form.Item label="借阅单号:" name="cx_jydh" className="form-item">
                        <Input style={{ width: 180 }} allowClear placeholder="请输入借阅单号" >
                        </Input>
                    </Form.Item>

                    <Form.Item label="申请人:" name="cx_jyr" className="form-item">
                        <Input style={{ width: 100 }} allowClear placeholder="请输入申请人" >
                        </Input>
                    </Form.Item>

                    <Form.Item label="借阅单位:" name="dwmc" className="form-item">
                        <TreeSelect
                            style={{ width: 250 }}
                            treeData={systemConfStore.dwTreeData}
                            placeholder="请选择单位"
                            treeDefaultExpandAll
                            allowClear
                            onChange={(val, label) => handleDwChange(val, label)}
                        />
                        &nbsp;
                    </Form.Item>

                    <Form.Item label="借阅部门:" name="bm" className="form-item">
                        <TreeSelect
                            style={{ width: 150 }}
                            treeData={systemConfStore.orgData}
                            placeholder="请选择部门"
                            treeDefaultExpandAll
                            allowClear
                            onChange={(val, label) => handleBmChange(val, label)}
                        />
                    </Form.Item>



                    {/* <Form.Item label="" className="form-item" name="qzlx" initialValue={props.params.qzlx}>
                        <Input hidden />
                    </Form.Item>
                    <Form.Item label="" className="form-item" name="zy" initialValue={props.params.zy}>
                        <Input hidden />
                    </Form.Item> */}
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
        disableEdit: true,
        disableDelete: true,
        disableCopy: true,

    }


    const handleRq = (val) => {


        if (val[0] != null) {
            console.log(val[0])
            systemConfStore.startRq = val[0].format('YYYY-MM-DD')
        } else {
            systemConfStore.startRq = ""
        }

        if (val[1] != null) {
            console.log(val[1])
            systemConfStore.endRq = val[1].format('YYYY-MM-DD')
        } else {
            systemConfStore.endRq = ""
        }
    }

    const handleSqr = (val) => {
        console.log(val);
        // Store.setSqr = val.target.value;
    }
    // 自定义编辑表单
    const customForm = () => {

        return (
            <>
                <Form.Item label="起止时间:" name="pcode" >
                    <RangePicker onChange={(val) => handleRq(val)} />
                </Form.Item>

                <Form.Item label="申请人:" name="rolecode" >
                    <Input style={{ width: 180 }} allowClear name="wfawaiter" placeholder="请输入申请人"
                        onChange={handleSqr}
                    >
                    </Input>
                </Form.Item>
            </>
        )
    }

    const source: EpsSource[] = [{
        title: '借阅单号',
        code: 'id',
        align: 'center',
        ellipsis: true,         // 字段过长自动东隐藏
        fixed: 'left',
        width: 120,
        formType: EpsFormType.Input,

    }, {
        title: '借阅类型',
        code: 'jylx',
        align: 'center',
        width: 60,
        formType: EpsFormType.Input,
        render: (text) => {
            return text === 0 ? '实体借阅' : '电子借阅';
        }
    },

    {
        title: "借出类型",
        code: 'jclx',
        align: 'center',
        formType: EpsFormType.Input,
        width: 80,

    },
    // {
    //     title: "手机号",
    //     code: 'sj',
    //     align: 'center',
    //     width: 80,
    //     formType: EpsFormType.Input,

    // }, {
    //     title: "电子邮件",
    //     code: "yx",
    //     align: 'center',

    //     width: 80,
    //     formType: EpsFormType.Input,

    // },
    {
        title: "申请人",
        code: "yhmc",
        align: 'center',

        width: 60,
        formType: EpsFormType.Input,

    },
    {
        title: "申请日期",
        code: "sqrq",
        align: 'center',

        width: 80,
        formType: EpsFormType.Input,

    },
    {
        title: "借阅天数",
        code: "jyts",
        align: 'center',

        width: 50,
        formType: EpsFormType.Input,

    },
    {
        title: "手机",
        code: 'sj',
        width: 70,
        align: 'center',
        formType: EpsFormType.Input,

    },
    {
        title: "电话",
        code: 'dh',
        width: 60,
        align: 'center',
        formType: EpsFormType.Input,


    },
    {
        title: '邮箱',
        code: 'yx',
        width: 60,
        align: 'center',
        formType: EpsFormType.None,

    },
    {
        title: "单位编号",
        code: "dwid",
        align: 'center',

        width: 120,
        formType: EpsFormType.Input,

    },
    {
        title: "单位名称",
        code: "dwmc",
        align: 'center',

        width: 120,
        formType: EpsFormType.Input,

    },
    {
        title: "申请部门",
        code: "sqbm",
        align: 'center',

        width: 60,
        formType: EpsFormType.Input,

    },
    {
        title: "借阅目的",
        code: "lymd",
        align: 'center',

        width: 60,
        formType: EpsFormType.Input,

    },
    {
        title: "备注",
        code: "bz",
        align: 'center',

        width: 60,
        formType: EpsFormType.Input,

    }
    ]

    const title: ITitle = {
        name: '加入实体借阅车'
    }

    return (
        <>

            <EpsPanel title={title}                    // 组件标题，必填
                source={source}                          // 组件元数据，必填
                tableProp={tableProp}                    // 右侧表格设置属性，选填
                tableService={StjycService}             // 右侧表格实现类，必填
                ref={ref}                                // 获取组件实例，选填
                formWidth={500}
                initParams={props.params}

                //searchForm={searchFrom}
                customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
                customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
                customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            >
            </EpsPanel>
        </>
    )
})
export default StjydList
