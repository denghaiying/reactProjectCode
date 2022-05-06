import { action, observable, runInAction } from "mobx";
import {ITreeService} from "../../../commons/panel";



export default class EpsTreeStore {

    readonly service: ITreeService;

    @observable treeList: Array<any> = []

    constructor(service: ITreeService) {
        this.service = service
    }

    @action async findTree(args) {
        let result = await this.service.findTree(args)
       // runInAction(() => {
            this.treeList = result;
       // })
    }
}