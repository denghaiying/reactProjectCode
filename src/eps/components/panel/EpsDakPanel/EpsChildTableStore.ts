import {ITableService} from "@/eps/commons/panel";
import { action, observable, runInAction } from "mobx";

export default class EpsChildTableStore {
    
    readonly service: ITableService;

    constructor(service: ITableService) {
        this.service = service
    }

    @observable childTableList: Array<any> = []

    @observable childLoading: boolean = false;

    @observable childKey: string = '';

    @observable childPage: number = 1;

    @observable childSize: number = 20;

    defaultSize: number = 20;

    @observable childTotal: number = 0;

    @observable childParams: any = {}

    @action async findByKey(key = this.childKey, page = this.childPage, size = this.childSize, args = {}) {
        this.childLoading = true;
        this.childKey = key;
        let result = await this.service.findByKey(key, page-1, size, args)
        runInAction(() => {
            // this.tableList = result.results;
            let res:Array<any> = []
            if(result) {
                if (Array.isArray(result)){
                    res = result.map(item => {item.key = item.id; return item;})
                }else if (Array.isArray(result.data)){
                    res = result.data.map(item => {item.key = item.id; return item;})
                }else if (Array.isArray(result.results)){
                    res = result.results.map(item => {item.key = item.id; return item;})
                }
            }
            this.childTableList = res || [];
            this.childTotal = result?.total || 0;
            this.childPage = page;
            this.childSize = size;
            this.childLoading = false;
            this.childParams = args;
        })
    }

    @action save(data={}){
        return this.service.saveByKey(this.childKey, data)
    }

    @action delete(data={}){
        return this.service.deleteForTable(data);
    }

    @action update(data={}){
        return this.service.updateForTable(data);
    }

}