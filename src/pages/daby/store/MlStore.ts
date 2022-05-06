import HttpRequest from '@/eps/commons/v3/HttpRequest';
import { message } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx';

function randomString(e: number) {
  e = e || 16;
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    a = t.length,
    n = '';
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

class MlStore {
  constructor() {
    makeObservable(this);
  }

  @observable id: string = '';

  @observable data: { data: []; total: number; success: boolean }[] = [];

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

  @action save = async (value: Record<string, unknown>) => {
    value && (value.id = `DABYML_${randomString(16)}`);
    new HttpRequest('')
      .post({ url: '/api/dabyml/', data: value })
      .then((res) => {
        message.success('档案编研目录创建成功');
        const data = res.data;
        runInAction(() => {
          this.id = data.id;
        });
      })
      .catch((err) => message.error(err));
  };

  @action findAll = async (id: string) => {
    const { data } = await new HttpRequest('').get({
      url: '/api/dabyml/',
      params: { daby_id: id },
    });
    runInAction(() => {
      this.data = {
        data: data.list || [],
        total: data.total || 0,
        success: true,
      };
    });
  };

  @action update = async (content: string, id: string) => {
    new HttpRequest('')
      .put({ url: '/api/dabyml/' + id, data: { nr: content, id } })
      .then((res) => {
        message.success('数据保存成功');
      })
      .catch((err) => {
        message.error('数据保存失败');
      });
  };

  @action delete = async (data: { id: string }) => {
    return new Promise((resolve, reject) => {
      new HttpRequest('')
        .delete({ url: '/api/dabyml/' + data.id || data })
        .then((res) => {
          message.success('数据删除成功');
          return resolve(true);
        })
        .catch((err) => {
          message.error('数据删除失败');
          return reject(err);
        });
    });
  };
}

export default new MlStore();
