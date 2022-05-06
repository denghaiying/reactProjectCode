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
import SxjcjcszService from "../../services/perfortest/SxjcjcszService";
import XysjService from "../../services/perfortest/SxjcjcszServiceb";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
/**
 *etlStore
 */
class sxjcjcszWzxStore {
 @observable  listdata  =  [];
 @observable loading = false;
 @observable pageno = 1;
 @observable pagesize = 10;
 @observable opt = 'view';
 @observable delvisible = false;
 @observable modalVisible = false;
 @observable deleteid  = "";
 @observable dataSource = [];
 @observable selectedKeys = [];
 @observable whdataSource = [];
 @observable inited =  false;
 @observable visible =  false;
 @observable opt = "add";
 @observable ownerRecord =  {};
 @observable editFieldValues =  {};
 @observable mxSelectedData =  [];
 @observable mxdata =  {};
 @observable mxListData = [];
 @observable jcmxdata = {};
 @observable selectedTabKey =  [];
 @observable whsjValue =  "";
 @observable sxdisabled =  "";
 @observable queryKey =  {};
 @observable xysjsxData =  [];
 @observable xysjlxData =  [];
 @observable sxjcysjData =  [];
 @observable sxjcdata  =  [];
 @observable listdata =  [];
 @observable isDisabled= false;
 @observable wzData = ['元数据','电子文件','归档信息包'];
 @observable tjsxjclxData = [{ value: '元数据', label: '元数据' }, { value: '电子', label: '电子' }, { value: '数字化', label: '数字化' }, { value: '归档信息包', label: '归档信息包' }];
 @observable zsxflData = [{ value: '电子文件数据总量', label: '电子文件数据总量' }, { value: '电子文件元数据完整性', label: '电子文件元数据完整性' }, { value: '电子文件内容完整性', label: '电子文件内容完整性' }, { value: '归档信息报完整性', label: '归档信息报完整性' }];
 @observable jcdata = [{ value: 'sxjcxBl', label: '必录' },{ value: 'GD-2-3', label: '数据齐全' },{ value: 'wz01', label: '检测电子文件大小相等' }, { value: 'wz02', label: '检测电子文件数量相等' }, { value: 'wz04', label: '数据完整齐全' },{ value: 'GD-2-6', label: '连续性元数据项检测' },{ value: 'GD-2-9', label: '归档范围检测'},{ value: 'GD-2-11', label: '信息包内容数据完整性检测' }];
 @observable sxjcjcmxData = {
  元数据: [{ value: 'sxjcxBl', label: '必录' },{ value: 'GD-2-3', label: '数据齐全' }],
  电子文件:[{ value: 'wz01', label: '检测电子文件大小相等' }, { value: 'wz02', label: '检测电子文件数量相等' }, { value: 'wz04', label: '数据完整齐全' }],
  归档信息包:[{ value: 'GD-2-6', label: '连续性元数据项检测' },{ value: 'GD-2-9', label: '归档范围检测'},{ value: 'GD-2-11', label: '信息包内容数据完整性检测' }]
};

 @observable colums = [{
    title: 'e9.perfortest.zzx.sxjcjcszfl',
    dataIndex: 'sxjcjcszfl',
    width: 150
  },
  {
    title: 'e9.perfortest.zzx.sxjcjcszbh',
    dataIndex: 'sxjcjcszbh',
    width: 200
  },
  {
    title: 'e9.perfortest.zzx.sxjcjcszname',
    dataIndex: 'sxjcjcszname',
    width: 200
  },
  {
    title: 'e9.perfortest.zzx.sxjcjcszsxlx',
    dataIndex: 'sxjcjcszsxlx',
    width: 200
  },
  {
    title: 'e9.perfortest.zzx.sxjcjcszz',
    dataIndex: 'sxjcjcszz',
    width: 200
  },
  {
    title: 'e9.perfortest.zzx.sxjcjcszsxid',
    dataIndex: 'sxjcjcszsxid',
    width: 200
  },
  {
    title:'e9.perfortest.zzx.sxjcjcszbz',
    dataIndex: 'sxjcjcszbz',
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

 @action handleProvinceChange= async (value) => {
    if (value == '元数据') {
     this.sxjcdata = this.sxjcjcmxData[value];
      this.isDisabled=false;
    } else {
      this.sxjcdata = this.sxjcjcmxData[value];
      this.isDisabled=true;
    }
  }

 @action setParams = async (params, nosearch) => {
    this.queryKey = params;
    if (!nosearch) {
      await this.queryData();
    }
  }

  @action setPageNo = async (pageno) => {
    this.pageno = pageno;
    this.loading = true;
    try {
      var xysjdata = await XysjService.findAll();
      var xdataS = await SxjcjcszService.findForPage(this.queryKey, this.pageno, this.pagesize);
      this.dataSource = [];
      this.listdata = [];
      if (xdataS.list.length > 0) {
        var xdata = xdataS.list;
        for (var i = 0; i < xdata.length; i++) {
          var a = xdata[i];
          if (a.sxjcjcszname != "") {
            for (var j = 0; j < this.jcdata.length; j++) {
              var b = this.jcdata[j];
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
      this.loading = false;
      throw err;
    }
  }

  @action setPageSize = async (pageSize) => {
    this.pagesize = pageSize;
    this.loading = true;
    try {
      var xysjdata = await XysjService.findAll();
      var xdataS = await SxjcjcszService.findForPage(this.queryKey, this.pageno, this.pagesize);
      this.dataSource = [];
      this.listdata = [];
      if (xdataS.list.length > 0) {
        var xdata = xdataS.list;
        for (var i = 0; i < xdata.length; i++) {
          var a = xdata[i];
          if (a.sxjcjcszname != "") {
            for (var j = 0; j < this.jcdata.length; j++) {
              var b = this.jcdata[j];
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
      this.loading = false;
      throw err;
    }
  }

  @action showEditForm = (opt, editRecord) => {
    this.opt = opt;
    this.modalVisible = true;
    this.sxjcdata = this.sxjcjcmxData[editRecord.sxjcjcszsxlx];
    this.editRecord = editRecord;
  }

  @action showDelete = (editRecord) => {
    this.delvisible = true;
    this.deleteid = editRecord;
  }

  @action closeDeleteForm = () => {
    this.delvisible = false;
  }

  @action closeEditForm = () => {
    this.modalVisible = false;
  }

  @action resetEditRecord = (value) => {
    this.editRecord = value;
  }


  @action queryData = async () => {
    this.loading = true;
    try {
      this.queryKey.jclx = "完整性";
      var xysjlxdata = [];
        var data = await XysjService.findAll();
        for (var i = 0; i < data.length; i++) {
          const a = {};
          a.label = data[i].xysjzdms;
          a.value = data[i].id;
          xysjlxdata.push(a);
      }
      this.sxjcysjData = xysjlxdata;
      var xdataS = await SxjcjcszService.findForPage(this.queryKey, this.pageNo, this.pageSize);
      this.dataSource = [];
      if (xdataS.list.length > 0) {
        var xdata = xdataS.list;
        this.listdata = [];
        for (var i = 0; i < xdata.length; i++) {
          var a = xdata[i];
          if (a.sxjcjcszname != "") {
            for (var j = 0; j < this.jcdata.length; j++) {
              var b = this.jcdata[j];
              if (a.sxjcjcszname == b.value) {
                a.sxjcjcszname = b.label
              }
            }
          }
          if (a.sxjcjcszsxid != "") {
            for (var j = 0; j < data.length; j++) {
              var b = data[j];
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
      this.loading = true;
      throw err;
    }
  }

 
  @action delete = async (id) => {
    try {
      await SxjcjcszService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
      var xysjdata = await XysjService.findAll();
      var xdataS = await SxjcjcszService.findForPage(this.queryKey, this.pageno, this.pagesize);
      this.dataSource = [];
      if (xdataS.list.length > 0) {
        var xdata = xdataS.list;
        this.listdata = [];
        for (var i = 0; i < xdata.length; i++) {
          var a = xdata[i];
          if (a.sxjcjcszname != "") {
            for (var j = 0; j < this.jcdata.length; j++) {
              var b = this.jcdata[j];
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
      this.loading = false;
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
          for (var j = 0; j < this.jcdata.length; j++) {
            var b = this.jcdata[j];
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
      this.loading = false;
      throw err;
    }
  }
}

export default new sxjcjcszWzxStore();
