import React, { useEffect, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import WdscService from './wdscService';
import { EpsSource, ITable } from "@/eps/commons/declare";
import { Col, Form, Input, Row } from 'antd';
import EpsReportButton from "@/eps/components/buttons/EpsReportButton/index";
import { observer } from 'mobx-react';
import HandleWdsc from './HandleWdsc';

const FormItem = Form.Item;


const tableProp: ITable = {
    tableSearch: true,
    disableEdit: true,
    // disableDelete:true,
    disableAdd: true,
    disableCopy: true,
    afterDelete: window.top.RightStore.queryAllDbswCount()
    // rowSelection: {
    //     type: 'checkbox',
    // }

}


const WDSC = observer((props) => {

    const [umid, setUmid] = useState('');


    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(WdscService));
    const customTableAction = (text, record, index, store) => {

        return (<>
            {[
                HandleWdsc(text, record, index, store),
            ]}
        </>)
    }

    useEffect(() => {
        setUmid('DALY016');
    }, []);




    const source: EpsSource[] = [{
        title: '题名',
        code: 'tm',
        ellipsis: true,
        align: 'center',
        width: 150,
        formType: EpsFormType.Input
    },
    {
        title: '档号',
        code: 'dh',
        align: 'center',
        width: 120,
        formType: EpsFormType.Input
    }, {
        title: "密级",
        code: "mj",
        align: 'center',
        width: 120,
        formType: EpsFormType.Input

    }, {
        title: "保管期限",
        code: 'bgqx',
        align: 'center',
        width: 120,
        formType: EpsFormType.Input
    }, {
        title: "条目信息",
        code: 'tmxx',
        align: 'center',
        ellipsis: true,
        width: 300,
        formType: EpsFormType.Input
    }, {
        title: "全宗号",
        code: 'qzh',
        align: 'center',
        width: 120,
        formType: EpsFormType.Input
    },
    {
        title: '全宗名称',
        code: 'qzmc',
        align: 'center',
        width: 200,
        ellipsis: true,
        formType: EpsFormType.Input
    },

    ]
    const title = {
        name: '我的收藏'
    }

    return (
        <EpsPanel
            title={title}
            source={source}
            tableProp={tableProp}
            formWidth={500}
            customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={WdscService}
        //      customForm={customForm}
        //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        >
        </EpsPanel>
    );
})

export default WDSC;

