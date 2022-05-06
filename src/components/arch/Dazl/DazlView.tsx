import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, TreeSelect, DatePicker, message, Modal } from 'antd';
import fetch from "../../../utils/fetch";
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import DazlService from '@/services/dagl/dazl/DazlService';
import { ITable, ITitle } from '@/eps/commons/declare';
import { observer, useLocalObservable } from 'mobx-react';
import { useRef } from 'react';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import Recover from './Recover';
import Deleted from './Deleted';
import { SortDescendingOutlined, UndoOutlined, RedoOutlined, CheckOutlined, ExclamationCircleOutlined, SortAscendingOutlined, SwapOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { useForm } from 'antd/lib/form/Form';
import records from '@/locales/zh-CN/ocroad/records';



//档案整理
const DazlView = observer((props) => {
    //系统参数指允许按照系统配置
    const ref = useRef()
    const [form] = useForm()


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
            orgData: [],
            org_page_No: 1,
            org_page_Size: 1,
            org_dw_id: SysStore.getCurrentCmp().id,
        }
    ));

    // 自定义表格行按钮
    const customTableAction = (text, record, index, store) => {
        return [
            <Recover record={record} ids={props.store.ids} store={store} key={'Recover' + index} />,
            <Deleted record={record} ids={props.store.ids} store={store} key={'Deleted' + index} />

        ];
    };

    /**
      * 查询
      * @param {*} current
      */
    const OnSearch = (values: any) => {
        var val = values.keyValue
        const tableStore = ref.current?.getTableStore();

        tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, { keyValue: val, ...props.store });
    };


    //按模板排序刷新
    const RefreshLshG = async () => {
        let data: Object = {}
        data['mbid'] = props.store.ktable.mbid;
        data['bmc'] = props.store.ktable.bmc;
        data['lx'] = "G";
        data['tmzt'] = props.store.tmzt;
        data['mblx'] = props.store.ktable.daklx;
        data['yhid'] = systemConfStore.yhid;
        var res = await DazlService.refreshDakPx(data);
        if (res) {
            message.success("模板排序刷新成功!")
        }
        const tableStore = ref.current?.getTableStore();
        tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, props.store);
    };

    //按综合排序刷新
    const RefreshLshZ = async () => {
        let data: Object = {}
        data['mbid'] = props.store.ktable.mbid;
        data['bmc'] = props.store.ktable.bmc;
        data['lx'] = "Z";
        data['tmzt'] = props.store.tmzt;
        data['mblx'] = props.store.ktable.daklx;
        data['yhid'] = systemConfStore.yhid;
        var res = await DazlService.refreshDakPx(data);
        if (res) {
            message.success("综合排序刷新成功!")
        }
        const tableStore = ref.current?.getTableStore();
        tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, props.store);
    };


    //生成档号
    const createDh = async (ids: string | any[]) => {
        const createFunc = async () => {
            let data: Object = {}
            var idss = [];
            if (ids.length > 0) {
                for (var i = 0; i < ids.length; i++) {
                    idss.push(ids[i].id);
                }
            } else {
                message.warning("操作失败,请至少选择一行数据!")
                return
            }

            data['bmc'] = props.store.ktable.bmc;
            data['daklx'] = props.store.ktable.daklx;
            data['mbid'] = props.store.ktable.mbid;
            data['dakid'] = props.store.dakid;
            data['yhid'] = systemConfStore.yhid;
            data['ids'] = idss.toString();
            console.log("data", data);
            var res = await DazlService.createDh(data);
            debugger;
            console.log("res", res);
            if (res.success) {
                message.success("生成档号成功!")
            } else {
                message.warning(res.message);
            }
            const tableStore = ref.current?.getTableStore();
            tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, props.store);


        }
        const handleCancel = () => {
            console.log('Clicked cancel button');
        };
        confirm({
            title: '确定要生成档号吗?',
            icon: <ExclamationCircleOutlined />,
            // content: '数据删除后将无法恢复，请谨慎操作',
            okText: '生成',
            okType: 'danger',
            cancelText: '取消',
            onOk: createFunc,
            onCancel: handleCancel,
        });
    };
    //下调
    const dataDown = async (store) => {

        if (!store.checkedRows[0]) {
            message.warning("操作失败,请至少选择一行数据!")
            return
        }
        let data: Object = {}
        let pxzd = "xmpx";
        if (props.store.ktable.daklx.length > 2) {
            pxzd = "xdpx";
        }
        // const tablelist = JSON.parse(JSON.stringify(store.tableList));
        // let m2index;
        // if(Array.isArray(store.checkedRows)){
        //     for(let item of store.checkedRows){
        //         m2index=tablelist.findIndex(it => JSON.stringify(it) === JSON.stringify(item));

        //     }
        // }
        // console.log("m2index",m2index);

        let record = store.checkedRows[0];
        let new_tablelist = store.tableList;
        let index = new_tablelist.indexOf(record);

        if (index === (new_tablelist.length - 1)) {
            message.warning("操作失败,该条数据已经在最底部!")
            return
        }

        let m1_pxzd = new_tablelist[index + 1][pxzd];
        let m2_pxzd = record[pxzd];
        let m1 = new_tablelist[index + 1].id;
        let m2 = record.id;
        data['bmc'] = props.store.ktable.bmc;
        data['daklx'] = props.store.ktable.daklx;
        data['pxzd'] = pxzd;
        data['m1'] = m1 + "," + m1_pxzd;
        data['m2'] = m2 + "," + m2_pxzd;
        var res = await DazlService.dataDown(data);
        if (res) {
            message.success("下调设置成功!")
        }
        const tableStore = ref.current?.getTableStore();
        tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, props.store);
    };
    //上调
    const dataUp = async (store) => {
        if (!store.checkedRows[0]) {
            message.warning("操作失败,请至少选择一行数据!")
            return
        }
        let data: Object = {}
        let pxzd = "xmpx";
        if (props.store.ktable.daklx.length > 2) {
            pxzd = "xdpx";
        }
        let record = store.checkedRows[0];
        let new_tablelist = store.tableList;
        let index = new_tablelist.indexOf(record);

        if (index <= 0) {
            message.warning("操作失败,该条数据已经在最顶部!")
            return
        }

        let m1_pxzd = new_tablelist[index - 1][pxzd];
        let m2_pxzd = record[pxzd];
        let m1 = new_tablelist[index - 1].id;
        let m2 = record.id;
        data['bmc'] = props.store.ktable.bmc;
        data['daklx'] = props.store.ktable.daklx;
        data['pxzd'] = pxzd;
        data['m1'] = m1 + "," + m1_pxzd;
        data['m2'] = m2 + "," + m2_pxzd;


        var res = await DazlService.dataUp(data);
        if (res) {
            message.success("上调设置成功!")
        }
        const tableStore = ref.current?.getTableStore();
        tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, props.store);
    };
    //互换
    const dataExchange = async (ids: string | any[]) => {
        var idss = [];
        if (ids.length === 2) {
            for (var i = 0; i < ids.length; i++) {
                idss.push(ids[i].id);
            }
        } else {
            message.warning("操作失败,请选择两行数据!")
            return
        }
        let data: Object = {}
        data['bmc'] = props.store.ktable.bmc;
        data['daklx'] = props.store.ktable.daklx;
        data['mbid'] = props.store.ktable.mbid;
        data['dakid'] = props.store.dakid;
        data['ids'] = idss.toString();

        var res = await DazlService.dataExchange(data);
        if (res) {
            message.success("互调设置成功!")
        }
        const tableStore = ref.current?.getTableStore();
        tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, props.store);
    };





    // 自定义功能按钮
    const customAction = (store: EpsTableStore, ids: any[]) => {
        return ([
            <>

                {/* <Form form={form} layout="inline" onFinish={OnSearch} >
                    <Form.Item label="" name="keyValue" className="form-item">
                        <Input style={{ width: 300 }} allowClear placeholder="请输入关键字/模糊查询" ></Input>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Form> */}
                <Button type="primary" onClick={() => createDh(ids)} icon={<CheckOutlined />} >生成档号</Button>
                <Button type="primary" onClick={() => RefreshLshG()} icon={<RedoOutlined />} >按模板排序刷新</Button>
                <Button type="primary" onClick={() => RefreshLshZ()} icon={<UndoOutlined />} >按综合排序刷新</Button>
                {/* <Button type="primary" onClick={() => dataUp(store)} icon={<SortDescendingOutlined />} >上调</Button>
                <Button type="primary" onClick={() => dataDown(store)} icon={<SortAscendingOutlined />} >下调</Button> */}
                <Button type="primary" onClick={() => dataExchange(ids)} icon={<SwapOutlined />} >互调</Button>


            </>
        ])
    }



    const tableProp: ITable = {
        tableSearch: false,
        disableAdd: true,
        disableEdit: true,
        disableDelete: true,
        disableCopy: true,
        rowSelection: { type: 'checkbox' }

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

    const [source, setSource] = useState<Array<{ title: string; label: string; align: string; formType: string }>>([]);

    const querymbzlxList = async (dakid: String = "", tmzt: String = "", lx: String = "") => {
        const response = await fetch.get(`/api/eps/control/main/dagl/queryFormKFields?dakid=${dakid}&tmzt=${tmzt}&lx=${lx}&pg=list`);
        if (response.status === 200) {
            if (response.data) {
                let filterData = response.data.filter(item => item.lbkj === "Y")
                let zjkData = filterData.map(o => (
                    { 'title': o.ms, 'code': o.mc.toLowerCase(), 'align': 'center', 'formType': EpsFormType.Input, width: 120 }
                ));
                setSource(zjkData);
            }
        }
    }

    useEffect(() => {
        querymbzlxList(props.store.dakid, props.store.tmzt, props.store.tmzt);
    }, [props.store.dakid, props.store.tmzt, props.store.tmzt]);



    const title: ITitle = {
        name: '档案整理'
    }

    return (
        <>

            <EpsPanel title={title}
                // 组件标题，必填
                source={source}                          // 组件元数据，必填
                tableProp={tableProp}                    // 右侧表格设置属性，选填
                tableService={DazlService}              // 右侧表格实现类，必填
                ref={ref}                                // 获取组件实例，选填
                formWidth={500}
                initParams={props.store}

                //searchForm={searchFrom}
                customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
                // customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
                customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            >
            </EpsPanel>
        </>
    )
})
export default DazlView
