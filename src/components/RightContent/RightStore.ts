import { action, makeAutoObservable, runInAction } from 'mobx';

import fetch from '../../utils/fetch';
import SysStore from '@/stores/system/SysStore';

class RightStore {
  url = '';
  wfenable = false;
  oldver = true;

  dbswCount = 1;
  cartCount = 1;
  wdscCount = 1;
  xtgjData = [];
  yhxxpx = false;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeAutoObservable(this);
  }

  @action queryAllWdscCount = async () => {
    // const url = "api/eps/control/main/daly/queryForCartCount?yhid="+SysStore.getCurrentUser().id ;
    try {
      const response = await fetch.post(
        `/api/eps/control/main/daly/queryForWdsc?yhid=${
          SysStore.getCurrentUser().id
        }`,
      );
      runInAction(() => {
        console.log('wdscCountresponse', response);
        this.wdscCount = response?.data.results.length;
      });
    } catch (err) {
      this.wdscCount = 0;
    }
  };

  @action queryAllMessageCount = async () => {
    try {
      const response = await fetch.post(
        `/api/eps/dsrw/pagemsg/queryMessageList?yhid=${
          SysStore.getCurrentUser().id
        }`,
      );
      this.dbswCount = response.data;
    } catch (err) {
      this.dbswCount = 0;
    }
  };

  @action queryAllDbswCount = async () => {
    try {
      const response = await fetch.post(`/api/eps/workflow/dbsw/queryForCount`);
      runInAction(() => {
        this.dbswCount = response.data;
      });
    } catch (err) {
      runInAction(() => {
        this.dbswCount = 0;
      });
    }
  };

  @action queryAllCartCount = async () => {
    // const url = "api/eps/control/main/daly/queryForCartCount?yhid="+SysStore.getCurrentUser().id ;
    try {
      const response = await fetch.post(
        `/api/eps/control/main/daly/queryForCartCount?yhid=${
          SysStore.getCurrentUser().id
        }`,
      );
      runInAction(() => {
        console.log('response', response);
        this.cartCount = response?.data;
      });
    } catch (err) {
      this.cartCount = 0;
    }
  };
  @action querygjx = async () => {
    const xtres = await fetch.post(
      `/api/eps/control/main/xt/queryForNoCheckReg`,
    );
    if (!xtres) {
      return;
    }
    const xt = xtres.data;
    const fileGrpid = xt?.filegrpid;
    if (fileGrpid) {
      const response = await fetch.post(
        `/api/eps/wdgl/attachdoc/queryForList?sfzxbb=1&ordersql=N&doctbl=ATTACHDOC&grptbl=DOCGROUP&grpid=${fileGrpid}`,
      );

      if (response.status === 200) {
        this.xtgjData = response.data;
      }
    }
  };
  @action getUserOption = async (code) => {
    console.log('-----------------getUserOption------------');
    const url =
      '/api/eps/control/main/params/getParamsDevOption?code=' +
      code +
      '&yhid=' +
      SysStore.getCurrentUser().id;
    const response = await fetch.get(url);

    if (response.status === 200) {
      this.yhxxpx = response.data == 'Y';
    } else {
      this.yhxxpx = false;
    }
  };
}

export default new RightStore('/api/eps/workflow', false, true);
