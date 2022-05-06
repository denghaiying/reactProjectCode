import { ITableService } from '@/eps/commons/panel';
import { action, makeAutoObservable, observable, runInAction } from 'mobx';

export default class ApplyEditButtonStore {
  readonly service: any;

  @observable tableList: Array<any> = [];

  @observable visible: boolean = false;

  @observable loading: boolean = false;

  @observable key: string = '';

  @observable page: number = 1;

  @observable size: number = 10;

  defaultSize: number = 10;

  @observable total: number = 0;

  @observable params: any = {};

  @observable filter: any = {};

  fileUrl = '';

  constructor(service: any) {
    this.service = service;
    makeAutoObservable(this);
  }

  @action async findByKey(
    key = this.key,
    page = this.page,
    size = this.size,
    args = {},
  ) {
    this.loading = true;
    this.key = key;
    let result = await this.service.findByKey(key, page - 1, size, args);
    runInAction(() => {
      // this.tableList = result.results;
      let res = [];
      if (result) {
        if (Array.isArray(result)) {
          res = result.map((item) => {
            item.key = item.id;
            return item;
          });
        } else if (Array.isArray(result.data)) {
          res = result.data.map((item) => {
            item.key = item.id;
            return item;
          });
        } else if (Array.isArray(result.results)) {
          res = result.results.map((item) => {
            item.key = item.id;
            return item;
          });
        }
      }

      this.tableList = res || [];
      this.total = result?.total || 0;
      this.page = page;
      this.size = size;
      this.loading = false;
      this.params = args;
    });
  }

  @action setData = (filter) => {
    this.filter = filter;
  };

  @action setVisible = (bool: boolean) => {
    debugger;
    this.visible = bool;
  };

  @action save(data = {}) {
    return this.service.save({ ...data, ...this.filter });
  }

  @action delete(data = {}) {
    return this.service.deleteForTable(data);
  }

  @action update(data = {}) {
    return this.service.update(data);
  }

  @action updateBatch(data = {}) {
    return this.service.updateBatch(data);
  }

  @action updateAllDetail(data = {}) {
    return this.service.updateAllDetail(data);
  }
}
