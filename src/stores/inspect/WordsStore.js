import { observable, action, runInAction } from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';


class WordsStore extends BaseStore {
  @observable pagenos = 1;
  @observable pagesize = 70;
  @observable dataW = [];
  @observable pageSizeList = ['70', '100', '120'];
  @observable editRecords = {};
  @observable editVisibles = false;
  @observable editRecord = {};
  @observable disabled2 = false;
  @observable disabled3 = false;
  @observable disabled4 = false;
  @observable disabled5 = false;
  @observable disabled6 = false;
  @observable disabled7 = false;

  // 新增弹框显示
  @action showEditForms = (opt, editRecords) => {
    this.opt = opt;
    this.editVisibles = true;
    this.editRecords = this.beforeSetEditRecord(editRecords);
  }

  // 新增弹框关闭
  @action closeEditForms = () => {
    this.editVisibles = false;
  }

  // 编辑弹框显示
  @action showEditForm = (opt, editRecord) => {
    this.opt = opt;
    this.editVisible = true;
    this.editRecord = this.beforeSetEditRecord(editRecord);
  }
  // 编辑弹框关闭
  @action closeEditForm = () => {
    this.editVisible = false;
  }

  @action setPageNo = async (pageno) => {
    this.pageno = pageno;
    await this.queryForPage();
  }

  @action setPageSize = async (pageSize) => {
    this.pagesize = pageSize;
    await this.queryForPage();
  }
  @action queryForPage = async () => {
    this.loading = true;
    const response = await fetch
      .post(this.url, this.params, { params: { pageno: this.pageno, pagesize: this.pagesize } });
    if (response && response.status === 200) {
      runInAction(() => {
        this.data = response.data;
        this.dataW = this.afterQueryDataW(response.data);
        this.loading = false;
      });
    } else {
      this.loading = true;
    }
  }

  afterQueryDataW (data) {
    const id = 'id';
    const wordName = 'wordName';
    const list = [];
    const a = data.list;
    if (a.length >= 1) {
      for (let i = 0; i < a.length; i += 7) {
        const tabledata = {};
        let length = a.length - i;
        if (length > 7) {
          length = 7;
        }
        for (let index = 1; index <= length; index++) {
          tabledata[id + index] = a[i + index - 1].id;
          tabledata[wordName + index] = a[i + index - 1].wordName;
        }
        list.push(tabledata);
      }
    }
    return list;
  }

  @action saveData = async (values) => {
    let response;
    if (this.opt === 'edit') {
      values = this.beforeSaveData(values);
      response = await fetch
        .put(`${this.url}`, values);
    } else {
      response = await fetch.post(this.url, values);
    }
    if (response && response.status === 201) {
      this.editVisible = false;
      this.queryForPage();
    }
  }

  // 批量删除
  @action delete = async (values) => {
    values = this.beforeSaveData(values);
    const response = await fetch.post(`${this.url}/delete`, values);
    if (response && response.status === 204) {
      this.queryForPage();
    }
  }

  beforeSaveData (value) {
    const id = 'id';
    const wordName = 'wordName';
    const list = [];
    for (let index = 1; index <= 7; index++) {
      const mp1 = id + index;
      const mp2 = wordName + index;
      if (value.hasOwnProperty(mp1)) {
        list.push({ id: value[mp1], wordName: value[mp2] });
      }
    }
    return list;
  }
}

export default new WordsStore('/jcword');
