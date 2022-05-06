import HttpRequest from '@/eps/commons/v3/HttpRequest';
import { action, makeObservable, observable, runInAction } from 'mobx';

class HomeStore {
  constructor() {
    makeObservable(this);
  }

  // 列表数据
  @observable list = [];

  // 显示/隐藏模态框
  @action findAll = async () => {
    const result = await new HttpRequest('').get({ url: '/api/daby/' });
    runInAction(() => {
      this.list = result.data?.list || [];
    });
  };

  @action delete = async (id: string) => {
    new HttpRequest('').delete({ url: '/api/daby/' + id });
    this.findAll();
  };
}

export default new HomeStore();
