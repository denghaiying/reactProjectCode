import React, { useEffect, useRef, useState } from "react";
import { EpsPanel } from "@/eps/components/panel/EpsPanel2";
import EpsFormType from "@/eps/commons/EpsFormType";
import TableService from "./TableService";
import jnService from "./ChildTableService";
import DwService from "./treeService";
import childTreeService from "./childTreeService";
import JnTreeService from "./jnTreeService";
import {
  ITable,
  ITitle,
  ITree,
} from "@/eps/components/panel/EpsPanel2/EpsPanel";
import { Button, Form, Input, notification, Modal, Badge, Drawer } from "antd";
import EpsFilesView from "@/eps/components/file/EpsFilesView";
import EpsTimeline from "./EpsTimeline.tsx";
import SelectDialog from "@/pages/Appraisal/AppraisaApply/SelectDailog";
import AppraisaApplySelStore from "@/stores/appraisa/AppraisaApplySelStore.ts";
import DapubStore from "./DapubStore";
import util from "@/utils/util";
import { observer, useLocalStore } from "mobx-react";
import { Divider } from "@alifd/next";
import { runInAction } from 'mobx';
// import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
const FormItem = Form.Item;


const SelectDialStore = new AppraisaApplySelStore(
  `/api/eps/control/main/xhjdsp`,
  true,
  true
);
const SelectDafbDialStore = new AppraisaApplySelStore(
  `/api/eps/control/main/daxhsp`,
  true,
  true
);

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

const tablePropChild: ITable = {
  tableSearch: true,
  disableDelete: true,
  disableEdit: true,
  disableAdd: true,
  rowSelection: {
    type: "checkbox",
    // onChange: (value) => console.log(value)
  },
};

const childTableProp: ITable = {
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
const umid = "xhjd";
const mainDakid = params.id;
const bmc = params.mbc;
const tmzt = 3;
const splitPanel = params.lx == "02";
const daparams = { tmzt, dakid: mainDakid, ...params };


// ???????????????
const customForm = () => {
  return <>{/*  */}</>;
};

const treeProp: ITree = {
  treeSearch: false,
  treeCheckAble: false,
};

const XHJD = observer((props) => {
  const [selectDialogParams, setSelectDialogParams] = useState({});
  const { dlgVisible, setDlgVisible } = SelectDialStore;

  const { dlgVisible: dlgDafbVisible, setDlgVisible: setDlgDafbVisible } = SelectDafbDialStore;
  const [zhjdVisiable, setZhjdVisiable] = useState(false);
  const [qxkfVisiable, setQxkfVisiable] = useState(false);
  const [iFrameHeight, setIFrameHeight] = useState(700);
  const [fileModalVisiable, setFileModalVisiable] = useState(false);
  const [selectRecordInfo, setSelectRecordInfo] = useState({});
  const [fileUrl, setFileUrl] = useState("");
  const [logVisible, setLogVisible] = useState(false);
  const [dafbVisiable, setDafbVisiable] = useState(false);
  const [daktmid, setDaktmid] = useState("");
  /**
   * childStore
   */
  const childStore = useLocalStore(() => (
    {
      childColumns: [],
      childTbl: {},
      advSearchColumns: [],
      ktable: {},
      async queryTblInfo(data) {
        const tbl = await TableService.queryKTable(data);
        const columns = await TableService.getKField({ dakid: tbl.id, lx: tmzt, pg: "list" });
        runInAction( () => {
          childStore.childTbl = tbl;
          childStore.childColumns = columns.filter(kfield => kfield["lbkj"] == "Y").map(kfield => ({
            width: kfield["mlkd"] * 1.3,
            code: kfield["mc"].toLowerCase(),
            title: kfield["ms"],
            ellipsis: true
          }));
        })
      },
      async initSearchForm(data) {
        const ktable = await TableService.queryKTable(data);
        const mbcx = await TableService.getSearchColumns({ lx: 1, mbid: ktable.mbid });
        runInAction(() => {
          childStore.ktable = ktable;
          childStore.advSearchColumns = mbcx;
        })
      }
    }
  ));

  const ref = useRef();

  const refChild = useRef();

  const viewFiles = (text, record, index, store) => {
    if (!record.filegrpid) {
      return;
    }
    setFileParams(record);
    setFileModalVisiable(true);
  };

  const tableRowClick = (record) => {
    let storeChild = refChild.current?.getTableStore();

    util.setSStorage(`arch_param_${umid}_jn`, childStore.childTbl);

    if (storeChild && storeChild.findByKey) {
      storeChild.findByKey({ fid: record.id });
    }
  };

  const setFileParams = (record) => {
    const fjparams = {
      dakid: mainDakid,
      doctbl: `${bmc}_fj`,
      downfile: 1,
      bmc,
      fjck: true,
      fjdown: true,
      fjsctrue: false,
      fjupd: false,
      grpid: record.filegrpid,
      grptbl: `${bmc}_FJFZ`,
      id: record.id,
      printfile: 1,
      psql: "$S$KCgxPTEpKQ==",
      tmzt: 3,
      wrkTbl: bmc,
    };
    util.setSStorage("fjparams", fjparams);
    setFileUrl(`/eps/wdgl/attachdoc/viewFiles?grpid=${record.filegrpid}`);
  };


  const afterTreeSelectAction = (key) => {
    if (key == `${bmc}_XHJD#value#`) {
      setMenuProp([
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
              ids,
              store,
              records,
            });
            setZhjdVisiable(true);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
        {
          title: "????????????",
          icon: "icon_import_white",
          onClick: (ids, store, records) => {
            viewLog(ids, store, records);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
      ]);
    }
    if (key == `${bmc}_XHJD#value#D`) {
      setMenuProp([
        {
          title: "????????????",
          icon: "icon_import_white",
          onClick: (ids, store, records) => {
            viewLog(ids, store, records);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
      ]);
    }
    if (key == `${bmc}_XHJD#value#Y`) {
      setMenuProp([]);
    }
    if (key == `${bmc}_XHJD#value#Y;${bmc}_DAXH#value#N`) {
      setMenuProp([
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
              ids,
              store,
              records,
            });
            setZhjdVisiable(true);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
        {
          title: "????????????",
          icon: "icon_import_white",
          onClick: (ids, store, records) => {
            viewLog(ids, store, records);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
      ]);
    }
    if (key == `${bmc}_XHJD#value#Y;${bmc}_DAXH#value#X`) {
      setMenuProp([
        {
          title: "????????????",
          icon: "icon_import_white",
          onClick: doXh,
          color: "#CFA32A",
          toolbarShow: true,
        },
        {
          title: "????????????",
          icon: "icon_import_white",
          onClick: (ids, store, records) => {
            setSelectRecordInfo({
              ids,
              store,
              records,
            });
            setQxkfVisiable(true);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
        {
          title: "????????????",
          icon: "icon_import_white",
          onClick: (ids, store, records) => {
            viewLog(ids, store, records);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
      ]);
    }if (key == `${bmc}_XHJD#value#Y;${bmc}_DAXH#value#Y`) {
      setMenuProp([
        {
          title: "????????????",
          icon: "icon_import_white",
          onClick: (ids, store, records) => {
            viewLog(ids, store, records);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
      ]);
    }
  };

  const viewLog = (ids, store, records) => {
    if (records.length != 1) {
      notification.open({
        message: "??????",
        description: "?????????????????????",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });

      return;
    }
    setDaktmid("");
    setDaktmid(ids[0]);
    setLogVisible(true);
  };

  const ActionOne = (text, record, index, store) => {
    return (
      <EpsFilesView
        fjs={record.fjs}
        bmc={params.mbc}
        tmid={record.id}
        dakid={params.dakid}
        grpid={record.filegrpid}
        btnName={"??????"}
      />
    );
  };

  const dafb = (record, store, rows) => {

    if (record.length < 1) {
      notification.open({
        message: "??????",
        description: "??????????????????????????????",
      });

      return;
    }

    let ids = record.join(",");
    //??????????????????
    const daxh = rows.filter((record) => {
      return record.daxh == "Y";
    });

    ids = daxh
      .map((row) => {
        return row.id;
      })
      .join(",");

    let params = {
      dakid: daparams.dakid,
      ids,
      bmc: daparams.mbc,
      dakmc: daparams.mc,
    };
    params[umid] = "Y";
    SelectDialStore.dafb(params, true, (res) => {
      notification.open({
        message: "????????????",
        description: "????????????",
      });
      store.findByKey();
      ref.current.clearTableRowClick();
    });

    setDafbVisiable(false);
  };
  const ActionChild = (text, record, index, store) => {
    return (
      <EpsFilesView
        fjs={record.fjs}
        bmc={childStore.childTbl.bmc}
        tmid={record.id}
        dakid={childStore.childTbl.dakid}
        grpid={record.filegrpid}
        btnName={"??????"}
      />
    );
  };

  // const ActionTwo = (text, record, index, store) => {
  //   return  (
  //   <FileTextOutlined style={{color:"#55acee"}}  onClick={() => viewLog(text, record, index, store)}   />
  //   )
  // }

  const customTableAction = (text, record, index, store) => {
    return (
      <>
        {[
          ActionOne(text, record, index, store),
          //   ActionTwo(text, record, index, store),
        ]}
      </>
    );
  };

  const customTableActionChild = (text, record, index, store) => {
    return (
      <>
        {[
          ActionChild(text, record, index, store),
          //   ActionTwo(text, record, index, store),
        ]}
      </>
    );
  };

  const onClose = () => {
    setLogVisible(false);
  };



  useEffect(() => {
    if (daparams.dakid) {
      DapubStore.getDaklist(daparams.dakid, daparams.tmzt);
      childStore.initSearchForm({ dakid: daparams.dakid });
      if (splitPanel) {
        childStore.queryTblInfo({ fid: daparams.dakid });
      }
    }
  }, []);

  const title: ITitle = {
    name: "??????",
  };

  const childTitle: ITitle = {
    name: "??????",
  };

  const callback = () => {
    let store = ref.current?.getTableStore();
    store.findByKey();

    ref.current.clearTableRowClick();
  };

  const doRunAction = (record, store, rows: any[]) => {
    console.log("rows", rows);
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
    const yjjd = rows.filter((record) => {
      return record.xhjd == "Y" || record.xhjd == "I";
    });
    const wjd = rows.filter((record) => {
      return !record.xhjd || record.xhjd == "N";
    });
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
      ids = wjd
        .map((row) => {
          return row.id;
        })
        .join(",");

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

  /**
   *
   * @param record ????????????????????????
   * @param store
   * @param rows
   * @returns
   */
  const doXh = (record, store, rows: any[]) => {
    console.log("rows", rows);
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
    const yjfb = rows.filter((record) => {
      return record.dajd == "Y" || record.daxh == "X";
    });

    if (yjfb.length < 1) {
      notification.open({
        message: "??????",
        description: "???????????????????????????????????????",
      });
      return;
    }
    ids = yjfb
      .map((row) => {
        return row.id;
      })
      .join(",");

    const params = {
      dakid: daparams.dakid,
      ids,
      bmc: daparams.mbc,
      dakmc: daparams.mc,
    };
    setSelectDialogParams(params);
    setDlgDafbVisible(true);
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
          ids,
          store,
          records,
        });
        setZhjdVisiable(true);
      },
      color: "#CFA32A",
      toolbarShow: true,
    },
    {
      title: "????????????",
      icon: "icon_import_white",
      onClick: (ids, store, records) => {
        setSelectRecordInfo({
          ids,
          store,
          records,
        });
        setDafbVisiable(true);
      },
      color: "#CFA32A",
      toolbarShow: true,
    },
    {
      title: "????????????",
      icon: "icon_import_white",
      onClick: (ids, store, records) => {
        viewLog(ids, store, records);
      },
      color: "#CFA32A",
      toolbarShow: true,
    },
  ]);
  /**
   * ????????????
   * @param record
   * @param store
   * @param rows
   * @returns
   */
  const zjjd = (record, store, rows) => {
    if (record.length < 1) {
      notification.open({
        message: "??????",
        description: "??????????????????????????????",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
      store.findByKey();
      ref.current.clearTableRowClick();
      return;
    }

    let ids = record.join(",");
    //??????????????????
    const daxh = rows.filter((record) => {
      return record.daxh == "Y";
    });
    const wjd = rows.filter((record) => {
      return !record.daxh || record.daxh == "N";
    });
    // if(daxh.length>0){
    //   if(wjd.length>0){
    //     notification.open({
    //       message: "??????",
    //       description: "?????????????????????????????????????????????????????????",
    //     });
    //   }
    //   if(wjd.length==0){
    //     notification.open({
    //       message: "????????????",
    //       description: "?????????????????????????????????????????????",
    //     });
    //     return;
    //   }
    //   ids=wjd.map(row=>{
    //     return row.id;
    //   }).join(",");
    // }

    let params = {
      dakid: daparams.dakid,
      ids,
      zt: "Y",
      bmc: daparams.mbc,
      dakmc: daparams.mc,
      zjjd: "Y",
      daxh: "Y",
    };
    params[umid] = "Y";
    setSelectDialogParams(params);

    SelectDialStore.genSQD(params, true, (res) => {
      notification.open({
        message: "????????????",
        description: "??????????????????",
      });
      store.findByKey();
      ref.current.clearTableRowClick();
    });

    setZhjdVisiable(false);
  };

  const getJdRecords = (rows) => {
    const yjd = rows.filter((record) => {
      return record.xhjd == "Y" || record.xhjd == "D";
    });

    const jdz = rows.filter((record) => {
      return record.xhjd == "D";
    });

    const wjd = rows.filter((record) => {
      return !record.xhjd || record.xhjd == "N";
    });

    const ykf = rows.filter((record) => {
      return record.daxh == "Y";
    });

    const wkf = rows.filter((record) => {
      return !record.daxh || record.daxh == "N";
    });
    return { yjd, wjd, ykf, wkf, jdz };
  };

  /**
   * ?????????????????????
   * @param record
   * @param store
   * @param rows
   * @returns
   */
  const zjjdbkf = (record, store, rows) => {
    if (record.length < 1) {
      notification.open({
        message: "??????",
        description: "??????????????????????????????",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
      store.findByKey();
      ref.current.clearTableRowClick();
      return;
    }

    let ids = record.join(",");
    //??????????????????

    const jdRecords = getJdRecords(rows);

    // if(jdRecords.yjd.length>0){
    //   if(jdRecords.wjd.length>0){
    //     notification.open({
    //       message: "??????",
    //       description: "?????????????????????????????????????????????????????????",
    //     });
    //   }
    // }

    // if(jdRecords.yjd.length>0){
    //   if(jdRecords.wjd.length>0){
    //     notification.open({
    //       message: "??????",
    //       description: "?????????????????????????????????????????????????????????",
    //     });
    //   }
    // }
    // if(jdRecords.jdz.length>0){
    //     notification.open({
    //       message: "??????",
    //       description: "????????????????????????????????????????????????",
    //     });
    //   return;
    // }

    ids = jdRecords.wjd
      .map((row) => {
        return row.id;
      })
      .join(",");

    let params = {
      dakid: daparams.dakid,
      ids,
      zt: "Y",
      bmc: daparams.mbc,
      zjjd: "Y",
      dakmc: daparams.mc,
      daxh: "N",
    };
    params[umid] = "Y";
    setSelectDialogParams(params);

    SelectDialStore.genSQD(params, true, (res) => {
      notification.open({
        message: "????????????",
        description: "??????????????????",
      });
      store.findByKey();
      ref.current.clearTableRowClick();
    });

    setZhjdVisiable(false);
  };

  /**
   * ????????????
   * @param record
   * @param store
   * @param rows
   * @returns
   */
  const qxkf = (record, store, rows) => {
    if (record.length < 1) {
      notification.open({
        message: "??????",
        description: "????????????????????????????????????",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });

      return;
    }

    let ids = record.join(",");
    //??????????????????
    const daxh = rows.filter((record) => {
      return record.daxh == "Y";
    });

    ids = daxh
      .map((row) => {
        return row.id;
      })
      .join(",");

    let params = {
      dakid: daparams.dakid,
      ids,
      bmc: daparams.mbc,
      dakmc: daparams.mc,
      daxh: "N",
    };
    params[umid] = "Y";

    setSelectDialogParams(params);

    SelectDialStore.qxkf(params, true, (res) => {
      notification.open({
        message: "????????????",
        description: "???????????????????????????",
      });
      store.findByKey();
      ref.current.clearTableRowClick();
    });

    setQxkfVisiable(false);
  };

  const searchFrom = () => {
    if (childStore.advSearchColumns.length > 0){
      return (
        <>
        {childStore.advSearchColumns.map(item => {
          return (
            <FormItem label={item.kjmc} className="form-item" key={item.zlxid} name={item.zlxmc}>
              <Input placeholder={item.kjmc} />
            </FormItem>
          )
        })}
        </>
      )
    } else {
      return <></>

    }
  }



  const colum = [
    {
      title: "????????????",
      code: "xhjd",
      align: "center",
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text == "Y") {
          return "?????????";
        } else if (text == "D") {
          return "?????????";
        } else {
          return "?????????";
        }
      },
    },
    {
      title: "????????????",
      code: "daxh",
      align: "center",
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text == "Y") {
          return "?????????";
        } else if (text == "N") {
          return "?????????";
        } else if (text == "X") {
          return "?????????";
        }
        return "";
      },
    },
    ...DapubStore.columns,
  ];

  const childColumns = DapubStore.childColumns;

  const ZjjdFooter = (record) => {
    return (
      <>
        <Button
          type="primary"
          onClick={(record) =>
            zjjd(
              selectRecordInfo.ids,
              selectRecordInfo.store,
              selectRecordInfo.records
            )
          }
        >
          ??????
        </Button>
        <Button
          type="primary"
          onClick={(record) =>
            zjjdbkf(
              selectRecordInfo.ids,
              selectRecordInfo.store,
              selectRecordInfo.records
            )
          }
        >
          ?????????
        </Button>
        <Button type="dashed" onClick={() => setZhjdVisiable(false)}>
          ??????
        </Button>
      </>
    );
  };

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: splitPanel ? "calc(50% - 60px)" : "calc(100% - 50px)" }}>
        <EpsPanel
          key={`${umid}_aj`}
          title={title} // ?????????????????????
          source={colum} // ????????????????????????
          treeProp={treeProp} // ????????? ????????????,?????????io
          treeService={DwService} // ????????? ??????????????????
          tableRowClick={tableRowClick}
          afterTreeSelectAction={afterTreeSelectAction}
          tableProp={tableProp} // ?????????????????????????????????
          tableService={TableService} // ??????????????????????????????
          ref={ref} // ???????????????????????????
          menuProp={menuProp} // ???????????? ?????????????????????
          searchForm={searchFrom} // ???????????????????????????
          customForm={customForm} // ?????????????????????(????????????????????????????????????????????????????????????????????????????????????????????????)?????????
          customTableAction={customTableAction} // ????????????????????????(?????????+ToolTip????????????????????????)?????????
        // ????????????????????????????????????????????????????????????????????????
        ></EpsPanel>
      </div>
      {splitPanel && <Divider />}
      <div
        style={{
          height: "calc(50% - 60px)",
          display: splitPanel ? "block" : "none",
        }}
      >
        {splitPanel && (
          <EpsPanel
            key={`${umid}_jn`}
            title={title} // ?????????????????????
            source={childStore.childColumns} // ????????????????????????
            treeProp={treeProp} // ????????? ????????????,?????????io
            treeService={childTreeService} // ????????? ??????????????????
            tableProp={tablePropChild} // ?????????????????????????????????
            tableService={jnService} // ??????????????????????????????
            ref={refChild} //???????????????????????????
            menuProp={[]} // ???????????? ?????????????????????
            searchForm={searchFrom} // ???????????????????????????
            customForm={customForm} // ?????????????????????(????????????????????????????????????????????????????????????????????????????????????????????????)?????????
            customTableAction={customTableActionChild} // ????????????????????????(?????????+ToolTip????????????????????????)?????????

          // ????????????????????????????????????????????????????????????????????????
          ></EpsPanel>
        )}
      </div>
      <SelectDialog
        params={selectDialogParams}
        jdcode={"xhjd"}
        umid={"DAJD013"}
        SelectDialStore={SelectDialStore}
        callback={callback}
        visible={dlgVisible}
      />
      <SelectDialog
        params={selectDialogParams}
        jdcode={"daxh"}
        umid={"DAJD013"}
        SelectDialStore={SelectDafbDialStore}
        callback={callback}
        jdname={"????????????"}
        visible={dlgDafbVisible}
      />
      <Modal
        title="????????????"
        visible={zhjdVisiable}
        // onOk={()=>zjjd(selectRecordInfo.ids,selectRecordInfo.store,selectRecordInfo.records)}
        // onCancel={() => setZhjdVisiable(false)}
        footer={<ZjjdFooter record={selectRecordInfo} />}
        okText="??????"
        cancelText="??????"
      >
        <p>?????????????????????????????????????????????????</p>
      </Modal>

      <Modal
        title="????????????"
        visible={dafbVisiable}
        onOk={() =>
          dafb(
            selectRecordInfo.ids,
            selectRecordInfo.store,
            selectRecordInfo.records
          )
        }
        onCancel={() => setDafbVisiable(false)}
        okText="??????"
        cancelText="??????"
      >
        <p>????????????????????????????????????????????????????????????????????????????</p>
      </Modal>

      <Modal
        title="????????????"
        visible={qxkfVisiable}
        onOk={() =>
          qxkf(
            selectRecordInfo.ids,
            selectRecordInfo.store,
            selectRecordInfo.records
          )
        }
        onCancel={() => setQxkfVisiable(false)}
        okText="??????"
        cancelText="??????"
      >
        <p>??????????????????????????????????????????????????????????????????????????????????</p>
      </Modal>

      <Modal
        title="????????????"
        centered
        visible={fileModalVisiable}
        onOk={() => setFileModalVisiable(false)}
        onCancel={() => setFileModalVisiable(false)}
        width={"70%"}
        style={{ height: iFrameHeight }}
      >
        <div style={{ height: iFrameHeight }}>
          <iframe
            style={{ width: "100%", height: 700, overflow: "visible" }}
            //  onLoad={() => {
            //      const obj = ReactDOM.findDOMNode(this);
            //      setIFrameHeight(obj.contentWindow.document.body.scrollHeight);
            //  }}

            src={fileUrl}
            width="100%"
            height={iFrameHeight}
            scrolling="no"
            frameBorder="0"
          />
        </div>
      </Modal>
      <Drawer
        title="????????????"
        placement="right"
        width="500px"
        closable={false}
        onClose={onClose}
        visible={logVisible}
      >
        <EpsTimeline daktmid={daktmid} />
      </Drawer>
    </div>
  );
});

export default XHJD;
