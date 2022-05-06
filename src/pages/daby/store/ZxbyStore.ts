import HttpRequest from '@/eps/commons/v3/HttpRequest';

import { action, makeObservable, observable, runInAction } from 'mobx';

class ZxbyStore {
  constructor() {
    makeObservable(this);
  }

  @observable treeData = [];

  @observable id: string = '';

  @observable mlKey: string = '';

  @observable scData = [];

  @observable scTotal = 0;

  @observable viewImg = 'null';

  @observable ocrText = '';

  // 弹框状态
  @observable isModalVisible = false;

  // 显示/隐藏模态框
  @action setModalVisible = async (value: boolean) => {
    runInAction(() => {
      this.isModalVisible = value;
    });
  };

  // 显示/隐藏模态框
  @action setMlKey = async (value: string) => {
    runInAction(() => {
      this.mlKey = value;
    });
  };

  @action findTreeData = async (id: string) => {
    const { data } = await new HttpRequest('').get({
      url: '/api/dabyml/',
      params: { daby_id: id },
    });
    runInAction(() => {
      this.treeData =
        (data.list &&
          data.list?.map((item) => {
            return {
              id: item.id,
              title: item.mc,
              key: item.id,
              mc: item.mc,
              nr: item.nr,
            };
          })) ||
        [];
    });
  };

  @action setModalVisibleAndId = async (value: boolean, id: string) => {
    runInAction(() => {
      this.isModalVisible = value;
      this.id = id;
    });
  };

  @action setViewImg = (value: Blob) => {
    runInAction(() => {
      this.viewImg = value;
    });
  };

  @action findScData = async (daby_id: string, type: string = '') => {
    const { data } = await new HttpRequest('').get({
      url: '/api/dabysc/',
      params: { daby_id: daby_id },
    });
    runInAction(() => {
      this.scData = data.list || [];
      this.scTotal = data.total || 0;
    });
  };

  @action findviewImage = async (dabysc_id: string) => {
    runInAction(() => {
      this.viewImg = '/api/dabysc/view/' + dabysc_id;
    });
  };

  @action ocr = async (id: string) => {
    const { data } = await new HttpRequest('').get({
      url: '/api/dabysc/ocr',
      params: { id },
    });
    runInAction(() => {
      this.ocrText = data.res?.join(' ');
    });
  };
}

export default new ZxbyStore();
