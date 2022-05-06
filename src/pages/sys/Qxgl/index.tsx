import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable, ITree } from '@/eps/commons/declare';
import { Col, Form, Input, Row, Select, Tag } from 'antd';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import SelectService from "@/pages/sys/Qxgl/selectService";
import StflmxService from "@/pages/base/stflmx/stflmxService";
import DwService from '@/eps/business/DwTableLayout/service/DwService';



const Qxgl = observer((props) => {
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
    const qxglStore = useLocalObservable(() => (
        {
            mkData: [],
            async queryMkForList() {
                const response = await fetch.get(`/api/eps/control/main/mk/queryForList`);
                if (response && response.status === 200) {
                    this.mkData = response.data.map(mk => ({ 'key': mk.mkbh, 'id': mk.mkbh, 'label': mk.mc, 'value': mk.mkbh }));
                    console.log("this.mkData", this.mkData)
                }
                return;

            },
        }
    ));
    const tableProp: ITable = {
        tableSearch: false,
        disableDelete: true,
        disableEdit: true,
        disableAdd: true,
    }

    const treeProps: ITree = {
        treeCheckAble: true,
    }

    const [initParams, setInitParams] = useState({})
    const ref = useRef();


    useEffect(() => {
        qxglStore.queryMkForList();
    }, []);

    const source: EpsSource[] = [
        {
            title: '功能编号',
            code: 'bh',
            width: '80px',
            formType: EpsFormType.Input
        },
        {
            title: '名称',
            code: 'mc',
            width: '120px',
            formType: EpsFormType.Input
        },
        {
            title: '权限',
            code: 'bgqx',

            width: '350px',
            formType: EpsFormType.Input
        },
    ]
    const title = {
        name: '权限管理'
    }


    const options = qxglStore.mkData;
    const handleChange = (value) => {
        //显示弹框页面
        console.log(`Selected: ${value}`);

    }

    // 自定义查询按钮
    const customAction = (store: EpsTableStore) => {

        return ([
            <>
                <Select
                    mode="tags"
                    allowClear
                    placeholder="请选择"
                    onChange={handleChange}
                    style={{ width: '60%' }}
                    options={options}
                >

                </Select>
            </>
        ])
    }



    return (

        <EpsPanel
            title={title}
            source={source}
            ref={ref}
            treeService={DwService}
            tableProp={tableProp}
            //   customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={StflmxService}

            customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            //searchForm={searchFrom}
            initParams={initParams}
            noRender={true}
            treeProp={treeProps}

            selectService={SelectService}
        >
        </EpsPanel>

    );
})

export default Qxgl;
