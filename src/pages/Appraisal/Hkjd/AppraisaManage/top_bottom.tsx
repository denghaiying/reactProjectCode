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
        // `current` ?????????????????? DOM ????????????????????????
        let store = ref.current?.getTableStore()
        message.info(store.key || '????????????????????????')
    };

    const colum = [{
        title: '????????????',
        code: 'hkjd',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render: (text, record, index) => {
            if (text == 'Y') {
                return '?????????'
            } else if (text == 'D') {
                return '?????????';
            } else {
                return '?????????';
            }
        }
    }, {
        title: '????????????',
        code: 'dahk',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render: (text, record, index) => {
            if (text == 'Y') {
                return '??????'
            } else if (text == 'N') {
                return '?????????';
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
        name: '??????'
    }
    const doRunAction = (record, store, rows: any[]) => {
        //  setStore(store);
        console.log("rows", rows)
        if (record.length < 1) {
            notification.open({
                message: "??????",
                description: "???????????????",
                onClick: () => {
                    console.log("Notification Clicked!");
                },
            });

            return;
        }
        let ids = record.join(",");
        //??????????????????
        const yjjd = rows.filter(record => {
            return record.hkjd == "Y" || record.hkjd == 'I'
        })

        const wjd = rows.filter(record => {
            return !record.hkjd || record.hkjd == "N"
        })
        if (yjjd.length > 0) {
            if (wjd.length > 0) {
                notification.open({
                    message: "??????",
                    description: "?????????????????????????????????????????????????????????",
                });
            }
            if (wjd.length == 0) {
                notification.open({
                    message: "??????",
                    description: "??????????????????????????????",
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
            title: "????????????",
            icon: "icon_import_white",
            onClick: doRunAction,
            color: "#30B0D5",
            toolbarShow: true,
        },
        {
            title: "????????????",
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
            title: "????????????",
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
            title: "????????????",
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
                <FormItem label="????????????" className="form-item" name="title"><Input placeholder="?????????????????????" /></FormItem >
                <Form.Item label="????????????" className="form-item" name="status">
                    <Select placeholder="?????????????????????"></Select>
                </Form.Item>
            </>
        )
    }

    return (
        <>
            <EpsDakPanel title={title}                            // ?????????????????????
                source={colum}                          // ????????????????????????
                childSource={childColumns}                          // ????????????????????????
                treeProp={treeProp}                      // ????????? ????????????,?????????
                treeService={TreeService}                  // ????????? ??????????????????
                mainTableProp={tableProp}                    // ?????????????????????????????????
                mainTableService={MainService}                 // ??????????????????????????????
                childTableService={MainService}
                childTableProp={tableProp}
                ref={ref}                                // ???????????????????????????
                mainMenuProp={menuProp}                      // ???????????? ?????????????????????
                mainSearchForm={searchFrom}                  // ???????????????????????????
            // ?????????????????????(????????????????????????????????????????????????????????????????????????????????????????????????)?????????
            //   customTableAction={customTableAction}    // ????????????????????????(?????????+ToolTip????????????????????????)?????????
            // ????????????????????????????????????????????????????????????????????????
            >
            </EpsDakPanel>
            <SelectDialog params={selectDialogParams} jdcode={"hkjd"} umid={"DAJD013"} SelectDialStore={SelectDialStore} callback={callback} visible={dlgVisible} />

        </>
    );
});

export default Dagl;
