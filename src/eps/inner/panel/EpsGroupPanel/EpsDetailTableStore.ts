import { ITableService } from "@/eps/commons/panel";
import { action, observable, makeAutoObservable, runInAction } from "mobx";

export default class EpsDetailTableStore {

    readonly service: ITableService;

    constructor(service: ITableService) {
        this.service = service
        makeAutoObservable(this)
    }
    @observable detailTablelist: Array<any> = []

    @observable detailLoading: boolean = false;

    @observable detailKey: string = '';

    @observable detailPage: number = 1;

    @observable detailSize: number = 50;

    defaultDetailSize: number = 50;

    @observable detailTotal: number = 0;

    @observable params: any = {}

    @action async findByKey(key = this.detailKey, page = this.detailPage, size = this.detailSize, args = {}) {
        this.detailLoading = true;
        this.detailKey = key;
        let result = await this.service.findByKey(key, page - 1, size, args)
        runInAction(() => {
            let res = [];
            if (result) {
                if (Array.isArray(result)) {
                    res = result.map(item => { item.key = item.id; return item; })
                } else if (Array.isArray(result.data)) {
                    res = result.data.map(item => { item.key = item.id; return item; })
                } else if (Array.isArray(result.results)) {
                    res = result.results.map(item => { item.key = item.id; return item; })
                } else if (Array.isArray(result.list)) {
                    res = result.list.map(item => { item.key = item.id; return item; })
                }
            }
            this.detailTablelist = res || [];
            this.detailTotal = result?.total || 0;
            this.detailPage = page;
            this.defaultDetailSize = size;
            this.detailLoading = false;
            this.params = args;
        })
    }

    @action save(data = {}) {
        return this.service.saveByKey(this.detailKey, data)
    }

    @action delete(data = {}) {
        return this.service.deleteForTable(data);
    }

    @action update(data = {}) {
        return this.service.updateForTable(data);
    }

}