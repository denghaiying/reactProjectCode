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
import { observer, useLocalObservable } from "mobx-react";
import { Divider } from "@alifd/next";
import { runInAction } from 'mobx';
// import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
const FormItem = Form.Item;


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


// 自定义表单
const customForm = () => {
  return <>{/*  */}</>;
};

const treeProp: ITree = {
  treeSearch: false,
  treeCheckAble: false,
};

const ArchManage = observer((props) => {

  /**
   * archStore
   */
  const archStore = useLocalObservable(() => (
    {
      //主表列
      columns:[],
      //主表档案库信息
      tbl:[],
      async queryTblInfo(data) {
        const tbl= await TableService.queryKTable(data);
        const kfields = await TableService.getKField({ dakid: this.tbl.id, lx: tmzt, pg: "list" });
        this.columns = kfields.filter(kfield => kfield["lbkj"] == "Y").map(kfield => ({
          width: kfield["mlkd"]*1.3,
          code: kfield["mc"].toLowerCase(),
          title: kfield["ms"],
          ellipsis:true
        }));
        runInAction( () => {
          this.tbl = tbl;
          this.columns = kfields.filter(kfield => kfield["lbkj"] == "Y").map(kfield => ({
            width: kfield["mlkd"]*1.3,
            code: kfield["mc"].toLowerCase(),
            title: kfield["ms"],
            ellipsis:true
          }));
        })
      },

      async initSearchForm(data) {
        const ktable = await TableService.queryKTable(data);
        const mbcx = await TableService.getSearchColumns({ lx: 1, mbid: ktable.mbid });
        runInAction(() => {
          this.ktable = ktable;
          this.advSearchColumns = mbcx;
        })
      }
    }
  ));
  //主panel ref
  const ref = useRef();
  //子panel ref
  const refChild = useRef();



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


  const ActionChild = (text, record, index, store) => {
    return (
      <EpsFilesView
        fjs={record.fjs}
        bmc={archStore.childTbl.bmc}
        tmid={record.id}
        dakid={archStore.childTbl.dakid}
        grpid={record.filegrpid}
        btnName={"附件"}
      />
    );
  };


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
      archStore.initSearchForm({ dakid: daparams.dakid });
      if (splitPanel) {
        archStore.queryTblInfo({ fid: daparams.dakid });
      }
    }
  }, []);

  const title: ITitle = {
    name: "案卷",
  };

  const childTitle: ITitle = {
    name: "卷内",
  };


  //查询表单
  const searchFrom = () => {
    if (archStore.advSearchColumns.length > 0){
      return (
        <>
        {archStore.advSearchColumns.map(item => {
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
      title: "鉴定状态",
      code: "xhjd",
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
      title: "销毁状态",
      code: "daxh",
      align: "center",
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text == "Y") {
          return "已销毁";
        } else if (text == "N") {
          return "不销毁";
        } else if (text == "X") {
          return "待销毁";
        }
        return "";
      },
    },
    ...DapubStore.columns,
  ];


  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: splitPanel ? "calc(50% - 60px)" : "calc(100% - 50px)" }}>
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
          menuProp={archStore.menuProp} // 右侧菜单 设置属性，选填
          searchForm={searchFrom} // 高级搜索组件，选填
          customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        // 自定义全局按钮（如新增、导入、全局打印等），选填
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
            title={title} // 组件标题，必填
            source={archStore.childColumns} // 组件元数据，必填
            treeProp={treeProp} // 左侧树 设置属性,可选填io
            treeService={childTreeService} // 左侧树 实现类，必填
            tableProp={tablePropChild} // 右侧表格设置属性，选填
            tableService={jnService} // 右侧表格实现类，必填
            ref={refChild} //获取组件实例，选填
            menuProp={archStore.menuProp} // 右侧菜单 设置属性，选填
            searchForm={searchFrom} // 高级搜索组件，选填
            customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            customTableAction={customTableActionChild} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填

          // 自定义全局按钮（如新增、导入、全局打印等），选填
          ></EpsPanel>
        )}
      </div>
    
    </div>
  );
});

export default ArchManage;
