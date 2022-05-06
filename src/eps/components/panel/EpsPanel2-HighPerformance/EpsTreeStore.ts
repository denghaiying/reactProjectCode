import { TreeColumn } from '@/eps/commons/declare/EpsTree';
import { message } from 'antd';
import {
  action,
  observable,
  runInAction,
  makeAutoObservable,
  computed,
} from 'mobx';
import { ITreeService } from '../../../commons/panel';

export default class EpsTreeStore {
  readonly service: ITreeService;

  @observable treeList: Record<string, unknown>[] = [];

  @observable key: any = '';

  @observable params: Record<string, unknown> = {};

  @observable expandedKeys: string[] = [];

  @action getList(child, parent) {
    const tl = JSON.parse(JSON.stringify(this.treeList));
    return this.getTreeNodeData(tl, child, parent);
    // runInAction(() => {
    // this.treeList = this.getTreeNodeData(tl, child, parent)
    // })
  }

  constructor(service: ITreeService) {
    this.service = service;
    makeAutoObservable(this);
  }

  @action async findTree(args = '', params = this.params) {
    if (!this.service) {
      message.error('未设置左侧树Service，请检查系统');
      return;
    }
    const result = await this.service.findTree(args, params);
    runInAction(() => {
      if (params && params !== {}) {
        this.params = params;
      }
      this.treeList = result;
      this.expandedKeys = [];
    });
  }

  @action loadAsyncData = async (
    params: { key: string },
    child: JSX.Element,
    parent: JSX.Element,
  ) => {
    let { key } = params;
    let result = await this.service.loadAsyncDataByKey(key, this.params);
    let list = JSON.parse(JSON.stringify(this.treeList));
    list = this.updateTreeData(list, key, result);
    runInAction(() => {
      this.treeList = this.getTreeNodeData(list, child, parent);
    });
  };

  updateTreeData = (
    list: TreeColumn[],
    key: React.Key,
    children: TreeColumn[],
  ): TreeColumn[] => {
    if (list.length === 1 && list[0].key === 'root') {
      list.push(...children);
      return list;
    }
    return list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          // isLeaf: !node.children,
          isLeaf: node.isLeaf,
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
  };

  getTreeNodeData = (treeNodes, children, parent) => {
    let nodes = [];
    if (treeNodes && Array.isArray(treeNodes)) {
      nodes = treeNodes.map((node) => {
        if (!node.children || node.children.length === 0) {
          node.icon = children;
        }
        if (node.children && node.children.length > 0) {
          node.icon = parent;
          node.children = this.getTreeNodeData(node.children, children, parent);
        }
        return node;
      });
    }

    return nodes;
  };
}
