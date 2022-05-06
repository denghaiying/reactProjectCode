
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
import SxjcjcgzService from "../../services/perfortest/SxjcjcgzService";
/**
 *etlStore
 */

class sxjcjcgzStore {
  @observable mbdataSource = [];
  @observable dataSource = [];
  @observable record = {};
  @observable params = {};
  @observable loading = false;
  @observable pageno = 1;
  @observable pagesize = 10;
  @observable opt = 'view';
  @observable delvisible = false;
  @observable modalVisible = false;
  @observable editRecord = {};
  @observable selectRowKeys = [];
  @observable selectRowRecords = [];
  @observable whsjValue = "";
  @observable deleteid = "";
  @observable jcData = [{ value: '归档检测', label: '归档检测' }, { value: '整编检测', label: '整编检测' },{ value: '长期保存检测', label: '长期保存检测'},{ value: '数据检测', label: '数据检测'},{ value: '移交检测', label: '移交检测'},{ value: 'EEP接收检测', label: 'EEP接收检测'}];
  @observable colums = [{
    title:  'e9.perfortest.jcgz.sxjcjcgzname',
    dataIndex: "sxjcjcgzname",
    width: 180
  },
  {
    title:  'e9.perfortest.jcgz.sxjcjcgzcode',
    dataIndex: "sxjcjcgzcode",
    width: 300
  }, {
    title:  'e9.perfortest.jcgz.sxjcjchj',
    dataIndex: "sxjcjcgzhj",
    width: 300
  },{
    title:  'e9.perfortest.jcgz.sxjcjcgzstate',
    dataIndex: "sxjcjcgzstate",
    width: 300
  }];
  @observable editFieldValues = {};

  
  url="";
  wfenable=false;
  oldver=true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeObservable(this);
  }

  @action setPageNo = async (pageno) => {
    this.pageno = pageno;
    this.loading = true;
    try {
    var mbdata = await SxjcjcgzService.findAllMb({});
    var xdataS = await SxjcjcgzService.findForPage(this.params, this.pageno, this.pagenize);
    this.dataSource = [];
    this.listdata = [];
    if (xdataS.list.length > 0) {
      var xdata = xdataS.list;
      for (var i = 0; i < xdata.length; i++) {
        var a = xdata[i];
        if (a.sxjcjcgzstate != "") {
          if (a.sxjcjcgzstate == "true") {
            a.sxjcjcgzstate = "开启"
          } else {
            a.sxjcjcgzstate = "关闭"
          }
        }
         if (a.sxjcjcgzcode != "") {
            for (var j = 0; j < mbdata.length; j++) {
              var b = mbdata[j];
              if (a.sxjcjcgzcode == b.id) {
                a.sxjcjcgzcode = b.mc
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

    @action setParams = async (params, nosearch) => {
    this.params = params;
    if (!nosearch) {
      await this.queryData();
    }
  }

  @action setPageSize = async (pageSize) => {

    this.pagesize = pageSize;
    this.loading = true;
    try {
      var mbdata = await SxjcjcgzService.findAllMb({});
      var xdataS = await SxjcjcgzService.findForPage(this.params, this.pageno, this.pagenize);
    this.dataSource = [];
    this.listdata = [];
    if (xdataS.list.length > 0) {
      var xdata = xdataS.list;
      for (var i = 0; i < xdata.length; i++) {
        var a = xdata[i];
        if (a.sxjcjcgzstate != "") {
          if (a.sxjcjcgzstate == "true") {
            a.sxjcjcgzstate = "开启"
          } else {
            a.sxjcjcgzstate = "关闭"
          }
        }
       if (a.sxjcjcgzcode != "") {
            for (var j = 0; j < mbdata.length; j++) {
              var b = mbdata[j];
              if (a.sxjcjcgzcode == b.id) {
                a.sxjcjcgzcode = b.mc
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
      var mbdata = await SxjcjcgzService.findAllMb({});
    var xdataS = await SxjcjcgzService.findForPage(this.params, this.pageno, this.pagenize);
    this.dataSource = [];
    this.listdata = [];
    if (xdataS.list.length > 0) {
      var xdata = xdataS.list;
      for (var i = 0; i < xdata.length; i++) {
        var a = xdata[i];
        if (a.sxjcjcgzstate != "") {
          if (a.sxjcjcgzstate == "true") {
            a.sxjcjcgzstate = "开启"
          } else {
            a.sxjcjcgzstate = "关闭"
          }
        }
         if (a.sxjcjcgzcode != "") {
            for (var j = 0; j < mbdata.length; j++) {
              var b = mbdata[j];
              if (a.sxjcjcgzcode == b.id) {
                a.sxjcjcgzcode = b.mc
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

  /**
   * 删除操作
   */
  @action delete = async (id) => {
    try {
      
     await SxjcjcgzService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
      var mbdata = await SxjcjcgzService.findAllMb({});
    var xdataS = await SxjcjcgzService.findForPage(this.params, this.pageno, this.pagenize);
    this.dataSource = [];
    this.listdata = [];
    if (xdataS.list.length > 0) {
      var xdata = xdataS.list;
      for (var i = 0; i < xdata.length; i++) {
        var a = xdata[i];
        if (a.sxjcjcgzstate != "") {
          if (a.sxjcjcgzstate == "true") {
            a.sxjcjcgzstate = "开启"
          } else {
            a.sxjcjcgzstate = "关闭"
          }
        }
        if (a.sxjcjcgzcode != "") {
            for (var j = 0; j < mbdata.length; j++) {
              var b = mbdata[j];
              if (a.sxjcjcgzcode == b.id) {
                a.sxjcjcgzcode = b.mc
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
        await SxjcjcgzService.updatesome(this.editRecord.id, values);
      } else {
        await SxjcjcgzService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      var mbdata = await SxjcjcgzService.findAllMb({});
        var xdataS = await SxjcjcgzService.findForPage(this.params, this.pageno, this.pagenize);
    this.dataSource = [];
    this.listdata = [];
    if (xdataS.list.length > 0) {
      var xdata = xdataS.list;
      for (var i = 0; i < xdata.length; i++) {
        var a = xdata[i];
        if (a.sxjcjcgzstate != "") {
          if (a.sxjcjcgzstate == "true") {
            a.sxjcjcgzstate = "开启"
          } else {
            a.sxjcjcgzstate = "关闭"
          }
        }
       if (a.sxjcjcgzcode != "") {
            for (var j = 0; j < mbdata.length; j++) {
              var b = mbdata[j];
              if (a.sxjcjcgzcode == b.id) {
                a.sxjcjcgzcode = b.mc
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

  @action queyfindAllmb = async () => {
    
    try {
    var xdataS = await SxjcjcgzService.findAllMb({});
    this.mbdataSource = [];
    var listdata=[];
     if (xdataS.length > 0) {
      for (var i = 0; i < xdataS.length; i++) {
        var a = xdataS[i];
        var mb={};
        mb.value=a.id;
        mb.label=a.mc;
       listdata.push(mb);
      }
    }
    this.mbdataSource=listdata;
    } catch (err) {
      this.loading = true;
      throw err;
    }
  }

  @action queyfindAllmbbymc = async (value) => {
    try {
      var parms={};
      parms.mc=value;
    var xdataS = await SxjcjcgzService.findAllMb(parms);
    this.mbdataSource = [];
    var listdata=[];
     if (xdataS.length > 0) {
      for (var i = 0; i < xdataS.length; i++) {
        var a = xdataS[i];
        var mb={};
        mb.value=a.id;
        mb.label=a.mc;
       listdata.push(mb);
      }
    }
    this.mbdataSource=listdata;
    } catch (err) {
      this.loading = true;
      throw err;
    }
  }
}

export default new sxjcjcgzStore();