import HttpRequest from '@/eps/commons/v2/HttpRequest';
import SysStore from '@/stores/system/SysStore';
import { message } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx';

class DdStore {
  constructor() {
    makeObservable(this);
  }

  // 弹框状态
  @observable isModalVisible = false;

  @observable id = '';

  @observable tableList = [];

  @observable treeList = [];

  @observable fjList = [];

  @observable tableLoading = false;

  // 显示/隐藏模态框
  @action setModalVisible = async (value: boolean, id: string = '') => {
    runInAction(() => {
      this.isModalVisible = value;
      this.id = id;
    });
  };

  @action findTreeList = async () => {
    let args = {
      dw: SysStore.getCurrentCmp().id,
      dayh: SysStore.getCurrentUser().id,
      tmzt: 3,
      pageno: 1,
      pagesize: 50,
      noshowdw: 'Y',
      node: 'root',
    };
    const result = await new HttpRequest('').get({
      url: '/api/eps/control/main/dak/queryTreeNew',
      params: args,
    });
    if (result.status === 200) {
      runInAction(() => {
        this.treeList = result.data;
      });
    }
  };

  @action findTableList = async (
    value: string,
    page: number = 1,
    size: number = 50,
  ) => {
    runInAction(() => {
      this.tableLoading = true;
    });

    const dakRes = await new HttpRequest('').get({
      url: '/api/eps/control/main/dagl/queryKTable',
      params: { dakid: value },
    });

    let args = {
      dakid: value,
      tmzt: 3,
      hszbz: 'N',
      dwid: SysStore.getCurrentCmp().id,
      bmc: dakRes.data?.bmc,
      limit: 0,
      dayh: SysStore.getCurrentUser().id,
    };
    const result = await new HttpRequest('').get({
      url: '/api/eps/control/main/dagl/queryForPage',
      params: args,
    });
    if (result.status === 200) {
      let tableResult = result.data?.results || [];

      runInAction(() => {
        this.tableList = tableResult.map((item) => {
          item.bmc = dakRes.data?.bmc;
          item.dakid = dakRes.data?.dakid;
          return item;
        });
        this.tableLoading = false;
      });
    }
  };

  @action findFjList = async (tmid: string, bmc: string, grpid: string) => {
    const params = {
      doctbl: `${bmc}_fj`,
      grptbl: `${bmc}_FJFZ`,
      grpid: grpid,
      sfzxbb: 1,
      lx: '',
      psql: '$S$KCgxPTEpKQ==',
      daktmid: tmid,
    };

    const result = await new HttpRequest('').get({
      url: '/api/eps/wdgl/attachdoc/queryForList',
      params: params,
    });
    runInAction(() => {
      this.fjList = result.data || [];
    });
  };

  @action addSc = async (data: Record<string, unknown>, id: string) => {
    const result = await new HttpRequest('').post({
      url: `/api/dabysc/addSc/${id}`,
      data,
    });
    if (result.status === 200 || result.status === 201) {
      message.success('素材添加成功');
    } else {
      message.error('素材添加失败,' + result.statusText);
    }
  };
}

export default new DdStore();
