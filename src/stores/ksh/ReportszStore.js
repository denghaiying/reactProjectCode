/* eslint-disable comma-dangle */
/**
 * 不建议将REST API请求的函数放在stores里面，因为这样以来这些请求代码很难测试。你可以尝试把这些请求函数放在一个类里面，
 * 把这个类的代码和store放在一起，在store创建时，这个类也相应创建。然后当你测试时，你也可以优雅的把数据从这些类里面mock上去。
 * 业务类提到store中，ui中建议不要放业务操作代码
 * 所有数据变更在store中进行变更，不允许在其它地方进行变更。即界面即使关闭了，再次打开，store中数据相同，界面也应该相同
 */

/**
 * ksh请求API
 */
import { observable, action, makeObservable } from 'mobx';
import ReportszService from "../../services/ksh/ReportszService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
/**
 *kshStore
 */
 class ReportszStore {
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
  @observable whsjValue ="";
  @observable deleteid ="";
  @observable colums =[
      {
        title: 'e9.ksh.reportsz.reportszbh',
        dataIndex: 'reportszbh',
        width: 80,
        lock: true
      },
      {
        title:  'e9.ksh.reportsz.reportszmc',
        dataIndex: 'reportszmc',
        width: 80,
        lock: true
      },
      {
        title: 'e9.ksh.reportsz.reportszurl',
        dataIndex: 'reportszurl',
        width: 300,
        lock: true
      }
    ];
  @observable editFieldValues = {};
  @observable zsmklxData=[{value: '统计', label: '统计'},{value: '大屏', label: '大屏'}];

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
     var xdataS = await ReportszService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=xdataS;
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
      var xdataS = await ReportszService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=xdataS;
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

 @action queryData  = async () =>{
    this.loading = true;
    try {
      var xdataS = await ReportszService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=xdataS;
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
      await ReportszService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
     var xdataS = await ReportszService.findForPage(this.params, this.pageno, this.pagesize);
          this.dataSource=[];
          this.dataSource=xdataS;
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
         await ReportszService.updatesome(this.editRecord.id, values);
      } else {
        await ReportszService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      var xdataS = await ReportszService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
       this.dataSource=xdataS;
        this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }
}

export default new ReportszStore();
