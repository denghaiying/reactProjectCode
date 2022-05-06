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
class sxjcjcszZsxStore {
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
 @observable sxjclxData = ['元数据','电子', '数字化','归档信息包'];
 @observable tjsxjclxData = [{ value: '元数据', label: '元数据' }, { value: '电子', label: '电子' }, { value: '数字化', label: '数字化' }, { value: '归档信息包', label: '归档信息包' }];
 @observable sxjcjcmxData =  {
     元数据: [{ value: 'sxjcxCddy', label: '长度等于' }, { value: 'sxjcxCdd', label: '长度大于' }, { value: 'sxjcxCdxy', label: '长度小于' }, { value: 'sxjcxgsh', label: '格式化' }, { value: 'sxjcxgshcd', label: '格式化长度' }, { value: 'sxjcxisnumber', label: '必须数字' }, { value: 'sxjcxdy', label: '必须等于' }, { value: 'sxjcxnumberdy', label: '必须数字，并大于' }, { value: 'sxjcxnumberxy', label: '必须数字，并小于' }
    , { value: 'sxjcxZyz', label: '值域值' }, { value: 'sxjcxRqdy', label: '日期等于' }, { value: 'sxjcxRqd', label: '日期大于' }, { value: 'sxjcxRqx', label: '日期小于' }, { value: 'sxjcxRqdanddy', label: '日期大于等于' }, { value: 'sxjcxRqxyanddy', label: '日期小于等于' }, { value: 'sxjcxBhtszf', label: '包含特殊字符' }
     ,{ value: 'GD-1-5', label: '合理性年度检测' },{ value: 'GD-1-3', label: '数据类型' },{ value: 'sxjcxSjcf', label: '数据重复性' }
    ],
    电子: [{ value: 'sxjcxwjgs', label: '扩展名' }, { value: 'sxjcxwjbl', label: '文件必录' }, { value: 'sxjcxywBb', label: '文件版本' }, { value: 'sxjcxwjywMd5', label: '文件MD5码' }, { value: 'sxjcwjsize', label: '文件属性大小' }, { value: 'sxjcwjgs', label: '文件属性格式'}, { value: 'sxjcwjsj', label: '文件属性创建时间'}, { value: 'sxjcwjname', label: '文件属性文件名称'}, { value: 'sxjcwjglwj', label: '元数据关联文件检测'}, { value: 'sxjcwjsj', label: '文件属性创建时间'}, { value: 'sxjcwjHjserver', label: '文件软硬件环境server'}, { value: 'sxjcwjHjprogram', label: '文件软硬件环境program'},{ value: 'sxjcwjHjsystem', label: '文件软硬件环境system'}],
    数字化: [{ value: 'sxjcszhtWdith', label: '尺寸Wdith' }, { value: 'sxjcszhtHgith', label: '尺寸Hgith' }, { value: 'sxjcszhtColor', label: '彩色' }, { value: 'sxjcxwjgs', label: '图片格式' }],
    归档信息包:[{ value: 'GD-1-7', label: '档号规范性 ' },{ value: 'GD-1-8', label: '元数据项数据重复性' },{ value: 'GD-1-12', label: '文件和目录文件规范性' },{ value: 'GD-1-13', label: '信息包目录结构规范性' },{ value: 'GD-1-14', label: '信息包一致性' }]};
 @observable jcdata = [{ value: 'sxjcxCddy', label: '长度等于' }, { value: 'sxjcxCdd', label: '长度大于' }, { value: 'sxjcxCdxy', label: '长度小于' }, { value: 'sxjcxgsh', label: '格式化' }, { value: 'sxjcxgshcd', label: '格式化长度' }, { value: 'sxjcxisnumber', label: '必须数字' }, { value: 'sxjcxdy', label: '必须等于' }, { value: 'sxjcxnumberdy', label: '必须数字，并大于' }, { value: 'sxjcxnumberxy', label: '必须数字，并小于' }
    , { value: 'sxjcxZyz', label: '值域值' }, { value: 'sxjcxRqdy', label: '日期等于' }, { value: 'sxjcxRqd', label: '日期大于' }, { value: 'sxjcxRqx', label: '日期小于' }, { value: 'sxjcxRqdanddy', label: '日期大于等于' }, { value: 'sxjcxRqxyanddy', label: '日期小于等于' }, { value: 'sxjcxBhtszf', label: '包含特殊字符' },{ value: 'sxjcxwjgs', label: '扩展名' }, { value: 'sxjcxwjbl', label: '文件大小' }, { value: 'sxjcxwjgs', label: '类型' }, { value: 'sxjcxwjbl', label: '必须' }, { value: 'sxjcxywBb', label: '文件版本' }, { value: 'sxjcxwjywMd5', label: '文件MD5码' }
    , { value: 'sxjcszhtWdith', label: '尺寸Wdith' }, { value: 'sxjcszhtHgith', label: '尺寸Hgith' }, { value: 'sxjcszhtColor', label: '彩色' }, { value: 'sxjcxwjgs', label: '图片格式' },{ value: 'zssjly', label: '数据来源' }, { value: 'sxjcwjsize', label: '文件属性大小' }, { value: 'sxjcwjgs', label: '文件属性格式'}, { value: 'sxjcwjsj', label: '文件属性创建时间'}, { value: 'sxjcwjname', label: '文件属性文件名称'}, { value: 'sxjcwjglwj', label: '元数据关联文件检测'}, { value: 'sxjcwjHjserver', label: '文件软硬件环境server'}, { value: 'sxjcwjHjprogram', label: '文件软硬件环境program'},{ value: 'sxjcwjHjsystem', label: '文件软硬件环境system'}
   ,{ value: 'GD-1-5', label: '合理性年度检测' },{ value: 'GD-1-3', label: '数据类型' },{ value: 'GD-1-12', label: '文件和目录文件规范性' },{ value: 'GD-1-13', label: '信息包目录结构规范性' },{ value: 'GD-1-14', label: '信息包一致性' },{ value: 'GD-2-9', label: '归档范围检测'},{ value: 'GD-3-1', label: '信息包中元数据的可读性'},{ value: 'GD-3-2', label: '目标数据库中元数据可访问性'},{ value: 'GD-1-7', label: '档号规范性 ' },{ value: 'GD-1-8', label: '元数据项数据重复性' },{ value: 'GD-4-3', label: '载体中多余文件'},{ value: 'GD-3-8', label: '信息包中包含的内容数据格式合规范性'},{ value: 'sxjcxSjcf', label: '数据重复性' }];
 @observable zsxflData = [{ value: '电子文件来源真实性', label: '电子文件来源真实性' }, { value: '电子文件元数据准确性', label: '电子文件元数据准确性' }, { value: '电子文件内容真实性', label: '电子文件内容真实性' }, { value: '元数据与内容关联一致性', label: '元数据与内容关联一致性' }, { value: '归档信息包真实性', label: '归档信息包真实性' }];
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
    this.sxjcdata = this.sxjcjcmxData[value];
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
      this.queryKey.jclx = "真实性";
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

export default new sxjcjcszZsxStore();
