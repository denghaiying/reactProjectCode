import { ITableService } from '@/eps/commons/panel';
import { action, observable, makeAutoObservable, runInAction } from 'mobx';
import { message } from '@umijs/plugin-request/lib/ui';

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

  selectedRowKeys: string[] = [];

  checkedRows: any[] = [];

  setSelectedRowKeys(selectedRowKeys: string[] = []) {
    runInAction(() => {
      if (selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      }
    });
  }

  setCheckedRows(checkedRows: any[] = []) {
    runInAction(() => {
      if (checkedRows) {
        this.checkedRows = checkedRows;
      }
    });
  }

  @action async findByKey(
    key = this.key,
    page = this.page,
    size = this.size,
    args = {},
  ) {
    this.loading = true;
    this.key = key;
    const result = await this.service.findByKey(key, page - 1, size, args);
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

  @action async clear(
    key = this.key,
    page = this.page,
    size = this.size,
    args = {},
  ) {
    runInAction(() => {
      // this.tableList = result.results;
      this.tableList = [];
      this.total = 0;
      this.page = page;
      this.size = size;
      this.params = args;
    });
  }

  @action save(data = {}) {
    return this.service.saveByKey(this.key, data, this.params);
  }

  @action delete(data = {}) {
    return this.service.deleteForTable(data, this.params);
  }

  @action update(data = {}) {
    return this.service.updateForTable(data, this.params);
  }

  @action batchDelete(data = []) {
    return this.service.batchDelete(data);
  }
}
