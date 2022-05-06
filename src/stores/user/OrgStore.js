import { observable, action, runInAction } from 'mobx';
import IceNotification from '@icedesign/notification';
import OrgService from '../../services/user/OrgService';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';

class OrgStore extends BaseStore {
  @observable openRowKeys = [];
  @observable userData = [];
  @observable userSelect = [];
  @observable list = [];

  @action queryList = async () => {
    this.list = await this.findAll({});
  }

  @action toggleExpand = async (record) => {
    const key = record.id;
    const openRowKeys = this.openRowKeys;
    const index = openRowKeys.indexOf(key);
    if (index > -1) {
      openRowKeys.splice(index, 1);
      runInAction(() => {
        this.openRowKeys = [];
      });
      record.children = [];
    } else {
      openRowKeys.push(key);
      if (record.children && record.children.length === 0) {
        this.loading = true;
        const d = await OrgService.findByFid(key);
        if (d && d.length > 0) {
          record.children = d;
        } else {
          record.children = null;
        }
        runInAction(() => {
          this.openRowKeys = openRowKeys;
          this.loading = false;
        }
        );
      } else {
        this.openRowKeys = openRowKeys;
      }
    }
  }

  @action queryData = async (fid = '') => {
    this.loading = true;
    try {
      const data = await OrgService.findByFid(fid);
      runInAction(() => {
        this.data = data;
        this.loading = false;
      });
    } catch (err) {
      this.loading = true;
      throw err;
    }
  }


  @action delete = async (id) => {
    try {
      if (this.selectRowRecords && this.selectRowRecords.length) {
        if (this.selectRowRecords.length > 1) {
          IceNotification.info({ message: '只允许选择一条记录' });
          return;
        }
        IceNotification.info({ message: '请先删除子数据' });
        return;
      }
      const data = await OrgService.delete(id);
      this.editVisible = false;
      this.loading = true;
      if (data) {
        await this.queryData();
      }
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

  @action saveData = async (values) => {
    try {
      if (this.opt === 'edit') {
        await OrgService.update(this.editRecord.id, values);
      } else {
        await OrgService.add(values);
      }
      this.editVisible = false;
      this.loading = true;
      const fid = '';
      const data = await OrgService.findByFid(fid);
      runInAction(() => {
        this.data = data;
        this.loading = false;
      });
    } catch (err) {
      this.loading = false;
      throw err;
    }
  };

  @action reSetroleData = (values) => {
    this.userroleIds = values;
  };

  @action queryUser = async () => {
    const response = await fetch.get('/userapi/user', {});
    if (response && response.status === 200) {
      runInAction(() => {
        this.userData = response.data;
      });
      this.userSelect = this.userData.map(item => {
        return { value: item.id, label: `${item.userLoginname}|${item.userName}` };
      });
    }
  };
}

export default new OrgStore('/userapi/org');
