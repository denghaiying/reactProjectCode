import StoreManagerService from '../../services/longpreservation/StoreManagerService';

export default {
  list: [],

  
  columns: [{
    title: 'e9.longpriservation.storemanager.name',
    dataIndex: 'name',
    width: 200,
    lock: true,
  },{
    title: 'e9.longpriservation.storemanager.srv',
    dataIndex: 'srv',
    width: 100,
    lock: true,
  }, {
    title: 'e9.longpriservation.storemanager.port',
    dataIndex: 'port',
    width: 100,
  }, {
    title: 'e9.longpriservation.storemanager.username',
    dataIndex: 'username',
    width: 100
  } , {
    title: 'e9.longpriservation.storemanager.rootdir',
    dataIndex: 'rootdir',
    width: 100
  } , {
    title: 'e9.longpriservation.storemanager.bz',
    dataIndex: 'bz',
    width: 100
  }/*, {
    title: 'e9.pub.whr',
    dataIndex: 'whr',
    width: 200,
  }*/, {
    title: 'e9.pub.whsj',
    dataIndex: 'whsj',
    width: 200,
  }],
  data: {},
  loading: false,
  pageno: 1,
  pagesize: 10,
  params: {},
  opt: 'view',
  modalVisible: false,
  editRecord: {},
  selectRowKeys: [],
  selectRowRecords: [],
  usModalVisible: false,
  userData: [],
  roleuserIds: [],

  async queryList () {
    this.list = await StoreManagerService.findAll({});
  },
  async queryData (params = this.params) {
    this.loading = true;
    this.params = params;
    try {
      this.data = await StoreManagerService.queryForPage(this.params, this.pageno, this.pagesize);
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  },

  async setPageNo (pageno) {
    this.pageno = pageno;
    this.loading = true;
    try {
      this.data = await StoreManagerService.queryForPage(this.params, this.pageno, this.pagesize);
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  },

  async setPageSize (pagesize) {
    this.pagesize = pagesize;
    this.loading = true;
    try {
      this.data = await StoreManagerService.queryForPage(this.params, this.pageno, this.pagesize);
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  },

  async showEditForm (opt, editRecord) {
    this.opt = opt;
    this.modalVisible = true;
    this.editRecord = editRecord;
  },

  async closeEditForm () {
    this.modalVisible = false;
  },

  async resetEditRecord (value) {
    this.editRecord = value;
  },

  async delete (id) {
    try {
      await StoreManagerService.delete(id);
      this.modalVisible = false;
      this.loading = true;
      this.data = await StoreManagerService.queryForPage(this.params, this.pageno, this.pagesize);
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  },

  async saveData (values) {
    if (this.opt === 'edit') {
      try {
        await StoreManagerService.update(this.editRecord.id, values);
        this.modalVisible = false;
        this.loading = true;
        this.data = await StoreManagerService.queryForPage(this.params, this.pageno, this.pagesize);
        this.loading = false;
      } catch (err) {
        this.loading = false;
        throw err;
      }
    } else {
      try {
        await StoreManagerService.add(values);
        this.modalVisible = false;
        this.loading = true;
        this.data = await StoreManagerService.queryForPage(this.params, this.pageno, this.pagesize);
        this.loading = false;
      } catch (err) {
        this.loading = false;
        throw err;
      }
    }
  },

  async setSelectRows (selectRowKeys, selectRowRecords) {
    this.selectRowKeys = selectRowKeys;
    this.selectRowRecords = selectRowRecords;
  },

  async showUsDailog (visible) {
    this.usModalVisible = visible;
    if (visible) {
      this.userData = await StoreManagerService.findAll({});
      const userroles = await UserroleService.findByRoleId(this.selectRowRecords[0].id);
      this.userroleIds = userroles ? userroles.map(r => r.id) : [];
    }
  },

  async reSetroleData (values) {
    this.userroleIds = values;
  },

  async saveUserrole () {
    await UserroleService.updateByRoleId(this.selectRowRecords[0].id, this.userroleIds ?
      this.userroleIds.map(r => ({ roleId: this.selectRowRecords[0].id, userId: r })) : []);
  },
};
