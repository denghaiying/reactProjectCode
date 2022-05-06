/* eslint-disable comma-dangle */
/**
 * 不建议将REST API请求的函数放在stores里面，因为这样以来这些请求代码很难测试。你可以尝试把这些请求函数放在一个类里面，
 * 把这个类的代码和store放在一起，在store创建时，这个类也相应创建。然后当你测试时，你也可以优雅的把数据从这些类里面mock上去。
 * 业务类提到store中，ui中建议不要放业务操作代码
 * 所有数据变更在store中进行变更，不允许在其它地方进行变更。即界面即使关闭了，再次打开，store中数据相同，界面也应该相同
 */

/**
 * etl请求API
 */
import SxjcjcszService from "../services/etl/SxjcjcszService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
import {ajaxUrl} from "../utils/fetch";
/**
 *etlStore
 */

export default {
  dataSource: [],
  selectedKeys: [],
  inited: false,
  colums: [],
  visible: false,
  opt: "add",
  ownerRecord: {},
  editFieldValues: {},
  mxSelectedData:[],
  mxdata:{},
  mxListData:[],
  jcmxdata:{},
  selectedTabKey:[],
  columsTabs : {"1":[
      {
        title: "检测类型",
        dataIndex: "sxjcjcszlx",
        width: 200
      },
      {
        title: "检测名称",
        dataIndex: "sxjcjcszname",
        width: 100,
        lock: true
      },
      {
        title: "检测值",
        dataIndex: "sxjcjcszz",
        width: 200
      },
      {
        title: "检测字段",
        dataIndex: "sxjcjcszzd",
        width: 200
      }
    ]},
    
  queryKey: {},
  url: "http://localhost:8810/sxjcjcsz",
  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  onTableRowChange(selectedRowKeys, records) {
    this.selectedKeys = selectedRowKeys;
    this.selectedRecords = records;
    console.log(records);
    console.log(this.selectedRecords);
  },
  onmxRowChange(selectedRowKeys, records) {
    this.mxSelectedData=records;
  },
 async onTabSelect(selectedRowKeys) {
   
    this.selectedTabKey = selectedRowKeys;
    this.queryKey = { jclx: selectedRowKeys};
    this.colums=this.columsTabs[this.selectedTabKey];
    this.dataSource = await SxjcjcszService.findAll(this.queryKey);
      
  },
  onChange(...args) {
    console.log(...args);
  },
  
  /**
   * 刷新、查询数据
   */
  async didMount(ownerSelectedRecords) {

    this.colums = [
      {
        title: "检测类型",
        dataIndex: "sxjcjcszlx",
        width: 200
      },
      {
        title: "检测名称",
        dataIndex: "sxjcjcszname",
        width: 100,
        lock: true
      },
      {
        title: "检测值",
        dataIndex: "sxjcjcszz",
        width: 200
      },
      {
        title: "检测字段",
        dataIndex: "sxjcjcszzd",
        width: 200
      }
    ];
 
    this.queryKey = { jclx: ownerSelectedRecords};
    this.dataSource = await SxjcjcszService.findAll(this.queryKey);

    // EtlService.queryForPage({}, 1, 5).then(data => {
    //   this.dataSource = data;
    // });
  },
  /**
   * 删除操作
   * @param {*} id
   */
  async remove(id) {
    const data = await SxjcjcszService.delete(id);
    if (data) {
      Message.success("删除成功");
      this.dataSource = await SxjcjcszService.findAll(this.queryKey);
    }
  },

  onAddAction() {
    
    console.log(this.selectedTabKey);
    this.visible = true;
    this.opt = "add";
  },
  setVisible(visible) {
    // console.log("doVisible");
    this.visible = visible;
  },
  async onSaveDataAction(data) {
    
    this.selectedTabKey;
    let j=this.mxSelectedData.length;
    if(j>0){
      this.mxListData=[];
       for (let i = 0; i < j; i++) {
         this.mxdate= this.mxSelectedData[i];
          this.jcmxdata.sxjcjcszlx = this.selectedTabKey;
          this.jcmxdata.sxjcjcszsxid=this.mxdate.id;
          this.jcmxdata.sxjcjcszsxlx=this.mxdate.sxjcwhxlx;
          this.jcmxdata.sxjcjcszname=this.mxdate.sxjcwhxname;
          this.jcmxdata.sxjcjcszz=this.mxdate.sxjcwhxjcsz;
          this.jcmxdata.sxjcjcszzd=this.mxdate.sxjcwhxDyDate;
          this.mxListData.push(this.jcmxdata);
      }
        console.log(this.mxListData);
         try {
        await SxjcjcszService.addList({sxjcjcszList:this.mxListData});
      } catch (e) {
        Message.error(e.message);
        return;
      }
    }
   
    this.dataSource = await SxjcjcszService.findAll(this.queryKey);
    //todo 国际化
    Message.success("修改成功");
    this.visible = false;
  },
  async doCreateTemplateString() {
    
    window.open(ajaxUrl+"example/"+this.ownerRecord.archiveinfoType+"/"+this.ownerRecord.id)
  },
  async onEditAction(record) {
    // eslint-disable-next-line quotes
    this.visible = true;
    this.opt = "edit";
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });

    json.whsj = moment();
    this.editFieldValues = json;
  }
};
