
/**
 * 不建议将REST API请求的函数放在stores里面，因为这样以来这些请求代码很难测试。你可以尝试把这些请求函数放在一个类里面，
 * 把这个类的代码和store放在一起，在store创建时，这个类也相应创建。然后当你测试时，你也可以优雅的把数据从这些类里面mock上去。
 * 业务类提到store中，ui中建议不要放业务操作代码
 * 所有数据变更在store中进行变更，不允许在其它地方进行变更。即界面即使关闭了，再次打开，store中数据相同，界面也应该相同
 */

/**
 * etl请求API
 */
import { observable, action, makeObservable} from 'mobx';
import DzwjdjMxService from "../../services/perfortest/DzwjdjMxService";
/**
 *etlStore
 */

class dzwjdjMxStore {
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
  @observable ownerRecordid = "";
  @observable colums = [{
    title:  'e9.perfortest.dzwjdjmx.dzwjdjwjbh',
    dataIndex: "dzwjdjwjbh",
    width: 180
   },{
    title:  'e9.perfortest.dzwjdjmx.dzwjdjtm',
    dataIndex: "dzwjdjtm",
    width: 200
   },{
    title:  'e9.perfortest.dzwjdj.dzwjinfowcrq',
    dataIndex: "dzwjinfowcrq",
    width: 200
   },{
    title:  'e9.perfortest.dzwjdjmx.dzwjdjwjgbdm',
    dataIndex: "dzwjdjwjgbdm",
    width: 200,
   },{
    title:  'e9.perfortest.dzwjdjmx.dzwjdjwjlbdm',
    dataIndex: "dzwjdjwjlbdm",
    width: 200
   },{
    title:  'e9.perfortest.dzwjdjmx.dzwjdjwjztbh',
    dataIndex: "dzwjdjwjztbh",
    width: 200
   },{
    title:  'e9.perfortest.dzwjdjmx.dzwjdjbgqx',
    dataIndex: "dzwjdjbgqx",
    width: 200,
   },{
    title:  'e9.perfortest.dzwjdjmx.dzwjdjsize',
    dataIndex: "dzwjdjsize",
    width: 200
   },{
    title:  'e9.perfortest.dzwjdjmx.dzwjdjxcsj',
    dataIndex: "dzwjdjxcsj",
    width: 200
   },{
    title:  'e9.perfortest.dzwjdjmx.dzwjdjbz',
    dataIndex: "dzwjdjbz",
    width: 200,
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

    @action setParams = async (params, nosearch) => {
    this.params = params;
    if (!nosearch) {
      await this.queryData();
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

  @action queryData = async (id) => {
    this.loading = true;
    this.ownerRecordid=id;
    this.params = {dzwjdjinfoid:id};
    try {
    var xdataS = await DzwjdjMxService.findAll(this.params, this.pageno, this.pagenize);
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
      await DzwjdjMxService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
      var xdataS = await DzwjdjMxService.findAll(this.params, this.pageno, this.pagenize);
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
    if (this.ownerRecordid) {
        this.params = { dzwjdjinfoid: this.ownerRecordid };
      }
      values.dzwjdjdzwjinfoid = this.ownerRecordid;
      if (this.opt === 'edit') {
        await DzwjdjMxService.updatesome(this.editRecord.id, values);
      } else {
        await DzwjdjMxService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      var xdataS = await DzwjdjMxService.findAll(this.params, this.pageno, this.pagenize);
     this.dataSource = [];
     this.dataSource = xdataS;
    this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }
}

export default new dzwjdjMxStore();