import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { EpsDakPanel, EpsMainTableStore } from '@/eps/components/panel/EpsDakPanel';
import EpsFormType from '@/eps/commons/EpsFormType';

import MainService from "./TableService";
import TreeService from "./treeService";

import EpsTimeline from "./EpsTimeline.tsx"
import { Button, Form, Input, notification, Modal, Badge, Drawer, Select } from "antd";
import SelectDialog from "@/pages/Appraisal/AppraisaApply/SelectDailog";
import AppraisaApplySelStore from "@/stores/appraisa/AppraisaApplySelStore.ts";
import DapubStore from "./DapubStore";
import util from "@/utils/util";
import { observer } from "mobx-react";
const FormItem = Form.Item;

const SelectDialStore = new AppraisaApplySelStore(`/api/eps/control/main/hkjd`, true, true);


const tableProp: ITable = {
    tableSearch: true,
    disableDelete: true,
    disableEdit: true,
    disableAdd: true,
    rowSelection: {
        type: "checkbox",
        // onChange: (value) => console.log(value)
    },
};
const params = util.getSStorage("arch_param");
const umid = "hkjd";
const dakid = params.id;
const bmc = params.mbc;
const tmzt = 3;
const daparams = { tmzt, dakid, ...params };


const treeProp: ITree = {
    treeSearch: false,
    treeCheckAble: false
}


const Dagl = observer((props) => {
    const [selectDialogParams, setSelectDialogParams] = useState({});
    const { dlgVisible, setDlgVisible } = SelectDialStore;
    const [zhjdVisiable, setZhjdVisiable] = useState(false);
    const [qxkfVisiable, setQxkfVisiable] = useState(false);
    const [iFrameHeight, setIFrameHeight] = useState(700);
    const [fileModalVisiable, setFileModalVisiable] = useState(false);
    const [selectRecordInfo, setSelectRecordInfo] = useState({});
    const [fileUrl, setFileUrl] = useState("");
    const [logVisible, setLogVisible] = useState(false);
    const [daktmid, setDaktmid] = useState("");
    const ref = useRef();
    // const FChild = forwardRef(EpsPanel);

    useEffect(() => {
        if (daparams.dakid) {
            DapubStore.getDaklist(daparams.dakid, daparams.tmzt, umid);
            DapubStore.getDDaklist(daparams.dakid, daparams.tmzt, umid);
        }
    }, []);





    const onButtonClick = () => {
        // `current` 指向已挂载到 DOM 上的文本输入元素
        let store = ref.current?.getTableStore()
        message.info(store.key || '当前未选中左侧树')
    };

    const colum = [{
        title: '鉴定状态',
        code: 'hkjd',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render: (text, record, index) => {
            if (text == 'Y') {
                return '已鉴定'
            } else if (text == 'D') {
                return '鉴定中';
            } else {
                return '未鉴定';
            }
        }
    }, {
        title: '划控状态',
        code: 'dahk',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render: (text, record, index) => {
            if (text == 'Y') {
                return '受控'
            } else if (text == 'N') {
                return '不受控';
            }
            return '';
        }

    }, ...DapubStore.columns]

    const childColumns=DapubStore.childColumns;


    console.log(childColumns);




    const callback = () => {
        let store = ref.current?.getTableStore()
        store.findByKey();

        ref.current.clearTableRowClick();
    };

    const title: ITitle = {
        name: '用户'
    }
    const doRunAction = (record, store, rows: any[]) => {
        //  setStore(store);
        console.log("rows", rows)
        if (record.length < 1) {
            notification.open({
                message: "提示",
                description: "请选择数据",
                onClick: () => {
                    console.log("Notification Clicked!");
                },
            });

            return;
        }
        let ids = record.join(",");
        //鉴定状态判断
        const yjjd = rows.filter(record => {
            return record.hkjd == "Y" || record.hkjd == 'I'
        })

        const wjd = rows.filter(record => {
            return !record.hkjd || record.hkjd == "N"
        })
        if (yjjd.length > 0) {
            if (wjd.length > 0) {
                notification.open({
                    message: "提示",
                    description: "部分档案已经做过划控鉴定，已经自动过滤",
                });
            }
            if (wjd.length == 0) {
                notification.open({
                    message: "提示",
                    description: "鉴定中，不能再次鉴定",
                });
                return;
            }

            ids = wjd.map(row => {
                return row.id;
            }).join(",");

            console.log(ids);

        }

        const params = {
            dakid: daparams.dakid,
            ids,
            bmc: daparams.mbc,
            dakmc: daparams.mc,
        };

        setSelectDialogParams(params);
        setDlgVisible(true);

    };

    const [menuProp, setMenuProp] = useState([
        {
            title: "划控鉴定",
            icon: "icon_import_white",
            onClick: doRunAction,
            color: "#30B0D5",
            toolbarShow: true,
        },
        {
            title: "直接划控",
            icon: "icon_import_white",
            onClick: (ids, store, records) => {
                setSelectRecordInfo({
                    ids, store, records
                })
                setZhjdVisiable(true)
            },
            color: "#CFA32A",
            toolbarShow: true,
        },
        {
            title: "取消划控",
            icon: "icon_import_white",
            onClick: (ids, store, records) => {
                setSelectRecordInfo({
                    ids, store, records
                })
                setQxkfVisiable(true)
            },
            color: "#CFA32A",
            toolbarShow: true,
        },
        {
            title: "条目日志",
            icon: "icon_import_white",
            onClick: (ids, store, records) => {
                viewLog(
                    ids, store, records
                )
            },
            color: "#CFA32A",
            toolbarShow: true,
        },
    ]);


    const searchFrom = () => {
        return (
            <>
                <FormItem label="流程标题" className="form-item" name="title"><Input placeholder="请输入流程标题" /></FormItem >
                <Form.Item label="待办状态" className="form-item" name="status">
                    <Select placeholder="请选择待办状态"></Select>
                </Form.Item>
            </>
        )
    }

    return (
        <>
            <EpsDakPanel title={title}                            // 组件标题，必填
                source={colum}                          // 组件元数据，必填
                childSource={childColumns}                          // 组件元数据，必填
                treeProp={treeProp}                      // 左侧树 设置属性,可选填
                treeService={TreeService}                  // 左侧树 实现类，必填
                mainTableProp={tableProp}                    // 右侧表格设置属性，选填
                mainTableService={MainService}                 // 右侧表格实现类，必填
                childTableService={MainService}
                childTableProp={tableProp}
                ref={ref}                                // 获取组件实例，选填
                mainMenuProp={menuProp}                      // 右侧菜单 设置属性，选填
                mainSearchForm={searchFrom}                  // 高级搜索组件，选填
            // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            //   customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
            // 自定义全局按钮（如新增、导入、全局打印等），选填
            >
            </EpsDakPanel>
            <SelectDialog params={selectDialogParams} jdcode={"hkjd"} umid={"DAJD013"} SelectDialStore={SelectDialStore} callback={callback} visible={dlgVisible} />

        </>
    );
});

export default Dagl;
