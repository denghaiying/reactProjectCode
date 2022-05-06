import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, TreeSelect } from 'antd';
import fetch from "../../../utils/fetch";
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import sxjcjgLogService from '@/pages/perfortest/Jcjg/service/SxjcjgLogService';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
const { Option } = Select;
import { observer, useLocalObservable } from 'mobx-react';
import { useRef } from 'react';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';

const sxjcjgLog = observer((props) => {

    const ref = useRef()
    //初始化数据
    useEffect(() => {
        //初始化单位列表

    }, [])



    // 自定义功能按钮
    const customAction = (store: EpsTableStore) => {
        return ([
            <>
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
    // 自定义编辑表单
    const customForm = () => {

        return (
            <>
            </>
        )
    }

    const source: EpsSource[] = [{
        title: '检测数据',
        code: 'sxjcjcLogjcsjh',
        align: 'center',
        ellipsis: true,         // 字段过长自动东隐藏
        width: 200,
        formType: EpsFormType.Input
    }, {
        title: '真实性检测',
        code: 'sxjcjcLogjczsjg',
        align: 'center',
        width: 120,
        formType: EpsFormType.Input
    },

    {
        title: "安全性检测",
        code: 'sxjcjcLogjckkjg',
        align: 'center',
        formType: EpsFormType.Input,
        width: 140,

    }, {
        title: "完整性检测",
        code: 'sxjcjcLogjcwzjg',
        align: 'center',
        width: 140,
        formType: EpsFormType.Input,

    }, {
        title: "可用性检测",
        code: "sxjcjcLogjckyjg",
        align: 'center',
        width: 140,
        formType: EpsFormType.Input,

    }]

    const title: ITitle = {
        name: '详情'
    }

    return (
        <>

            <EpsPanel title={title}                    // 组件标题，必填
                source={source}                          // 组件元数据，必填
                tableProp={tableProp}                    // 右侧表格设置属性，选填
                tableService={sxjcjgLogService}             // 右侧表格实现类，必填
                ref={ref}                                // 获取组件实例，选填
                //tableRowClick={(record) => console.log('abcef', record)} //点击事件
                //searchForm={searchFrom}
                customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
                //customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
                customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
                initParams={{'jgmxid':props.params.jgmxid}}
            >
            </EpsPanel>
        </>
    )
})
export default sxjcjgLog