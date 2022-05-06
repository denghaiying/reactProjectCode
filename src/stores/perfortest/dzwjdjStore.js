
/**
 * 不建议将REST API请求的函数放在stores里面，因为这样以来这些请求代码很难测试。你可以尝试把这些请求函数放在一个类里面，
 * 把这个类的代码和store放在一起，在store创建时，这个类也相应创建。然后当你测试时，你也可以优雅的把数据从这些类里面mock上去。
 * 业务类提到store中，ui中建议不要放业务操作代码
 * 所有数据变更在store中进行变更，不允许在其它地方进行变更。即界面即使关闭了，再次打开，store中数据相同，界面也应该相同
 */

/**
 * etl请求API
 */
import { observable, action, runInActio, makeObservable} from 'mobx';
import DzwjdjService from "../../services/perfortest/DzwjdjService";
/**
 *etlStore
 */

class dzwjdjStore {
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
  @observable jllxdata = [{ label: '定长', value: '定长' },{ label: '可变长', value: '可变长' },{ label: '其他', value: '其他' }];
  @observable colums = [{
    title:  'e9.perfortest.dzwjdj.dzwjinfoztbh',
    dataIndex: "dzwjinfoztbh",
    width: 180
  },
  {
    title:  'e9.perfortest.dzwjdj.dzwjinfoztlx',
    dataIndex: "dzwjinfoztlx",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfowcrq',
    dataIndex: "dzwjinfowcrq",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfoxcbm',
    dataIndex: "dzwjinfoxcbm",
    width: 200,
  },
  {
    title:  'e9.perfortest.dzwjdj.dzwjinfoztaddress',
    dataIndex: "dzwjinfoztaddress",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfoztphone',
    dataIndex: "dzwjinfoztphone",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfoztlxr',
    dataIndex: "dzwjinfoztlxr",
    width: 200,
  },
  {
    title:  'e9.perfortest.dzwjdj.dzwjinfoztlxrmc',
    dataIndex: "dzwjinfoztlxrmc",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfowlfwqxh',
    dataIndex: "dzwjinfowlfwqxh",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfozzcs',
    dataIndex: "dzwjinfozzcs",
    width: 200,
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfoqt',
    dataIndex: "dzwjinfoqt",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfoczxt',
    dataIndex: "dzwjinfoczxt",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfosjkxt',
    dataIndex: "dzwjinfosjkxt",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfoxgrj',
    dataIndex: "dzwjinfoxgrj",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfojljg',
    dataIndex: "dzwjinfojljg",
    width: 200
  }, {
    title:  'e9.perfortest.dzwjdj.dzwjinfojllx',
    dataIndex: "dzwjinfojllx",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfojlzs',
    dataIndex: "dzwjinfojlzs",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfozzjs',
    dataIndex: "dzwjinfozzjs",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfojlxh',
    dataIndex: "dzwjinfojlxh",
    width: 200,
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfojlsl',
    dataIndex: "dzwjinfojlsl",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfojlbfs',
    dataIndex: "dzwjinfojlbfs",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfowjztxh',
    dataIndex: "dzwjinfowjztxh",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfowjztsl',
    dataIndex: "dzwjinfowjztsl",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfowjztbfs',
    dataIndex: "dzwjinfowjztbfs",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfotbrmc',
    dataIndex: "dzwjinfotbrmc",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfotbrq',
    dataIndex: "dzwjinfotbrq",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfosqrmc',
    dataIndex: "dzwjinfosqrmc",
    width: 200
  },{
    title:  'e9.perfortest.dzwjdj.dzwjinfosqrq',
    dataIndex: "dzwjinfosqrq",
    width: 200
  }
];
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
    var xdataS = await DzwjdjService.findForPage(this.params, this.pageno, this.pagenize);
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
      var xdataS = await DzwjdjService.findForPage(this.params, this.pageno, this.pagenize);
    this.dataSource = [];
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
    var xdataS = await DzwjdjService.findForPage(this.params, this.pageno, this.pagenize);
    this.dataSource = [];
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
      await DzwjdjService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
      var xdataS = await DzwjdjService.findForPage(this.params, this.pageno, this.pagenize);
      this.dataSource = [];
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
        await DzwjdjService.updatesome(this.editRecord.id, values);
      } else {
        await DzwjdjService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      var xdataS = await DzwjdjService.findForPage(this.params, this.pageno, this.pagenize);
     this.dataSource = [];
     this.dataSource = xdataS;
    this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }
}

export default new dzwjdjStore();