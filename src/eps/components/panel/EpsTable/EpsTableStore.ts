import ITableService from "@/eps/commons/table";
import { action, observable, runInAction } from "mobx";

export default class EpsTableStore {
    
    readonly service: ITableService;

    constructor(service: ITableService) {
        this.service = service
    }

    @observable tableList: Array<any> = []

    @observable loading: boolean = false;

    @observable key: string = '';

    @observable page: number = 1;

    @observable size: number = 10;

    defaultSize: number = 10;

    @observable total: number = 0;

    @action async queryForTable(key = this.key, page = this.page, size = this.size, args = {}) {
        this.loading = true;
        this.key = key;
        let result = await this.service.findByParams(page-1, size, args)
        runInAction(() => {
            this.tableList = result.results;
            this.total = result.total;
            this.page = page;
            this.size = size;
            this.loading = false;
        })
    }

    @action save(data={}){
        return this.service.saveForTable(data)
    }

    @action delete(data={}){
        return this.service.deleteForTable(data);
    }

    @action update(data={}){
        return this.service.updateForTable(data);
    }

}