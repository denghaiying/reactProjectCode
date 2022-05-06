import EpsTreeStore from "@/eps/components/panel/EpsPanel2/EpsTreeStore";
import { ReactNode } from "react";

export interface ITree {
    treeCheckAble?: boolean;        // 是否启用复选框
    treeSearch?: boolean;           // 左侧树搜索框
    fontColor?: string;             // 左侧树字体颜色
    onLoadData?: Promise<any>;      // 异步操作
    isAsync?: boolean;              // 是否启用异步
    defaultSelectKeys?: string[]    // 默认选中项
    extend?: boolean;
    onExtendChange?: (value: boolean) => void;
    treeExpand?: (record: Record<string, unknown>, treeStore: EpsTreeStore) => any;
}

