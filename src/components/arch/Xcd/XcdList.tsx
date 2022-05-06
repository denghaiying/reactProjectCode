import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import XcdService from '@/services/daly/xcd/XcdService';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import { observer, useLocalObservable } from 'mobx-react';
import { useRef } from 'react';
import SysStore from '@/stores/system/SysStore';
import NewDajyStore from '@/stores/daly/NewDajyStore';
import moment from 'moment';
const { RangePicker } = DatePicker;
import AddXcd from './addXcd';

//协查单
const XcdList = observer((props) => {
    const ref = useRef()
    //初始化数据
    useEffect(() => {
        NewDajyStore.querySjzdByLymd();
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
        }
    ));




    // 自定义表格行按钮
    const customTableAction = (text, record, index, store) => {
        return [
            <AddXcd record={record} ids={props.store.ids} store={store} key={'addXcd' + index} />

        ];
    };



    /**
      * 查询
      * @param {*} current
      */
    const OnSearch = (values: any) => {

        // values.code = props.params.code;
        // values.pzfs = props.params.pzfs;
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
                    <Form.Item label="起止时间:" className="form-item" name="riqi" >
                        <RangePicker/>
                    </Form.Item>

                    <Form.Item label="申请人:" name="cx_jyr" className="form-item">
                        <Input style={{ width: 150 }} allowClear placeholder="请输入申请人">
                        </Input>
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
        disableEdit: true,
        disableDelete: true,
        disableCopy: true,
        // rowSelection: {
        //     type: 'radio',
        //   },
    }


    // const handleRq = (val) => {
    //     if (val && val[0]) {
    //         console.log(val[0])
    //         systemConfStore.startRq = val[0].format('YYYY-MM-DD')
    //     } else {
    //         systemConfStore.startRq = ""
    //     }
    //     if (val && val[1]) {
    //         console.log(val[1])
    //         systemConfStore.endRq = val[1].format('YYYY-MM-DD')
    //     } else {
    //         systemConfStore.endRq = ""
    //     }
    // }

    // const handleSqr = (val) => {
    //     console.log(val);
    //     // Store.setSqr = val.target.value;
    // }
    // 自定义编辑表单
    const customForm = () => {

        return (
            <>

            </>
        )
    }

    const source: EpsSource[] = [
    //     {
    //     title: '流程状态',
    //     code: 'lczt',
    //     align: 'center',
    //     ellipsis: true,         // 字段过长自动东隐藏
    //     fixed: 'left',
    //     width: 60,
    //     formType: EpsFormType.Input,
    //     render: (text) => {
    //         if (text) {
    //             return text === null ? '编制' : '否';
    //         } else {
    //             return text = "编制";
    //         }
    //     }
    // },
    {
        title: '申请人',
        code: 'wfawaiter',
        align: 'center',
        width: 80,
        formType: EpsFormType.Input
    },

    {
        title: "申请单位",
        code: 'dwmc',
        align: 'center',
        formType: EpsFormType.Input,
        width: 100,

    },
    {
        title: "申请部门",
        code: 'bm',
        align: 'center',
        formType: EpsFormType.Input,
        width: 100,

    },
    {
        title: "所属全宗",
        code: 'ssjzmc',
        align: 'center',
        formType: EpsFormType.Input,
        width: 100,

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
        title: "协查内容",
        code: "lymd",
        align: 'center',

        width: 150,
        formType: EpsFormType.Input,
        render: (text) => {
            if (text) {
              for (var i = 0; i < NewDajyStore.lymdDataSelect.length; i++) {
                if (text === NewDajyStore.lymdDataSelect[i].bh) {
                  text = NewDajyStore.lymdDataSelect[i].label
                }
              }
              return text;
            }
          }

    },
    {
        title: "简要说明",
        code: "bz",
        align: 'center',

        width: 200,
        formType: EpsFormType.Input,

    },
    {
        title: "借阅天数",
        code: "jyts",
        align: 'center',

        width: 60,
        formType: EpsFormType.Input,

    },
    {
        title: "申请时间",
        code: "sqrq",
        align: 'center',
        width: 140,
        formType: EpsFormType.Input,
        render: (text) => {
                return text.substring(0,19)
        }

    },
    {
        title: "查看",
        code: 'ck',
        width: 50,
        align: 'center',
        formType: EpsFormType.Input,
        render: (text) => {
            if (text) {
                return text === 'Y' ? '是' : '否';
            } else {
                return text = "无";
            }
        }

    },
    {
        title: "打印",
        code: 'dy',
        width: 50,
        align: 'center',
        formType: EpsFormType.Input,
        render: (text) => {
            if (text) {
                return text === 'Y' ? '是' : '否';
            } else {
                return text = "无";
            }
        }

    },
    {
        title: '下载',
        code: 'xz',
        width: 50,
        align: 'center',
        formType: EpsFormType.None,
        render: (text) => {
            if (text) {
                return text === 'Y' ? '是' : '否';
            } else {
                return text = "无";
            }
        }
    }]

    const title: ITitle = {
        name: '加入协查单'
    }
    return (
        <>
            <EpsPanel title={title}                    // 组件标题，必填
                source={source}                          // 组件元数据，必填
                tableProp={tableProp}                    // 右侧表格设置属性，选填
                tableService={XcdService}             // 右侧表格实现类，必填
                ref={ref}                                // 获取组件实例，选填
                formWidth={450}
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
export default XcdList
