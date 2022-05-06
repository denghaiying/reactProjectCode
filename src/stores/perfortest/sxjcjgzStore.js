
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
import SxjcjgzService from "../../services/perfortest/SxjcjgzService";
/**
 *etlStore
 */

class sxjcjgzStore {
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
  @observable sxjclxData = [{ value: '检测通过', label: '检测通过' }, { value: '检测未通过', label: '检测未通过' }];
  @observable colums = [{
    title:  'e9.perfortest.jcjg.xsxjcjgzjcly',
    dataIndex: "xsxjcjgzjcly",
    width: 180
  },
  {
    title:  'e9.perfortest.jcjg.xsxjcjgzjcbc',
    dataIndex: "xsxjcjgzjcbc",
    width: 300
  },{
    title:  'e9.perfortest.jcjg.xsxjcjgzjclx',
    dataIndex: "xsxjcjgzjclx",
    width: 300
  },{
    title:  'e9.perfortest.jcjg.xsxjcjgzjcjg',
    dataIndex: "xsxjcjgzjcjg",
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

  @action oncreatpdf = async(recordid) =>  {
    
    const data = await SxjcjgzService.createPdf(recordid);
    console.log(data)
          if (data) {
             window.open("/api/sxjcjgz/preview?patch="+data);
          }
  }

  @action setPageNo = async (pageno) => {
    this.pageno = pageno;
    this.loading = true;
    try {
    var xdataS = await SxjcjgzService.findForPage(this.params, this.pageno, this.pagesize);
    this.dataSource = [];
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
      var xdataS = await SxjcjgzService.findForPage(this.params, this.pageno, this.pagesize);
    this.dataSource = [];
    this.dataSource = xdataS;
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

  @action resetEditRecord = (value) => {
    this.editRecord = value;
  }

  @action queryData = async () => {
    this.loading = true;
    try {
    var xdataS = await SxjcjgzService.findForPage(this.params, this.pageno, this.pagesize);
    this.dataSource = [];
    this.dataSource = xdataS;
      this.loading = false;
    } catch (err) {
      this.loading = true;
      throw err;
    }
  }

 
  @action setSelectRows = (selectRowKeys, selectRowRecords) => {
    this.selectRowKeys = selectRowKeys;
    this.selectRowRecords = selectRowRecords;
  }
}

export default new sxjcjgzStore();