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

import { observable, action, runInAction, makeObservable } from 'mobx';
import SxjcjcgzMxService from "../../services/perfortest/SxjcjcgzMxService";
import SxjcjcszService from "../../services/perfortest/SxjcjcszService";
import XysjService from "../../services/perfortest/XysjService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
/**
 *etlStore
 */
class sxjcjcgzMxStore {
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
 @observable xzloading = false;
 @observable jcdata = [{ value: 'sxjcxCddy', label: '长度等于' }, { value: 'sxjcxCdd', label: '长度大于' }, { value: 'sxjcxCdxy', label: '长度小于' }, { value: 'sxjcxgsh', label: '格式化' }, { value: 'sxjcxgshcd', label: '格式化长度' }, { value: 'sxjcxisnumber', label: '必须数字' }, { value: 'sxjcxdy', label: '必须等于' }, { value: 'sxjcxnumberdy', label: '必须数字，并大于' }, { value: 'sxjcxnumberxy', label: '必须数字，并小于' },{value: 'sxjcxBl', label: '必须'}
    , { value: 'sxjcxZyz', label: '值域值' }, { value: 'sxjcxRqdy', label: '日期等于' }, { value: 'sxjcxRqd', label: '日期大于' }, { value: 'sxjcxRqx', label: '日期小于' }, { value: 'sxjcxRqdanddy', label: '日期大于等于' }, { value: 'sxjcxRqxyanddy', label: '日期小于等于' }, { value: 'sxjcxBhtszf', label: '包含特殊字符' },{ value: 'sxjcxwjgs', label: '扩展名' }, { value: 'sxjcxwjbl', label: '文件大小' }, { value: 'sxjcxwjgs', label: '类型' }, { value: 'sxjcxwjbl', label: '必须' }, { value: 'sxjcxywBb', label: '文件版本' }, { value: 'sxjcxwjywMd5', label: '文件MD5码' }
    , { value: 'sxjcszhtWdith', label: '尺寸Wdith' }, { value: 'sxjcszhtHgith', label: '尺寸Hgith' }, { value: 'sxjcszhtColor', label: '彩色' }, { value: 'sxjcxwjgs', label: '图片格式' },{ value: 'zssjly', label: '数据来源' }, { value: 'sxjcwjsize', label: '文件大小' }, { value: 'sxjcwjgs', label: '文件格式'},{ value: 'kk01', label: '包含恶意代码' }, { value: 'kk02', label: '已安装杀毒软件' },{value: 'ky01', label: '检测包含头文件'},{value:'GD-1-7', label: '档号规范性 ' },{ value: 'GD-1-8', label: '元数据项数据重复性' },{ value: 'GD-1-12', label: '文件和目录文件规范性' },{ value: 'GD-1-13', label: '信息包目录结构规范性' },{ value: 'GD-1-14', label: '信息包一致性' },{ value: 'GD-2-9', label: '归档范围检测'},{ value: 'GD-3-1', label: '信息包中元数据的可读性'},{ value: 'GD-3-2', label: '目标数据库中元数据可访问性'},{ value: 'GD-4-3', label: '载体中多余文件'},{ value: 'GD-3-8', label: '信息包中包含的内容数据格式合规范性'}
  ,{ value: 'GD-1-5', label: '合理性年度检测' },{ value: 'GD-1-3', label: '数据类型' },{ value: 'wz01', label: '检测电子文件大小相等' }, { value: 'wz02', label: '检测电子文件数量相等' },{ value: 'ky01', label: '检测包含头文件' },{ value: 'sxjcwjHjserver', label: '文件软硬件环境server'}, { value: 'sxjcwjHjprogram', label: '文件软硬件环境program'},{ value: 'sxjcwjHjsystem', label: '文件软硬件环境system'}, { value: 'sxjcwjglwj', label: '元数据关联文件检测'}, { value: 'sxjcwjsj', label: '文件属性创建时间'},{ value: 'sxjcxSjcf', label: '数据重复性' }];
 @observable bhdata = [{ value: 'kk01', label: '包含恶意代码' }, { value: 'kk02', label: '已安装杀毒软件' }, { value: 'ky01', label: '检测包含头文件' }, { value: 'wz01', label: '检测电子文件大小相等' }, { value: 'wz02', label: '检测电子文件数量相等' }, { value: 'wz03', label: '检测漏号' }];
 @observable mxdataSource = [];
 @observable szdataSource = [];
 @observable sxjclxData =  [{ value: '真实性', label: '真实性' },{ value: '安全性', label: '安全性' },{ value: '完整性', label: '完整性' },{ value: '可用性', label: '可用性' }];
 @observable colums = [{
    title: 'e9.perfortest.jcsz.sxjcjcszlx',
    dataIndex: 'sxjcjcszlx',
    width: 150
  },
  {
    title: 'e9.perfortest.jcsz.sxjcjcszbh',
    dataIndex: 'sxjcjcszbh',
    width: 200
  },
  {
    title: 'e9.perfortest.jcsz.sxjcjcszname',
    dataIndex: 'sxjcjcszname',
    width: 200
  },
  {
    title:'e9.perfortest.jcsz.sxjcjcszsxid',
    dataIndex: 'sxjcjcszsxid',
    width: 200
  },
  {
    title: 'e9.perfortest.jcsz.sxjcjcszz',
    dataIndex: 'sxjcjcszz',
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
  
  @action async findAllsz () {
    this.xzloading = true;
    try {
    var xysjdata = await XysjService.findAll();
    this.szqueryKey = { "jclx": "真实性" };
    var xdataS = await SxjcjcszService.findForKey(this.szqueryKey);
    var szSource = [];
    if (xdataS.length > 0) {
      for (var i = 0; i < xdataS.length; i++) {
        var a = xdataS[i];
        if (a.sxjcjcszname != "") {
          for (var k = 0; k < this.jcdata.length; k++) {
            var b = this.jcdata[k];
            if (a.sxjcjcszname == b.value) {
              a.sxjcjcszname = b.label
            }
          }
        }
        if (a.sxjcjcszbh != "") {
          for (var l = 0; l < this.bhdata.length; l++) {
            var b = this.bhdata[l];
            if (a.sxjcjcszbh == b.value) {
              a.sxjcjcszbh = b.label
            }
          }
        }
        if (a.sxjcjcszsxid != "") {
          for (var j = 0; j < xysjdata.length; j++) {
            var b = xysjdata[j];
            if (a.sxjcjcszsxid == b.id) {
              a.sxjcjcszsxid = b.xysjzdms
            }
          }
        }
        szSource.push(a);
      }
      }
      this.szdataSource = szSource;
      this.xzloading = false;
    } catch (err) {
      this.xzloading = false;
      throw err;
    }
  }


 @observable szcolums = [{
    title: 'e9.perfortest.gzmx.sxjcjcszlx',
    dataIndex: 'sxjcjcszlx',
    width: 150
  },{
    title: 'e9.perfortest.gzmx.sxjcjcszbh',
    dataIndex: 'sxjcjcszbh',
    width: 200
  },{
    title: 'e9.perfortest.gzmx.sxjcjcszname',
    dataIndex: 'sxjcjcszname',
    width: 200
  },{
    title:'e9.perfortest.gzmx.sxjcjcszz',
    dataIndex: 'sxjcjcszz',
    width: 200
  },{
    title:'e9.perfortest.gzmx.sxjcjcszzd',
    dataIndex: 'sxjcjcszzd',
    width: 200
  },{
    title:'e9.perfortest.gzmx.sxjcjcszfl',
    dataIndex: 'sxjcjcszfl',
    width: 200
  }];

 @action setxzParams = async (params, nosearch) => {
    this.szqueryKey = params;
    await this.findqueryData();
  }

  @action async findqueryData () {
    this.xzloading = true;
    try {
    this.szdataSource =[];
    var xysjdata = await XysjService.findAll();
    var xdataS = await SxjcjcszService.findForKey(this.szqueryKey);
    var szSource = [];
    if (xdataS.length > 0) {
      for (var i = 0; i < xdataS.length; i++) {
        var a = xdataS[i];
        if (a.sxjcjcszname != "") {
          for (var k = 0; k < this.jcdata.length; k++) {
            var b = this.jcdata[k];
            if (a.sxjcjcszname == b.value) {
              a.sxjcjcszname = b.label
            }
          }
        }
        if (a.sxjcjcszbh != "") {
          for (var l = 0; l < this.bhdata.length; l++) {
            var b = this.bhdata[l];
            if (a.sxjcjcszbh == b.value) {
              a.sxjcjcszbh = b.label
            }
          }
        }
        if (a.sxjcjcszsxid != "") {
          for (var j = 0; j < xysjdata.length; j++) {
            var b = xysjdata[j];
            if (a.sxjcjcszsxid == b.id) {
              a.sxjcjcszsxid = b.xysjzdms
            }
          }
        }
        szSource.push(a);
      }
      }
        
      this.szdataSource = szSource;
      this.xzloading = false;
    } catch (err) {
      this.xzloading = false;
      throw err;
    }
  }

  @action onmxRowChange = (selectedRowKeys, records)=> {
    this.mxSelectedData = records;
  }

 
  @action onSaveDataAction = async (data) => {
    
    let j = this.mxSelectedData.length;
    if (j > 0) {
      this.mxListData = [];
      for (let i = 0; i < j; i++) {
        
        this.jcmxdata = {};
        this.mxdate = this.mxSelectedData[i];
        this.jcmxdata.sxjcjcgzmxjcszid = this.mxdate.id;
        this.jcmxdata.sxjcjcgzmxjcgzid = this.ownerRecordid;
        this.mxListData.push(this.jcmxdata);
        
      }
      try {
        
        await SxjcjcgzMxService.addList({ jcgzmxlist: this.mxListData });
      } catch (e) {
        Message.error(e.message);
        return;
      }
    }
    var xysjdata = await XysjService.findAll();
    var xdataS = await SxjcjcgzMxService.findAllList(this.queryKey);
    this.mxdataSource = [];
     this.listdata = [];
    if (xdataS.length > 0) {
      for (var i = 0; i < xdataS.length; i++) {
        var a = xdataS[i];
        if (a.sxjcjcszname != "") {
          for (var k = 0; k < this.jcdata.length; k++) {
            var b = this.jcdata[k];
            if (a.sxjcjcszname == b.value) {
              a.sxjcjcszname = b.label
            }
          }
        }
        if (a.sxjcjcszbh != "") {
          for (var l = 0; l < this.bhdata.length; l++) {
            var b = this.bhdata[l];
            if (a.sxjcjcszbh == b.value) {
              a.sxjcjcszbh = b.label
            }
          }
        }
        if (a.sxjcjcszsxid != "") {
          for (var m = 0; m < xysjdata.length; m++) {
            var b = xysjdata[m];
            if (a.sxjcjcszsxid == b.id) {
              a.sxjcjcszsxid = b.xysjzdms
            }
          }
        }
        xdataS.list = this.listdata;
      }
      this.mxdataSource = xdataS;
      this.loading = false;
    }
    this.visible = false;
  }


 @action setParams = async (params, nosearch) => {
    this.queryKey = params;
    if (!nosearch) {
      await this.queryData();
    }
  }

  @action showDelete = (editRecord) => {
    this.delvisible = true;
    this.deleteid = editRecord;
  }

  @action closeDeleteForm = () => {
    this.delvisible = false;
  }

  @action closeEditForm = () => {
    this.visible = false;
  }

  @action resetEditRecord = (value) => {
    this.editRecord = value;
  }


  @action  findAll = async (params) =>{
    this.loading = true;
    this.ownerRecordid=params;
    this.queryKey = {gzid:params};
    try {
     var xysjdata = await XysjService.findAll();
      var xdataS = await SxjcjcgzMxService.findAllList(this.queryKey);
      this.listdata = [];
      if (xdataS.length > 0) {
        for (var i = 0; i < xdataS.length; i++) {
          var a = xdataS[i];
          if (a.sxjcjcszname != "") {
            for (var k = 0; k < this.jcdata.length; k++) {    
              var b = this.jcdata[k];
              if (a.sxjcjcszname == b.value) {
                a.sxjcjcszname = b.label
              }
            }
          }
          if (a.sxjcjcszbh != "") {
            for (var l = 0; l < this.bhdata.length; l++) {
              var b = this.bhdata[l];
              if (a.sxjcjcszbh == b.value) {
                a.sxjcjcszbh = b.label
              }
            }
          }
          if (a.sxjcjcszsxid != "") {
            for (var j = 0; j < xysjdata.length; j++) {
              var b = xysjdata[j];
              if (a.sxjcjcszsxid == b.id) {
                a.sxjcjcszsxid = b.xysjzdms
              }
            }
          }
          this.listdata.push(a);
       }
       xdataS.list = this.listdata;
      }
      this.mxdataSource = xdataS;
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

  @action showEditForm = () => {
    
    this.visible = true;
    this.findAllsz();
  }

@action onSelected = (keys, info)=> {
  this.listdeleteid =[];
    if (keys.length > 0) {
      for (var p = 0; p < keys.length; p++) {
        var a = keys[p];
      this.listdeleteid.push(a)
      }
    } 
}


  @action remove = async () => {
    try {
      
      var sd=this.jcdata;
      var aasd=this.listdeleteid;
      
      const data = await SxjcjcgzMxService.mxDelete({ "listid": this.listdeleteid});
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
      var xysjdata = await XysjService.findAll();
      var xdataS = await SxjcjcgzMxService.findAllList(this.queryKey);
      this.listdata = [];
      if (xdataS.length > 0) {
        for (var i = 0; i < xdataS.length; i++) {
          var a = xdataS[i];
          if (a.sxjcjcszname != "") {
            for (var k = 0; k < this.jcdata.length; k++) {    
              var b = this.jcdata[k];
              if (a.sxjcjcszname == b.value) {
                a.sxjcjcszname = b.label
              }
            }
          }
          if (a.sxjcjcszbh != "") {
            for (var l = 0; l < this.bhdata.length; l++) {
              var b = this.bhdata[l];
              if (a.sxjcjcszbh == b.value) {
                a.sxjcjcszbh = b.label
              }
            }
          }
          if (a.sxjcjcszsxid != "") {
            for (var j = 0; j < xysjdata.length; j++) {
              var b = xysjdata[j];
              if (a.sxjcjcszsxid == b.id) {
                a.sxjcjcszsxid = b.xysjzdms
              }
            }
          }
          this.listdata.push(a);
       }
       xdataS.list = this.listdata;
      }
      this.mxdataSource = xdataS;
      this.loading = false;
    } catch (err) {
      throw err;
    }
  }

  @action setSelectRows = (selectRowKeys, selectRowRecords) => {
    this.selectRowKeys = selectRowKeys;
    this.selectRowRecords = selectRowRecords;
  }

  @action saveData = async (values) => {
    try {
      if (this.opt === 'edit') {
        await SxjcjcszService.updatesome(this.editRecord.id, values);
      } else {
        await SxjcjcszService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      var xysjdata = await XysjService.findAll();
    var xdataS = await SxjcjcszService.findForPage(this.queryKey, this.pageno, this.pagesize);
    this.dataSource = [];
    this.listdata = [];
    if (xdataS.list.length > 0) {
      var xdata = xdataS.list;
      for (var i = 0; i < xdata.length; i++) {
        var a = xdata[i];
        if (a.sxjcjcszname != "") {
          for (var j = 0; j < this.kyxdata.length; j++) {
            var b = this.kyxdata[j];
            if (a.sxjcjcszname == b.value) {
              a.sxjcjcszname = b.label
            }
          }
        }
        if (a.sxjcjcszsxid != "") {
          for (var j = 0; j < xysjdata.length; j++) {
            var b = xysjdata[j];
            if (a.sxjcjcszsxid == b.id) {
              a.sxjcjcszsxid = b.xysjzdms
            }
          }
        }
        this.listdata.push(a);
      }
      xdataS.list = this.listdata;
    }
    this.dataSource = xdataS;
      this.loading = false;
    } catch (err) {
      throw err;
    }
  }
}

export default new sxjcjcgzMxStore();
