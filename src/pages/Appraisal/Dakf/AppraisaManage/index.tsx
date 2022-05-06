import React, {  useEffect, useRef, useState } from "react";
import { EpsPanel } from "@/eps/components/panel/EpsPanel2";
import EpsFormType from "@/eps/commons/EpsFormType";
import {
  FileTextOutlined
} from '@ant-design/icons';
import YhService from "./TableService";
import DwService from "./treeService";
import {
  ITable,
  ITitle,
  ITree,
  MenuData
} from "@/eps/components/panel/EpsPanel2/EpsPanel";
import { Button, Form, Input, message, notification, Modal,Badge,Timeline,Drawer  } from "antd";

import EpsTimeline from "./EpsTimeline.tsx"
import SelectDialog from "../AppraisaApply/SelectDailog";
import SelectDialStore from "@/stores/appraisa/AppraisaApplySelStore.ts";
import DapubStore from "./DapubStore";
import util from "@/utils/util";
import { observer } from "mobx-react";

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

const params = util.getSStorage("arch_param");
const umid = "kfjd";
const dakid = params.id;
const bmc=params.mbc;
const tmzt = 3;
const daparams = { tmzt, dakid, ...params };




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
  treeSearch: true,
  treeCheckAble: false,
};

const Kfjd = observer((props) => {
  const [selectDialogParams, setSelectDialogParams] = useState({});
  const { dlgVisible, setDlgVisible } = SelectDialStore;
  const [zhjdVisiable, setZhjdVisiable] = useState(false);
  const [qxkfVisiable, setQxkfVisiable] = useState(false);
  const [iFrameHeight, setIFrameHeight] = useState(800);
  const [fileModalVisiable, setFileModalVisiable] = useState(false);
  const [selectRecordInfo, setSelectRecordInfo] = useState({});
  const [fileUrl, setFileUrl] = useState("");
  const [logVisible, setLogVisible] = useState(false);
  const [daktmid, setDaktmid] = useState("");
  const ref = useRef();

  const viewFiles = (text, record, index, store) => {
    if(!record.filegrpid){
      return;
    }
    setFileParams(record);
    setFileModalVisiable(true);
  }

  const setFileParams=(record)=>{
    const fjparams={
       dakid,
      doctbl: `${bmc}_fj`,
      downfile: 1,
      bmc,
      fjck: true,
      fjdown: true,
      fjsctrue: false,
      fjupd: false,
      grpid:record.filegrpid,
      grptbl:  `${bmc}_FJFZ`,
      id: record.id,
      printfile: 1,
      psql: "$S$KCgxPTEpKQ==",
      tmzt: 4,
      wrkTbl: bmc,
    }
    util.setSStorage("fjparams", fjparams);
    setFileUrl(`/eps/wdgl/attachdoc/viewFiles?grpid=${fjparams.grpid}`)
  }

  
  const viewLog = (ids,store,records) => {
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
    setDaktmid(ids[0])
    setLogVisible(true);
  }


  const ActionOne = (text, record, index, store) => {
    return  <Badge count={record.fjs?record.fjs:0}>
    <FileTextOutlined style={{color:"#55acee"}}  onClick={() => viewFiles(text, record, index, store)}   />
  </Badge>
  }

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
    )
  }


  
  // const FChild = forwardRef(EpsPanel);

  // // 自定义功能按钮
  // const customAction = (store: EpsTableStore) => {
  //   return <Button onClick={() => onButtonClick()}>自定义按钮</Button>;
  // };
  const onClose = () => {
    setLogVisible(false);
  };
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    let store = ref.current?.getTableStore();
    message.info(store.key || "当前未选中左侧树");
  };

  useEffect(() => {
    if (daparams.dakid) {
      DapubStore.getDaklist(daparams.dakid, daparams.tmzt, umid);
    }


  }, []);

  const title: ITitle = {
    name: "用户",
  };

  const doRunAction = (record, store,rows:any[]) => {
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
    let ids= record.join(",");
    //鉴定状态判断
    const yjjd=rows.filter(record=>{
      return record.kfjd=="Y"
    })

    const wjd=rows.filter(record=>{
      return !record.kfjd || record.kfjd=="N"
    })
    if(yjjd.length>0){
      if(wjd.length>0){
        notification.open({
          message: "提示",
          description: "部分档案已经做过开放鉴定，已经自动过滤",
        });
      }
      if(wjd.length==0){
        notification.open({
          message: "提示",
          description: "所选档案已经做过开放鉴定，无需再次鉴定",
        });
        return;
      }

      ids=wjd.map(row=>{
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


  /**
   * 直接开放
   * @param record 
   * @param store 
   * @param rows 
   * @returns 
   */
  const zjjd = (record, store,rows) => {
    if (record.length < 1) {
      notification.open({
        message: "提示",
        description: "请选择需要鉴定的档案",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
      store.findByKey();
      return;
    }
   

    let ids= record.join(",");
    //鉴定状态判断
    const dakf=rows.filter(record=>{
      return record.dakf=="Y"
    })
    const wjd=rows.filter(record=>{
      return !record.dakf || record.dakf=="N"
    })
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
      bmc: daparams.mbc,
      dakmc: daparams.mc,
      dakf:"Y",
    };
    params[umid]= "Y";
    setSelectDialogParams(params);
 
    SelectDialStore.genSQD(params, true, (res) => {
      notification.open({
        message: "提交成功",
        description: "档案发布成功",
      });
      store.findByKey();
    });
    
    setZhjdVisiable(false)
  };


   /**
   * 直接鉴定不开放
   * @param record 
   * @param store 
   * @param rows 
   * @returns 
   */
    const zjjdbkf = (record, store,rows) => {
      if (record.length < 1) {
        notification.open({
          message: "提示",
          description: "请选择需要鉴定的档案",
          onClick: () => {
            console.log("Notification Clicked!");
          },
        });
        store.findByKey();
        return;
      }
     
  
      let ids= record.join(",");
      //鉴定状态判断
      const dakf=rows.filter(record=>{
        return record.dakf=="Y"
      })
      const wjd=rows.filter(record=>{
        return !record.dakf || record.dakf=="N"
      })
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
        bmc: daparams.mbc,
        dakmc: daparams.mc,
        dakf:"N",
      };
      params[umid]= "Y";
      setSelectDialogParams(params);
   
      SelectDialStore.genSQD(params, true, (res) => {
        notification.open({
          message: "提交成功",
          description: "档案开放成功",
        });
        store.findByKey();
      });
      
      setZhjdVisiable(false)
    };


  /**
   * 取消开放
   * @param record 
   * @param store 
   * @param rows 
   * @returns 
   */
  const qxkf = (record, store,rows) => {
    if (record.length < 1) {
      notification.open({
        message: "提示",
        description: "请选择需要鉴定的档案",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });

      return;
    }
 
    let ids= record.join(",");
    //鉴定状态判断
    const dakf=rows.filter(record=>{
      return record.dakf=="Y"
    })
    const wjd=rows.filter(record=>{
      return !record.dakf || record.dakf=="N"
    })
    
    // if(dakf.length>0){
    //   if(wjd.length>0){
    //     notification.open({
    //       message: "取消开放",
    //       description: "部分档案未开放，将自动过滤未开放档案",
    //     });
    //   }
     
    //   ids=dakf.map(row=>{
    //     return row.id;
    //   }).join(","); 
    // }else{
    //   notification.open({
    //     message: "提交失败",
    //     description: "所选档案还未开放，无法取消开放",
    //   });
    //   return;
    // }

    let params = {
      dakid: daparams.dakid,
      ids,
      bmc: daparams.mbc,
      dakmc: daparams.mc,
      dakf:"Y"
    };
    params[umid]="Y"


    setSelectDialogParams(params);
  
    SelectDialStore.qxkf(params, true, (res) => {
      notification.open({
        message: "取消开放",
        description: "所选档案已取消开放",
      });
      store.findByKey();
    });
    
    setQxkfVisiable(false)
  };

  const menuProp: MenuData[] = [
    {
      title: "档案发布",
      icon: "icon_import_white",
      onClick: doRunAction,
      color: "#30B0D5",
    },
    {
      title: "直接发布",
      icon: "icon_import_white",
      onClick: (ids,store,records) => {
        setSelectRecordInfo({
          ids,store,records
        })
        setZhjdVisiable(true)},
      color: "#CFA32A",
    },
    {
      title: "取消发布",
      icon: "icon_import_white",
      onClick: (ids,store,records) => {
        setSelectRecordInfo({
          ids,store,records
        })
        setQxkfVisiable(true)},
      color: "#3F8EF",
    },
    {
      title: "条目日志",
      icon: "icon_import_white",
      onClick: (ids,store,records) => {
        viewLog(
          ids,store,records
        )
        },
      color: "#3F8EA",
    },
  ];

  const searchFrom = () => {
    return (
      <>
        <FormItem label="全宗名称" className="form-item" name="qzmc">
          <Input placeholder="全宗名称" />
        </FormItem>
        <Form.Item label="年度" className="form-item" name="nd">
          <Input placeholder="请输入年度"></Input>
        </Form.Item>
        {/* 保管期限 */}
      </>
    );
  };

  function confirmApply(e) {
    console.log(e);
    message.success('Click on Yes');
  }

  function cancel(e) {
    console.log(e);
    //message.error('Click on No');
  }

  const colu = [{
    title: '发布状态',
    code: 'dakf',
    align: 'center',
    width: 80,
    formType: EpsFormType.Input,
    render: (text, record, index) => {
      if (text) {
        return text == 'Y' ? '未发布' : '已发布';
      } else if(text=='D') {
        return '未发布' ;
      }else{
        return '已发布';
      }
    }

  }, ...DapubStore.columns]

  const ZjjdFooter=(record)=>{
    return(
    <>
    <Button type="primary" onClick={(record)=>zjjd(selectRecordInfo.ids,selectRecordInfo.store,selectRecordInfo.records)}>开放</Button>
    <Button  type="primary"  onClick={(record)=>zjjdbkf(selectRecordInfo.ids,selectRecordInfo.store,selectRecordInfo.records)}>不开放</Button>
    <Button type="dashed" onClick={() => setZhjdVisiable(false)}>取消</Button>
    </>
    )
  }

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={colu} // 组件元数据，必填
        treeProp={treeProp} // 左侧树 设置属性,可选填io
        treeService={DwService} // 左侧树 实现类，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={YhService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        menuProp={menuProp} // 右侧菜单 设置属性，选填
        searchForm={searchFrom} // 高级搜索组件，选填
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
      // 自定义全局按钮（如新增、导入、全局打印等），选填
      ></EpsPanel>
      <SelectDialog params={selectDialogParams} visible={dlgVisible} />
      <Modal
        title="直接发布"
        visible={zhjdVisiable}
        // onOk={()=>zjjd(selectRecordInfo.ids,selectRecordInfo.store,selectRecordInfo.records)}
        // onCancel={() => setZhjdVisiable(false)}
        footer={<ZjjdFooter record={selectRecordInfo}/>}
        okText="确认"
        cancelText="取消"
      >
        <p>是否对已选，是否继续?</p>
      </Modal>

      <Modal
        title="取消发布"
        visible={qxkfVisiable}
        onOk={()=>qxkf(selectRecordInfo.ids,selectRecordInfo.store,selectRecordInfo.records)}
        onCancel={() => setQxkfVisiable(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>是否对选中的档案取消开放，确认后将对档案取消开放，是否继续?</p>
      </Modal>

      <Modal
        title="查看附件"
        centered
        visible={fileModalVisiable}
        onOk={() => setFileModalVisiable(false)}
        onCancel={() => setFileModalVisiable(false)}
        width={"70%"}
        style={{height:iFrameHeight}}
      >
        <div style={{height:iFrameHeight}}>
          <iframe
            style={{ width: '100%', height: 800, overflow: 'visible' }}
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

export default Kfjd;
