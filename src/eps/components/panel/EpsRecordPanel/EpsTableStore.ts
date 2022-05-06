import { ITableService } from '@/eps/commons/panel';
import { action, observable, runInAction, makeAutoObservable } from 'mobx';

export default class EpsTableStore {
  readonly service: ITableService;

  constructor(service: ITableService) {
    this.service = service;
    makeAutoObservable(this);
  }

  @observable tableList: Array<any> = [];

  @observable loading: boolean = false;

  @observable key: string = '';

  @observable page: number = 1;

  @observable size: number = 50;

  defaultSize: number = 50;

  @observable total: number = 0;

  @observable params: any = {};

  @observable selectedRowKeys: string[] = [];

  @observable checkedRows: any[] = [];

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
        } else if (Array.isArray(result.list)) {
          res = result.list.map((item) => {
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

  @action save(data = {}) {
    return this.service.saveByKey(this.key, data);
  }

  @action delete(data = {}) {
    return this.service.deleteForTable(data);
  }

  @action update(data = {}) {
    return this.service.updateForTable(data);
  }

  @action setSelectedRowKeys(selectedRowKeys: string[] = []) {
    if (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    }
  }

  @action setCheckedRows(checkedRows: any[] = []) {
    if (checkedRows) {
      this.checkedRows = checkedRows;
    }
  }
}
