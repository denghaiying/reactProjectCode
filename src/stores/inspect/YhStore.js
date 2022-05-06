import { action, observable } from 'mobx';
import BaseStore from '../BaseStore';
import LoginStore from '../system/LoginStore';
import fetch from '../../utils/fetch';
import { Message } from '@alifd/next';
import { FormattedMessage } from 'react-intl';

class YhStore extends BaseStore {
  @observable editVisibleMm = false;

  @observable dataView = false;

  @observable userData = [];

  @observable ptypeData = [];

  @observable userSelect = [];

  @observable ptypeSelect = [];

  @observable tyType = false;

  @action closeEditFormMm = () => {
    this.editVisibleMm = false;
  }

  @action showEditFormMm = (opt, editRecord) => {
    this.opt = opt;
    this.editVisibleMm = true;
    this.editRecord = this.beforeSetEditRecord(editRecord);
  }

  @action onChangeSwitch = (value) => {
    this.tyType = value;
  }

  @action saveDataMm = async (values) => {
    values = this.beforeSaveData(values);
    let response;
    if (this.opt === 'editMm') {
      response = await LoginStore.changepassword(values.yhId, values.yhMm);
      if (response && response.status === 201) {
        Message.show('密码修改成功！');
      }
    } else {
      response = await fetch.post(this.url, values);
    }
    if (response && response.status === 201) {
      this.editVisibleMm = false;
      this.queryForPage();
    }
  }

  @action saveData = async (values) => {
    values = this.beforeSaveData(values);
    let response;
    if (this.opt === 'edit') {
      response = await fetch
        .put(`${this.url}/${encodeURIComponent(this.editRecord.yhId)}`, values);
    } else {
      response = await fetch.post(this.url, values);
    }
    if (response && response.status === 201) {
      this.editVisible = false;
      this.queryForPage();
    }
  }

}
export default new YhStore('/yh');
