import React, { useEffect, useState, useRef } from 'react';
import {EpsPanel, EpsTableStore} from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import {EpsSource, ITable, ITree} from '@/eps/commons/declare';
import {Col, DatePicker, Form, Input, Row, Select} from 'antd';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import SelectService from "@/pages/base/stflmx/selectService";
import StflmxService from "@/pages/base/stflmx/stflmxService";
import DwService from '@/eps/business/DwTableLayout/service/DwService';
import Store from "@/stores/datj/DacltjStore";
import SearchStore from "@/stores/datj/SearchStore";

const FormItem = Form.Item;


const Stflmx = observer((props) => {
    /**
     * 获取当前用户
     */
    const yhmc = SysStore.getCurrentUser().yhmc;
    /**
     * 获取当前时间
     */
    const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const [tableStore, setTableStore]= useState<EpsTableStore>(new EpsTableStore(StflmxService));

    const { TextArea } = Input;

    const umid="JC002";
    /**
     * childStore
     */
    const stflmxStore = useLocalObservable(() => (
        {
            params: {},
            dwTreeData: [],
            dwData: [],
            sjzdSelectData:[],
            bgqxData: [],
            stflData:[],


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

            async queryBgqx() {
                 const response = await fetch.get(`/api/eps/control/main/daly/querySjzd?zdx=保管期限`);
                if (response && response.status === 200) {
                        this.bgqxData = response.data.results.map(o => ({ 'id': o.mc, 'label': o.bh+"|"+o.mc, 'value': o.mc }));
                }else {
                    return;
                }
            },
            async queryfid() {
                const response = await fetch.get(`/api/eps/control/main/stflmx/queryTree?fid=`+EpsTableStore);
                if (response && response.status === 200) {
                    this.stflData = response.data.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.id }));
                }else {
                    return;
                }
            },


        }

    ));




  const treeProp: ITree = {
    treeSearch: false,
    treeCheckAble: false
  }


    const [sjflmxData, setSjflmxData]= useState<Array<Object>>([]);
    const [stflData, setStflData]= useState<Array<Object>>([]);
    const [stflValue, setStflValue]= useState<String>("");

    const stflchange=(value) =>{
        if (value) {

            fetch.get(`/api/eps/control/main/stflmx/queryStflmxList?flid=`+value).then(res => {
                if (res && res.status === 200) {
                    if (res.data.length > 0) {
                        let sdata = res.data.map(o => ({'id': o.id, 'label': o.bh + '|' + o.mc, 'value': o.id}));
                        setSjflmxData(sdata);
                    }
                }
            });
        }
    }

    useEffect(() => {
        const queryStflList = async () => {
            if(tableStore){
                console.log('tableStore,', tableStore.key, tableStore.params)

                let url="/api/eps/control/main/stflmx/queryStflList";
                if(tableStore.params.treeData && tableStore.params.treeData !=""){
                    url=url+"?dwid="+tableStore.params.treeData;
                }else{
                    url=url+"?dwid=";
                }
                const response=await fetch.get(url);
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        let  SjzdData = response.data.map(o => ({ 'id': o.id, 'label': o.bh+'|'+o.mc, 'value': o.id }));
                        setStflData(SjzdData);

                    }else{
                        setStflData(response.data);
                    }

                    setStflValue(tableStore.key);
                }
            }

        }
        queryStflList()
    }, [tableStore?.key])

    // 自定义表单

    const span = 24;
    const _width = 240
    const customForm = () => {

        return (
            <>
                <Row gutter={20}>
                    <Col span={span}>
                <Form.Item label="实体分类:" id ="stflflid" name="flid" >
                    <Select
                        className="ant-select"  style={{width:  _width}}
                        placeholder="请选择"
                        value={stflValue}
                        onChange={stflchange}
                        options={stflData}
                    >
                    </Select>

                </Form.Item>
                    </Col>
                    <Col span={span}>
                <Form.Item label="上级分类明细:" id="sjflmx" name="fid" >
                    <Select
                        options={sjflmxData}
                        placeholder="请选择"
                        className="ant-select"  style={{width:  _width}}
                    >
                    </Select>
                </Form.Item>
                    </Col>
                        <Col span={span}>
                <Form.Item label="编号:" name="bh" required rules={[{ required: true, message: '请输入编号' }]}>
                    <Input className="ant-input"  style={{width:  _width}} />
                </Form.Item>
                        </Col>
                    <Col span={span}>
                <Form.Item label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]}>
                    <Input className="ant-input"  style={{width:  _width}} />
                </Form.Item>
                    </Col>
                        <Col span={span}>
                <Form.Item label="保管期限:"  name="bgqx" >
                    <Select
                        className="ant-select"  style={{width:  _width}}
                        placeholder="请选择" options={stflmxStore.bgqxData}
                    >
                    </Select>
                </Form.Item>
                        </Col>
                    <Col span={span}>
                        <Form.Item label="开始时间:"  name="kssj" >
                           {/* <DatePicker format="YYYY-MM-DD"
                                className="ant-picker"  style={{width:  _width}}
                                placeholder="请选择"
                            >
                            </DatePicker>*/}
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="结束时间:" name="jssj" >
                           {/* <DatePicker format="YYYY-MM-DD"
                                className="ant-picker"  style={{width:  _width}}
                                placeholder="请选择"
                            >
                            </DatePicker>*/}
                            <Input className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                <Form.Item label="备注:" name="bz" >
                    <TextArea rows={2}  className="ant-input"  style={{width:  _width}} />
                </Form.Item>
                    </Col>
                        <Col span={span}>
                <Form.Item label="默认值:" name="defalutvalue" >
                    <Input className="ant-input"  style={{width:  _width}}/>
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


    useEffect(() => {
       /* stflmxStore.queryTreeDwList();
        stflmxStore.queryDwList();*/
        stflmxStore.queryBgqx();
        setTableStore(ref.current.getTableStore());
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
            title: '保管期限',
            code: 'bgqx',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '开始时间',
            code: 'kssj',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '结束时间',
            code: 'jssj',
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
            title: '备注',
            code: 'bz',
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
        name: '实体分类明细'
    }



    const searchFrom = () => {
        return (
            <>
                <FormItem label="名称" className="form-item" name="mc"><Input placeholder="请输入名称" /></FormItem >

                <FormItem label="编号" className="form-item" name="bh"><Input placeholder="请输入编号" /></FormItem >
            </>
        )
    }
  const tableProp: ITable = {
    tableSearch: false,
    disableIndex:true,
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
            tableService={StflmxService}
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

export default Stflmx;
