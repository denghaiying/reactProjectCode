import { action, observable, runInAction, makeObservable } from 'mobx';
import BaseWfStore from './BaseWfStore';
import fetch from '@/utils/fetch';
import { message } from 'antd';

class LcfzStore extends BaseWfStore {
  list = [];
  queryForList = async () => {
    const response = await fetch.get('/api/eps/workflow/Lcfz/queryForList', {});
    if (response.data.length > 0) {
      this.list = response.data;
      return response.data;
    } else {
      return message.error(response.data.message, 0);
    }
  };
  update = async (values) => {
    const response = await fetch.get(this.url + '/update', {
      params: { ...values },
    });
    runInAction(() => {
      if (response && response.status === 200) {
        this.list = response.data;
      } else {
        return message.error(response.data.message, 0);
      }
    });
  };
}

export default new LcfzStore('/api/eps/workflow/Lcfz', false, true);
