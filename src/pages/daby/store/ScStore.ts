import HttpRequest from '@/eps/commons/v3/HttpRequest';
import { action, makeObservable, observable, runInAction } from 'mobx';

class ScStore {
  constructor() {
    makeObservable(this);
  }

  @observable id: string = '';

  // 弹框状态
  @observable isModalVisible = false;

  // 显示/隐藏模态框
  @action setModalVisible = async (value: boolean) => {
    runInAction(() => {
      this.isModalVisible = value;
    });
  };

  @action setModalVisibleAndId = async (value: boolean, id: string) => {
    runInAction(() => {
      this.isModalVisible = value;
      this.id = id;
    });
  };

  @action delete = async (id: string) => {
    await new HttpRequest('').delete({ url: '/api/dabysc/' + id });
  };
}

export default new ScStore();
