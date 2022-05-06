import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, TreeSelect, DatePicker, message, Modal } from 'antd';
import fetch from "../../../utils/fetch";
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import RecycleBinService from '@/services/dagl/recycleBin/RecycleBinService';
import { ITable, ITitle } from '@/eps/commons/declare';
import { observer, useLocalObservable } from 'mobx-react';
import { useRef } from 'react';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import Recover from './Recover';
import Deleted from './Deleted';
import { CloseCircleOutlined, UndoOutlined, DeleteOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { useForm } from 'antd/lib/form/Form';


//回收站
const RecycleBinView = observer((props) => {
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
            async queryDwOrgTree() {
                const response = await fetch.get(`/api/eps/control/main/org/queryDwOrgTreeAntD?dwid=${this.org_dw_id}&pageIndex=${this.org_page_No}&pageSize=${this.org_page_Size}`);
                if (response.status === 200) {
                    this.orgData = response.data;
                    return;
                }
            },

            //默认为 false
            isModalVisible: false,
            // 确认界面
            setIsModalVisible(visible: boolean) {
                this.isModalVisible = visible;
            },

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


    //删除所选
    const recycleRemove = async (ids) => {
        if (ids.length > 0) {
            const RemoveFunc = async () => {
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
                data['dakid'] = props.store.dakid;
                data['daklx'] = props.store.ktable.daklx;
                data['ids'] = idss.toString();
                data['tmzt'] = props.store.tmzt;
                data['whr'] = systemConfStore.yhmc;
                data['whrid'] = systemConfStore.yhid;

                var res = await RecycleBinService.recycleRemove(data);
                if (res.success) {
                    message.success("操作成功,回收站数据已经删除!")
                } else {
                    message.warning("操作失败!")
                }
                const tableStore = ref.current?.getTableStore();
                tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, props.store);
            }
            const handleCancel = () => {
                console.log('Clicked cancel button');
            };
            confirm({
                title: '确定要删除选中的数据吗?',
                icon: <ExclamationCircleOutlined />,
                content: '数据删除后将无法恢复，请谨慎操作',
                okText: '删除',
                okType: 'danger',
                cancelText: '取消',
                onOk: RemoveFunc,
                onCancel: handleCancel,
            });
        } else {
            message.warning("操作失败,请至少选择一行数据!")
            return
        }
    };


    //删除全部
    const recycleAllRemove = async () => {
        var res = await RecycleBinService.findByKey("", 0, 9999, props.store);
        if (res.results && res.results.length > 0) {
            const RemoveAllFunc = async () => {
                let data: Object = {}
                var ids = [];
                if (res.results && res.results.length > 0) {
                    for (var i = 0; i < res.results.length; i++) {
                        ids.push(res.results[i].id);
                    }
                    data['bmc'] = props.store.ktable.bmc;
                    data['dakid'] = props.store.dakid;
                    data['daklx'] = props.store.ktable.daklx;
                    data['ids'] = ids.toString();
                    data['tmzt'] = props.store.tmzt;
                    data['whr'] = systemConfStore.yhmc;
                    data['whrid'] = systemConfStore.yhid;
                    var success = await RecycleBinService.recycleAllRemove(data);
                    const tableStore = ref.current?.getTableStore();
                    tableStore && await tableStore.findByKey(tableStore.key, 1, tableStore.size, props.store);
                    message.success("操作成功,回收站数据已经全部删除!")
                }
            }

            const handleCancel = () => {
                console.log('Clicked cancel button');
            };
            confirm({
                title: '确定要删除全部的数据吗?',
                icon: <ExclamationCircleOutlined />,
                content: '数据删除后将无法恢复，请谨慎操作',
                okText: '删除',
                okType: 'danger',
                cancelText: '取消',
                onOk: RemoveAllFunc,
                onCancel: handleCancel,
            });
        } else {
            message.warning("回收站已经全部删除!")
        }
    };

    //还原所选
    const recycleRestore = async (ids) => {
        if (ids.length > 0) {
            const RestoreFunc = async () => {
                let data: Object = {}
                var idss = [];
                if (ids.length > 0) {
                    for (var i = 0; i < ids.length; i++) {
                        idss.push(ids[i].id);
                    }
                }
                data['bmc'] = props.store.ktable.bmc;
                data['dakid'] = props.store.dakid;
                data['daklx'] = props.store.ktable.daklx;
                data['ids'] = idss.toString();
                data['tmzt'] = props.store.tmzt;
                data['whr'] = systemConfStore.yhmc;
                data['whrid'] = systemConfStore.yhid;
                var res = await RecycleBinService.recycleRestore(data);

                if (res.success) {
                    message.success("操作成功,回收站数据已经还原!")
                } else {
                    message.warning("操作失败!")
                }
                const tableStore = ref.current?.getTableStore();
                tableStore && tableStore.findByKey(tableStore.key, 1, tableStore.size, props.store);
            }
            const handleCancel = () => {
                console.log('Clicked cancel button');
            };
            confirm({
                title: '确定要还原选中的数据吗?',
                icon: <ExclamationCircleOutlined />,
                // content: '数据删除后将无法恢复，请谨慎操作',
                okText: '还原',
                okType: 'danger',
                cancelText: '取消',
                onOk: RestoreFunc,
                onCancel: handleCancel,
            });
        } else {
            message.warning("操作失败,请至少选择一行数据!")
            return
        }

    };
    //还原全部
    const recycleAllRestore = async () => {
        var res = await RecycleBinService.findByKey("", 0, 9999, props.store);
        if (res.results && res.results.length > 0) {
            const RestoreAllFunc = async () => {
                let data: Object = {}
                var ids = [];
                if (res.results && res.results.length > 0) {
                    for (var i = 0; i < res.results.length; i++) {
                        ids.push(res.results[i].id);
                    }
                    data['bmc'] = props.store.ktable.bmc;
                    data['dakid'] = props.store.dakid;
                    data['daklx'] = props.store.ktable.daklx;
                    data['ids'] = ids.toString();
                    data['tmzt'] = props.store.tmzt;
                    data['whr'] = systemConfStore.yhmc;
                    data['whrid'] = systemConfStore.yhid;
                    var success = await RecycleBinService.recycleRestore(data);
                    const tableStore = ref.current?.getTableStore();
                    tableStore && await tableStore.findByKey(tableStore.key, 1, tableStore.size, props.store);
                    message.success("操作成功,回收站数据已经全部还原!")
                }
            }
            const handleCancel = () => {
                console.log('Clicked cancel button');
            };
            confirm({
                title: '确定要还原所有的数据吗?',
                icon: <ExclamationCircleOutlined />,
                // content: '数据删除后将无法恢复，请谨慎操作',
                okText: '还原',
                okType: 'danger',
                cancelText: '取消',
                onOk: RestoreAllFunc,
                onCancel: handleCancel,
            });
        } else {
            message.warning("回收站已经全部还原!")
        }
    };

    // 自定义功能按钮
    const customAction = (store: EpsTableStore, ids: any[]) => {
        return ([
            <>
                <Form form={form} layout="inline" onFinish={OnSearch} >
                    <Form.Item label="" name="keyValue" className="form-item">
                        <Input style={{ width: 300 }} allowClear placeholder="请输入关键字/模糊查询" ></Input>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Form>
                <Button type="primary" onClick={() => recycleRemove(ids)} icon={<DeleteOutlined />} danger>删除所选</Button>
                <Button type="primary" onClick={() => recycleAllRemove()} icon={<CloseCircleOutlined />} danger>删除全部</Button>
                <Button type="primary" onClick={() => recycleRestore(ids)} icon={<UndoOutlined />} >还原所选</Button>
                <Button type="primary" onClick={() => recycleAllRestore()} icon={<CheckOutlined />} >还原全部</Button>
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
            const list = Array.isArray(response.data) ? response.data : []
            // if (response.data) {
            let filterData = list.filter(item => item.lbkj === "Y")
            let zjkData = filterData.map(o => (
                { 'title': o.ms, 'code': o.mc.toLowerCase(), 'align': 'center', 'formType': EpsFormType.Input, width: 120 }
            ));
            setSource(zjkData);
            // }
        }
    }

    useEffect(() => {
        querymbzlxList(props.store.dakid, props.store.tmzt, props.store.tmzt);
    }, [props.store.dakid, props.store.tmzt, props.store.tmzt]);

    const title: ITitle = {
        name: '回收站'
    }

    return (
        <>
            <EpsPanel title={title}
                // 组件标题，必填
                source={source}                          // 组件元数据，必填
                tableProp={tableProp}                    // 右侧表格设置属性，选填
                tableService={RecycleBinService}              // 右侧表格实现类，必填
                ref={ref}                                // 获取组件实例，选填
                formWidth={500}
                initParams={props.store}
                //searchForm={searchFrom}
                customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
                customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
                customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            >
            </EpsPanel>
        </>
    )
})
export default RecycleBinView
