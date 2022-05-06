import { action, observable, runInAction } from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';

class TestSetStore extends BaseStore {
  @observable editVisibleMm = false;
  @observable text = false;
  @observable dataView = false;
  @observable textwords = {};


  @action textlog = () => {
    this.text = true;
  };

  @action customRequest = (option) => {
    const param = new FormData();
    if (option.data) {
      Object.keys(option.data).forEach(k => {
        param.append(k, option.data[k]);
      });
    }
    param.append(option.filename, option.file);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    fetch.post(`http://localhost:8081/jcsq/savefile/${encodeURIComponent(this.path)}`, param, config).then({
    });
  };

  @action closetext = () => {
    this.text = false;
  }

  @action createfile = async () => {
    const res = await fetch.get(`http://localhost:8081/jcsq/createfile`)
    if (res.status === 200) {
      runInAction(() => {
        this.path = res.data;
      });
    }
  }
  @action saveData = async (values) => {
    values = this.beforeSaveData(values);
    let response;
    if (this.opt === 'edit') {
      response = await fetch
        .put(`${this.url}/${encodeURIComponent(this.editRecord.iptcfgId)}`, values);
    } else {
      response = await fetch.post(this.url, values);
    }
    if (response && response.status === 201) {
      this.editVisible = false;
      this.queryForPage();
    }
  }
}
export default new TestSetStore('/iptcfg');
