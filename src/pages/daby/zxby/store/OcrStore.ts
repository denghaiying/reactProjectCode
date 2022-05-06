import HttpRequest from '@/eps/commons/v3/HttpRequest';
import { action, makeObservable, observable, runInAction } from 'mobx';

class OcrStore {
  constructor() {
    makeObservable(this);
  }

  @observable txt: string = '';

  @observable imgs: string[] = [];

  @observable excels: string[] = [];

  @observable txtLoading: boolean = false;

  @observable imgLoading: boolean = false;

  @observable excelLoading: boolean = false;

  @observable currentIndex: number = 0;

  @action getOcrTxt = async (id: string, index: number) => {
    runInAction(() => {
      this.txtLoading = true;
    });
    const { data } = await new HttpRequest('').get({
      url: '/api/dabysc/ocrcls',
      params: { id, index },
    });
    runInAction(() => {
      this.txt = data.res?.join(' ') || '';
      this.txtLoading = false;
    });
  };

  @action getCls = async (id: string, index: number) => {
    runInAction(() => {
      this.imgLoading = true;
      this.excelLoading = true;

      // this.imgs = []
      // this.excels =  []
    });
    const { data } = await new HttpRequest('').get({
      url: '/api/dabysc/rescls',
      params: { id, index },
    });
    console.log('res cls data', data);
    runInAction(() => {
      this.imgLoading = false;
      this.excelLoading = false;
      this.imgs = data.imgs || [];
      this.excels = data.excels || [];
      this.currentIndex = index;
    });
  };
}

export default new OcrStore();
