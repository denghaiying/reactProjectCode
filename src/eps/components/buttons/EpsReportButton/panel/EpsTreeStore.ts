import { TreeColumn } from "@/eps/commons/declare/EpsTree";
import { message } from "antd";
import { action, observable, runInAction } from "mobx";
import {ITreeService} from "../../../commons/panel";



export default class EpsTreeStore {

    readonly service: ITreeService;

    @observable treeList: Array<any> = []

    constructor(service: ITreeService) {
        this.service = service
    }

    @action async findTree(args) {
        if(!this.service){
            message.error('未设置左侧树Service，请检查系统');
            return;
        }
        let result = await this.service.findTree(args)
        runInAction(() => {
            this.treeList = result;
        })
    }

    @action loadAsyncData = async (params) => {
        let { key, children } = params;
        let result = await this.service.loadAsyncDataByKey(key)
        console.log('key - children', key, result)
        let list = this.treeList;
        runInAction(() => {
            list = this.updateTreeData(list, key, result)
            this.treeList = list
        })
    }

    updateTreeData = (list: TreeColumn[], key: React.Key, children: TreeColumn[]): TreeColumn[] => {
        return list.map(node => {
          if (node.key === key) {
            return {
              ...node,
              isLeaf: node.children == [] || !node.children || node.children.length === 0,
              children,
            };
          }
          if (node.children) {
            return {
              ...node,
              children: this.updateTreeData(node.children, key, children),
            };
          }
          return node;
        });
      }
}