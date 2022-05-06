import HttpRequest from '@/eps/commons/v3/HttpRequest';
import { action, makeObservable, observable, runInAction } from 'mobx';

class ScStore {
  constructor() {
    makeObservable(this);
  }

  @observable id: string = '';

  @observable title: string = '';

  @observable type: number = 0;

  @observable scDrawer = false;

  @observable scId: string = '';

  @observable ocrText: string = '';

  @observable loading: boolean = false;

  @observable ocrImgs: string[] = [];

  @action scDrawerClose = async (
    status: boolean,
    title: string = '',
    type: number = 0,
    scId: string = '',
  ) => {
    runInAction(async () => {
      this.scDrawer = status;
      this.title = title;
      this.type = type;
      this.scId = scId;
    });
    if (status && type === 3) {
      runInAction(() => {
        this.loading = true;
      });
      const { data } = await new HttpRequest('').get({
        url: '/api/dabysc/classcal',
        params: { id: scId },
      });
      runInAction(() => {
        this.ocrImgs = data.result || [];
        this.loading = false;
      });
    }
    if (type === 1) {
      const { data } = await new HttpRequest('').get({
        url: '/api/dabysc/ocr',
        params: { id: scId },
      });
      runInAction(() => {
        this.ocrText = data.res?.join(' ');
      });
    }
  };

  @action getOcrNr = async () => {
    runInAction(async () => {});
  };

  @action classcal = async () => {};
}

export default new ScStore();
