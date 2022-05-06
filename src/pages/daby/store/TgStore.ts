import HttpRequest from '@/eps/commons/v3/HttpRequest';
import { message } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx';

class TgStore {
  constructor() {
    makeObservable(this);
  }

  @observable treeData = [];

  @observable id: string = '';

  // 弹框状态
  @observable isModalVisible = false;

  // 显示/隐藏模态框
  @action setModalVisible = async (value: boolean) => {
    runInAction(() => {
      this.isModalVisible = value;
    });
  };

  @action findTreeData = async (id: string) => {
    const { data } = await new HttpRequest('').get({
      url: '/api/dabyml/',
      params: { daby_id: id },
    });
    runInAction(() => {
      this.treeData =
        data.list?.map((item) => {
          return {
            id: item.id,
            title: item.mc,
            key: item.id,
            mc: item.mc,
            nr: item.nr,
          };
        }) || [];
    });
  };

  @action findById = async (id: string) => {
    return new Promise((resolve, reject) => {
      new HttpRequest('').get({ url: `/api/daby/${id}` }).then((res) => {
        if (res.status === 200) {
          return resolve(res.data);
        }
        return reject(res.statusText);
      });
    });
  };

  @action setModalVisibleAndId = async (value: boolean, id: string) => {
    runInAction(() => {
      this.isModalVisible = value;
      this.id = id;
    });
  };

  @action handlePdf = async (id: string) => {
    let link = document.createElement('a');
    let fname = `默认文件名`; //下载文件的名字
    link.href = `/api/daby/pdf/${id}`;
    link.setAttribute('download', fname);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  @action modify = async (data: Record<string, unknown>) => {
    return new HttpRequest('').put({ url: `/api/daby/${this.id}`, data });
  };

  @action pdf = async (data: Record<string, unknown>) => {
    const response = await new HttpRequest('').put({
      url: `/api/daby/${this.id}`,
      data,
    });
    if (response.status === 200) {
      let link = document.createElement('a');
      let fname = `默认文件名`; //下载文件的名字
      const href = `/api/daby/pdf/${this.id}`;
      link.href = href + (data.redownload ? '?redownload=redownload' : '');
      link.setAttribute('download', fname);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      message.error(response.statusText);
    }
  };
}

export default new TgStore();
