import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { message } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx';

function randomString(e: number = 16) {
  e = e || 16;
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    a = t.length,
    n = '';
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

class AddStore {
  constructor() {
    makeObservable(this);
  }

  // 弹框状态
  @observable isModalVisible = false;

  @observable id = '';

  // 显示/隐藏模态框
  @action setModalVisible = async (value: boolean) => {
    runInAction(() => {
      this.isModalVisible = value;
    });
  };

  @action save = async (value: Record<string, unknown>) => {
    return new Promise<any>((resolve, reject) => {
      value && (value.id = `DABY_${randomString(16)}`);
      new HttpRequest('')
        .post({ url: '/api/daby/', data: value })
        .then((res) => {
          message.success('档案编研创建成功');
          const data = res.data;
          runInAction(() => {
            this.id = data.id?.id;
            return resolve(true);
          });
        })
        .catch((err) => {
          message.error(err);
          return reject(false);
        });
    });
  };
}

export default new AddStore();
