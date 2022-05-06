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
const FormItem = Form.Item;


const SelectDialStore = new AppraisaApplySelStore(
  `/eps/control/main/kfjdsp`,
  true,
  true
);
const SelectDafbDialStore = new AppraisaApplySelStore(
  `/eps/control/main/dakf`,
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
const umid = "kfjd";
const mainDakid = params.id;
const bmc = params.mbc;
const tmzt = 3;
const splitPanel = params.lx == "02";
const daparams = { tmzt, dakid: mainDakid, ...params };

const tabData = [
  { tab: "盒号", key: "1" },
  { tab: "文件号", key: "2" },
];

const onTabChange = (key) => console.log(key);

const tabProps = { tabData, onTabChange };

// 自定义表单
const customForm = () => {
  return <>{/*  */}</>;
};

const treeProp: ITree = {
  treeSearch: false,
  treeCheckAble: false,
};

const KFJD = observer((props) => {
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
      async queryTblInfo(data) {
        const tbl = await TableService.queryKTable(data);
        const columns = await TableService.getKField({dakid:tbl.id,lx:tmzt,pg:"list"});
        runInAction(() => {
          childStore.childTbl = tbl;
          childStore.childColumns=columns.filter(kfield => kfield["lbkj"] == "Y").map(kfield => ({
            width: kfield["mlkd"]*1.3,
            code: kfield["mc"].toLowerCase(),
            title: kfield["ms"],
            ellipsis:true
          }));
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
    debugger
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
    if (key == `${bmc}_KFJD#value#`) {
      setMenuProp([
        {
          title: "开放鉴定",
          icon: "icon_import_white",
          onClick: doRunAction,
          color: "#30B0D5",
          toolbarShow: true,
        },
        {
          title: "直接鉴定",
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
          title: "条目日志",
          icon: "icon_import_white",
          onClick: (ids, store, records) => {
            viewLog(ids, store, records);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
      ]);
    }
    if (key == `${bmc}_KFJD#value#D`) {
      setMenuProp([
        {
          title: "条目日志",
          icon: "icon_import_white",
          onClick: (ids, store, records) => {
            viewLog(ids, store, records);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
      ]);
    }
    if (key == `${bmc}_KFJD#value#Y`) {
      setMenuProp([]);
    }
    if (key == `${bmc}_KFJD#value#Y;${bmc}_DAKF#value#N`) {
      setMenuProp([
        {
          title: "开放鉴定",
          icon: "icon_import_white",
          onClick: doRunAction,
          color: "#30B0D5",
          toolbarShow: true,
        },
        {
          title: "直接鉴定",
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
          title: "取消开放",
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
          title: "条目日志",
          icon: "icon_import_white",
          onClick: (ids, store, records) => {
            viewLog(ids, store, records);
          },
          color: "#CFA32A",
          toolbarShow: true,
        },
      ]);
    }
    if (key == `${bmc}_KFJD#value#Y;${bmc}_DAKF#value#Y`) {
      setMenuProp([
        {
          title: "档案发布",
          icon: "icon_import_white",
          onClick: doFb,
          color: "#CFA32A",
          toolbarShow: true,
        },
        {
          title: "直接发布",
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
          title: "取消开放",
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
          title: "条目日志",
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
        message: "提示",
        description: "请选择一条数据",
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
        btnName={"附件"}
      />
    );
  };

  const dafb = (record, store, rows) => {
    debugger;
    if (record.length < 1) {
      notification.open({
        message: "提示",
        description: "请选择需要发布的档案",
      });

      return;
    }

    let ids = record.join(",");
    //鉴定状态判断
    const dakf = rows.filter((record) => {
      return record.dakf == "Y";
    });

    ids = dakf
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
        message: "档案发布",
        description: "档案发布",
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
        btnName={"附件"}
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
      if (splitPanel) {

        childStore.queryTblInfo({ fid: daparams.dakid });

      }
    }
  }, []);

  const title: ITitle = {
    name: "案卷",
  };

  const childTitle: ITitle = {
    name: "卷内",
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
    const yjjd = rows.filter((record) => {
      return record.kfjd == "Y" || record.kfjd == "I";
    });
    const wjd = rows.filter((record) => {
      return !record.kfjd || record.kfjd == "N";
    });
    if (yjjd.length > 0) {
      if (wjd.length > 0) {
        notification.open({
          message: "提示",
          description: "部分档案已经做过开放鉴定，已经自动过滤",
        });
      }
      if (wjd.length == 0) {
        notification.open({
          message: "提示",
          description: "鉴定中，不能再次鉴定",
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
   * @param record 档案发布，走流程
   * @param store
   * @param rows
   * @returns
   */
  const doFb = (record, store, rows: any[]) => {
    console.log("rows", rows);
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
    const yjfb = rows.filter((record) => {
      return record.kfjd == "Y" || record.dakf == "Y";
    });

    if (yjfb.length < 1) {
      notification.open({
        message: "提示",
        description: "档案鉴定未开放，不允许发布",
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
      title: "开放鉴定",
      icon: "icon_import_white",
      onClick: doRunAction,
      color: "#30B0D5",
      toolbarShow: true,
    },
    {
      title: "直接开放",
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
      title: "取消开放",
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
      title: "条目日志",
      icon: "icon_import_white",
      onClick: (ids, store, records) => {
        viewLog(ids, store, records);
      },
      color: "#CFA32A",
      toolbarShow: true,
    },
  ]);
  /**
   * 直接开放
   * @param record
   * @param store
   * @param rows
   * @returns
   */
  const zjjd = (record, store, rows) => {
    if (record.length < 1) {
      notification.open({
        message: "提示",
        description: "请选择需要鉴定的档案",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
      store.findByKey();
      ref.current.clearTableRowClick();
      return;
    }

    let ids = record.join(",");
    //鉴定状态判断
    const dakf = rows.filter((record) => {
      return record.dakf == "Y";
    });
    const wjd = rows.filter((record) => {
      return !record.dakf || record.dakf == "N";
    });
    // if(dakf.length>0){
    //   if(wjd.length>0){
    //     notification.open({
    //       message: "提示",
    //       description: "部分档案已经开放，将自动过滤已开放档案",
    //     });
    //   }
    //   if(wjd.length==0){
    //     notification.open({
    //       message: "提交失败",
    //       description: "所选档案已经开放，无需再次开放",
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
      dakf: "Y",
    };
    params[umid] = "Y";
    setSelectDialogParams(params);
    SelectDialStore.setSaveParams({id : "new"});
    SelectDialStore.genSQD(params, true, (res) => {
      notification.open({
        message: "提交成功",
        description: "档案鉴定成功",
      });
      store.findByKey();
      ref.current.clearTableRowClick();
    });

    setZhjdVisiable(false);
  };

  const getJdRecords = (rows) => {
    const yjd = rows.filter((record) => {
      return record.kfjd == "Y" || record.kfjd == "D";
    });

    const jdz = rows.filter((record) => {
      return record.kfjd == "D";
    });

    const wjd = rows.filter((record) => {
      return !record.kfjd || record.kfjd == "N";
    });

    const ykf = rows.filter((record) => {
      return record.dakf == "Y";
    });

    const wkf = rows.filter((record) => {
      return !record.dakf || record.dakf == "N";
    });
    return { yjd, wjd, ykf, wkf, jdz };
  };

  /**
   * 直接鉴定不开放
   * @param record
   * @param store
   * @param rows
   * @returns
   */
  const zjjdbkf = (record, store, rows) => {
    if (record.length < 1) {
      notification.open({
        message: "提示",
        description: "请选择需要鉴定的档案",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
      store.findByKey();
      ref.current.clearTableRowClick();
      return;
    }

    let ids = record.join(",");
    //鉴定状态判断

    const jdRecords = getJdRecords(rows);

    // if(jdRecords.yjd.length>0){
    //   if(jdRecords.wjd.length>0){
    //     notification.open({
    //       message: "提示",
    //       description: "部分档案已经开放，将自动过滤已开放档案",
    //     });
    //   }
    // }

    // if(jdRecords.yjd.length>0){
    //   if(jdRecords.wjd.length>0){
    //     notification.open({
    //       message: "提示",
    //       description: "部分档案已经开放，将自动过滤已开放档案",
    //     });
    //   }
    // }
    // if(jdRecords.jdz.length>0){
    //     notification.open({
    //       message: "提示",
    //       description: "档案处于未开放状态，鉴定取消开放",
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
      dakf: "N",
    };
    params[umid] = "Y";
    setSelectDialogParams(params);
    SelectDialStore.setSaveParams({id : "new"});
    SelectDialStore.genSQD(params, true, (res) => {
      notification.open({
        message: "提交成功",
        description: "档案鉴定成功",
      });
      store.findByKey();
      ref.current.clearTableRowClick();
    });

    setZhjdVisiable(false);
  };

  /**
   * 取消开放
   * @param record
   * @param store
   * @param rows
   * @returns
   */
  const qxkf = (record, store, rows) => {
    if (record.length < 1) {
      notification.open({
        message: "提示",
        description: "请选择需要取消开放的档案",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });

      return;
    }

    let ids = record.join(",");
    //鉴定状态判断
    const dakf = rows.filter((record) => {
      return record.dakf == "Y";
    });

    ids = dakf
      .map((row) => {
        return row.id;
      })
      .join(",");

    let params = {
      dakid: daparams.dakid,
      ids,
      bmc: daparams.mbc,
      dakmc: daparams.mc,
      dakf: "N",
    };
    params[umid] = "Y";

    setSelectDialogParams(params);

    SelectDialStore.qxkf(params, true, (res) => {
      notification.open({
        message: "取消开放",
        description: "所选档案已取消开放",
      });
      store.findByKey();
      ref.current.clearTableRowClick();
    });

    setQxkfVisiable(false);
  };

  const searchFrom = () => {
    return (
      <>
        <FormItem label="全宗名称" className="form-item" name="qzmc">
          <Input placeholder="全宗名称" />
        </FormItem>
        <FormItem label="全宗号" className="form-item" name="qzh">
          <Input placeholder="全宗号" />
        </FormItem>
        <FormItem label="题名" className="form-item" name="tm">
          <Input placeholder="题名" />
        </FormItem>
        <Form.Item label="年度" className="form-item" name="nd">
          <Input placeholder="请输入年度"></Input>
        </Form.Item>
        {/* 保管期限 */}
      </>
    );
  };

  function cancel(e) {
    console.log(e);
    //message.error('Click on No');
  }

  const colum = [
    {
      title: "鉴定状态",
      code: "kfjd",
      align: "center",
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text == "Y") {
          return "已鉴定";
        } else if (text == "D") {
          return "鉴定中";
        } else {
          return "未鉴定";
        }
      },
    },
    {
      title: "开放状态",
      code: "dakf",
      align: "center",
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text == "Y") {
          return "开放";
        } else if (text == "N") {
          return "不开放";
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
          开放
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
          不开放
        </Button>
        <Button type="dashed" onClick={() => setZhjdVisiable(false)}>
          取消
        </Button>
      </>
    );
  };

  return (
    <>
      <div style={{ height: splitPanel ? "calc(50% - 20px)" : "100%" }}>
        <EpsPanel
          key={`${umid}_aj`}
          title={title} // 组件标题，必填
          source={colum} // 组件元数据，必填
          treeProp={treeProp} // 左侧树 设置属性,可选填io
          treeService={DwService} // 左侧树 实现类，必填
          tableRowClick={tableRowClick}
          afterTreeSelectAction={afterTreeSelectAction}
          tableProp={tableProp} // 右侧表格设置属性，选填
          tableService={TableService} // 右侧表格实现类，必填
          ref={ref} // 获取组件实例，选填
          menuProp={menuProp} // 右侧菜单 设置属性，选填
          searchForm={searchFrom} // 高级搜索组件，选填
          customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填

        // 自定义全局按钮（如新增、导入、全局打印等），选填
        ></EpsPanel>
      </div>
      {splitPanel && <Divider />}
      <div
        style={{
          height: "calc(50% - 20px)",
          display: splitPanel ? "block" : "none",
        }}
      >
        {splitPanel && (
          <EpsPanel
            key={`${umid}_jn`}
            title={title} // 组件标题，必填
            source={childStore.childColumns} // 组件元数据，必填
            treeProp={treeProp} // 左侧树 设置属性,可选填io
            treeService={childTreeService} // 左侧树 实现类，必填
            tableProp={tablePropChild} // 右侧表格设置属性，选填
            tableService={jnService} // 右侧表格实现类，必填
            ref={refChild} //获取组件实例，选填
            menuProp={[]} // 右侧菜单 设置属性，选填
            searchForm={searchFrom} // 高级搜索组件，选填
            customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            customTableAction={customTableActionChild} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填

          // 自定义全局按钮（如新增、导入、全局打印等），选填
          ></EpsPanel>
        )}
      </div>
      <SelectDialog
        params={selectDialogParams}
        jdcode={"kfjd"}
        umid={"DAJD013"}
        SelectDialStore={SelectDialStore}
        callback={callback}
        visible={dlgVisible}
      />
      <SelectDialog
        params={selectDialogParams}
        jdcode={"dafbsp"}
        umid={"DAJD013"}
        SelectDialStore={SelectDafbDialStore}
        callback={callback}
        jdname={"档案发布"}
        visible={dlgDafbVisible}
      />
      <Modal
        title="直接鉴定"
        visible={zhjdVisiable}
        // onOk={()=>zjjd(selectRecordInfo.ids,selectRecordInfo.store,selectRecordInfo.records)}
        // onCancel={() => setZhjdVisiable(false)}
        footer={<ZjjdFooter record={selectRecordInfo} />}
        okText="确认"
        cancelText="取消"
      >
        <p>对选中条目进行开放鉴定，是否继续?</p>
      </Modal>

      <Modal
        title="档案发布"
        visible={dafbVisiable}
        onOk={() =>
          dafb(
            selectRecordInfo.ids,
            selectRecordInfo.store,
            selectRecordInfo.records
          )
        }
        onCancel={() => setDafbVisiable(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>对选中的档案发布，确认后将对档案进行发布，是否继续?</p>
      </Modal>

      <Modal
        title="取消开放"
        visible={qxkfVisiable}
        onOk={() =>
          qxkf(
            selectRecordInfo.ids,
            selectRecordInfo.store,
            selectRecordInfo.records
          )
        }
        onCancel={() => setQxkfVisiable(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>对选中的档案取消开放，确认后将对档案取消开放，是否继续?</p>
      </Modal>

      <Modal
        title="查看附件"
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
        title="条目日志"
        placement="right"
        width="500px"
        closable={false}
        onClose={onClose}
        visible={logVisible}
      >
        <EpsTimeline daktmid={daktmid} />
      </Drawer>
    </>
  );
});

export default KFJD;
