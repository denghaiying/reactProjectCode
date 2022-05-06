// @refresh reset
import { observable, action, runInAction } from 'mobx';
import fetch from '@/utils/fetch';
import util from '@/utils/util';
import BaseStore from '../BaseStore';
import LoginStore from './LoginStore';

class CommStore {
  @observable funcs = {};
  /**
   * 获取功能信息，功能
   */
  @action getFuncInfo = async (item) => {
    const f = this.funcs[item.umid];
    if (!f) {
      const v = this.findFunc(item.umid);
      if (v) {
        runInAction(() => {
          this.funcs[item.umid] = v;
        });
        return v;
      }
      return item;
    }
    return f;


  }


  findFunc (id) {
    const systems = LoginStore.systems;
    if (systems && systems.length > 0) {
      for (let i = 0; i < systems.length; i++) {
        const cld = systems[i].children;
        if (cld && cld.length > 0) {
          for (let j = 0; j < cld.length; j++) {
            if (cld[j].umid === id) {
              return cld[j];
            }
          }

        }
      }
    }
    return;
  }

};

export default new CommStore('');
