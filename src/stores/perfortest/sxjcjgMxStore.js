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

import { observable, action, runInAction, makeObservable} from 'mobx';
import SxjcjgLogService from "../../services/perfortest/SxjcjgLogService";
import SxjcjgMxService from "../../services/perfortest/SxjcjgMxService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
/**
 *etlStore
 */
class sxjcjgMxStore {
 @observable listdeleteid = {};
 @observable loading = false;
 @observable pageno = 1;
 @observable pagesize = 10;
 @observable opt = 'view';
 @observable delvisible = false;
 @observable modalVisible = false;
 @observable selectedKeys = [];
 @observable inited =  false;
 @observable visible =  false;
 @observable opt = "add";
 @observable ownerRecordid =  {};
 @observable editFieldValues =  {};
 @observable mxSelectedData =  [];
 @observable selectedTabKey =  [];
 @observable whsjValue =  "";
 @observable sxdisabled =  "";
 @observable queryKey =  {};
 @observable mxlogloading = false;
 @observable mxdataSource = [];
 @observable mxlogdataSource = [];
 @observable queryJgmxKey = {};
 @observable colums = [{
    title: 'e9.perfortest.jgmx.xsxjcjgjcbc',
    dataIndex: 'xsxjcjgjcbc',
    width: 150
  },
  {
    title: 'e9.perfortest.jgmx.xsxjcjgjclx',
    dataIndex: 'xsxjcjgjclx',
    width: 200
  },
  {
    title: 'e9.perfortest.jgmx.xsxjcjgzsjg',
    dataIndex: 'xsxjcjgzsjg',
    width: 200
  },
  {
    title:'e9.perfortest.jgmx.xsxjcjgkkjg',
    dataIndex: 'xsxjcjgkkjg',
    width: 200
  },
  {
    title: 'e9.perfortest.jgmx.xsxjcjgwzjg',
    dataIndex: 'xsxjcjgwzjg',
    width: 200
  },
  {
    title: 'e9.perfortest.jgmx.xsxjcjgkyjg',
    dataIndex: 'xsxjcjgkyjg',
    width: 200
  }];


  url="";
  wfenable=false;
  oldver=true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeObservable(this);
  }
  
  @action onmxRowChange = (selectedRowKeys, records)=> {
    this.mxSelectedData = records;
  }

 
  


 @action setParams = async (params, nosearch) => {
    this.queryKey = params;
    if (!nosearch) {
      await this.findAll();
    }
  }


  @action resetEditRecord = (value) => {
    this.editRecord = value;
  }


  @action  findAll = async (params) =>{
    this.loading = true;
    this.ownerRecordid=params;
    this.queryKey = {jgzid:params};
    try {
      var xdataS = await SxjcjgMxService.findAll(this.queryKey);
      this.mxdataSource = [];
      this.mxdataSource = xdataS;
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }
  
  @action setSelectRows = (selectRowKeys, selectRowRecords) => {
    this.selectRowKeys = selectRowKeys;
    this.selectRowRecords = selectRowRecords;
  }

  @action closeMxlogForm = () => {
    this.visible = false;
  }
 @action showMxlogForm = (id) => {
    this.visible = true;
    this.findAllmxlog(id);
  }



  @observable mxlogcolums = [{
    title: 'e9.perfortest.mxlog.sxjcjcLogjcsjh',
    dataIndex: 'sxjcjcLogjcsjh',
    width: 200
  },{
    title: 'e9.perfortest.mxlog.sxjcjcLogjczsjg',
    dataIndex: 'sxjcjcLogjczsjg',
    width: 200
  },{
    title:'e9.perfortest.mxlog.sxjcjcLogjckkjg',
    dataIndex: 'sxjcjcLogjckkjg',
    width: 200
  },{
    title:'e9.perfortest.mxlog.sxjcjcLogjcwzjg',
    dataIndex: 'sxjcjcLogjcwzjg',
    width: 200
  },{
    title:'e9.perfortest.mxlog.sxjcjcLogjckyjg',
    dataIndex: 'sxjcjcLogjckyjg',
    width: 200
  }];

  @action  findAllmxlog = async (id) =>{
    this.mxlogloading = true;
    try {
    this.queryJgmxKey = { jgmxid: id };
    var xdataS = await SxjcjgLogService.findAll(this.queryJgmxKey);
    var mxlogdataSource = [];
    this.mxlogdataSource = xdataS;
    this.mxlogloading = false;
    } catch (err) {
      this.mxlogloading = false;
      throw err;
    }
  }
}

export default new sxjcjgMxStore();
