import React, { useEffect, useState, useRef } from 'react';
import {EpsPanel, EpsTableStore} from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import {EpsSource, ITable, ITree} from '@/eps/commons/declare';
import {Col, Form, Input, Row, Select} from 'antd';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import SelectService from "@/pages/base/sjzdmx/selectService";
import SjzdmxService from "@/pages/base/sjzdmx/sjzdmxService";
import DwService from '@/eps/business/DwTableLayout/service/DwService';

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
    const sjzdmxStore = useLocalObservable(() => (
        {
            params: {},
            dwTreeData: [],
            dwData: [],
            sjzdSelectData:[],

           /* async queryTreeDwList() {
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
            },*/

             async querySjzdList() {
                const response=await fetch.get(`/api/eps/control/main/sjzdmx/querySjzdList`);
                 if (response.status === 200) {
                     if (response.data.length > 0) {
                     this.sjzdSelectData = response.data.map(o => ({ 'id': o.id, 'label': o.bh+'|'+o.mc, 'value': o.id,'key':o.id }));

                         console.log("sjzdSelectData",this.sjzdSelectData);

                     }
                     return;
                 }
             },

        }

    ));



  const treeProp: ITree = {
    treeSearch: false,
    treeCheckAble: false
  }


    const [sjzdData, setSjzdData]= useState<Array<Object>>([]);

    // 自定义表单

    const span = 24;
    const _width = 240
    const customForm = (form, store) => {

        return (
            <>
                <Row gutter={20}>
                    <Col span={span}>
                    <Form.Item label="数据字典:" name="fid" required rules={[{ required: true, message: '请选择' }]}>
                        <Select  className="ant-select"   placeholder="请选择"   options={sjzdData} style={{width:  _width}}/>
                    </Form.Item>
                    </Col>
                    <Col span={span}>
                    <Form.Item label="编号:" name="bh" required rules={[{ required: true, message: '请输入编号' }]}>
                        <Input  className="ant-input"  style={{width:  _width}} onChange={()=>{console.log("++++++++++++,++++++++++", store.key, store.params)}}/>
                    </Form.Item>
                    </Col>
                    <Col span={span}>
                    <Form.Item label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]}>
                        <Input  className="ant-input"  style={{width:  _width}} />
                    </Form.Item>
                    </Col>
                    <Col span={span}>
                    <Form.Item label="默认值:" name="defalutvalue" >
                        <Input  className="ant-input"  style={{width:  _width}} />
                    </Form.Item>
                    </Col>
                    <Col span={span}>
                    <Form.Item label="维护人:" name="whr" >
                        <Input disabled defaultValue={yhmc} className="ant-input"  style={{width:  _width}} />
                    </Form.Item>
                    </Col>
                    <Col span={span}>
                    <Form.Item label="维护时间:" name="whsj" >
                        <Input disabled defaultValue={getDate} className="ant-input"  style={{width:  _width}} />
                    </Form.Item>
                    </Col>
                </Row>

            </>
        )
    }


    const [initParams, setInitParams] = useState({})
    const ref = useRef();
    const [tableStore , setTableStore]= useState<EpsTableStore>()

    useEffect(() => {
     /*   sjzdmxStore.queryTreeDwList();
        sjzdmxStore.queryDwList();*/
        sjzdmxStore.querySjzdList();
        setTableStore(ref.current.getTableStore());

    }, []);

    useEffect(() => {
        const querySjzdList = async () => {
            if(tableStore){

                console.log('tableStore,', tableStore.key, tableStore.params)
                let url="/api/eps/control/main/sjzdmx/querySjzdList";
                if(tableStore.params.treeData && tableStore.params.treeData !=""){
                    url=url+"?dwid="+tableStore.params.treeData;
                }
                const response=await fetch.get(url);
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        let  SjzdData = response.data.map(o => ({ 'id': o.id, 'label': o.bh+'|'+o.mc, 'value': o.id,'key':o.id }));
                        setSjzdData(SjzdData);

                    }else{
                        setSjzdData(response.data);
                    }
                }
            }

        }
        querySjzdList()
    }, [tableStore?.key])

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


  const tableProp: ITable = {
    tableSearch: false,
  }

    /**
     * 查询
     * @param {*} current
     */
/*    const OnSearch = (values: any, store: EpsTableStore) => {
        store && store.findByKey(store.key, 1, store.size, values);
    };*/

    // 自定义查询按钮
    const customAction = (store: EpsTableStore) => {
        return ([
            <>

            </>
        ])
    }



    return (

        <EpsPanel
            title={title}
            source={source}
            ref={ref}
            tableProp={tableProp}
            treeService={DwService}
            treeProp={treeProp}
         //   customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={SjzdmxService}
            customForm={customForm}
            customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            searchForm={searchFrom}
            initParams={initParams}
            noRender={true}
            selectService={SelectService}
        >
        </EpsPanel>

    );
})

export default Sjzdmx;
