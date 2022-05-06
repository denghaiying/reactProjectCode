import {ITableService} from "@/eps/commons/panel";
import { action, observable, runInAction } from "mobx";

export default class EpsMainTableStore {
    
    readonly service: ITableService;

    constructor(service: ITableService) {
        this.service = service
    }

    @observable mainTableList: Array<any> = []

    @observable mainLoading: boolean = false;

    @observable mainKey: string = '';

    @observable mainPage: number = 1;

    @observable mainSize: number = 20;

    defaultSize: number = 20;

    @observable mainTotal: number = 0;

    @observable mainParams: any = {}

    @action async findByKey(key = this.mainKey, page = this.mainPage, size = this.mainSize, args = {}) {
        this.mainLoading = true;
        this.mainKey = key;
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
            this.mainTableList = res || [];
            this.mainTotal = result?.total || 0;
            this.mainPage = page;
            this.mainSize = size;
            this.mainLoading = false;
            this.mainParams = args;
        })
    }

    @action save(data={}){
        return this.service.saveByKey(this.mainKey, data)
    }

    @action delete(data={}){
        return this.service.deleteForTable(data);
    }

    @action update(data={}){
        return this.service.updateForTable(data);
    }

}