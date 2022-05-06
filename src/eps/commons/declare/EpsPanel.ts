import { EpsTableStore } from "@/eps/components/panel/EpsPanel";
import { FormInstance } from "antd";
import { EpsSource, ITable, ITree, MenuData, TabProps } from ".";
import { ISelectService, ITableService, ITreeService } from "../panel";

export interface ITitle {
    name: string;                   // 组件名称
    icon?: string;                  // 组件图标
}

export interface EpsProps extends EpsTableProps {
    menuLoad: (params?: any) => void;
    store?: (form: FormInstance<any>, store: any) => any ;
    treeService?: ITreeService;            // 树 service
    treeProp?: ITree;                     // 树属性配置
    treeParams?: Record<string, unknown>    // 左侧树初始化参数
    onTreeSelect?: (key) => any;            // 左侧树点击事件，设置后则不对右侧表格进行渲染
    noRender?: boolean;                     // 点击左侧树是否渲染右侧表格
    selectService?: ISelectService;         // 禁止渲染时，对应的selectService;
}

export interface EpsTableProps {
    treeAutoLoad?: boolean;               // 树自动加载
    tableAutoLoad?: boolean;              // 表格自动加载
    tableService: ITableService;          // 表格 service
    source: EpsSource[];                  // 数据解构
    tableProp?: ITable;                   // 表格属性配置
    children?: any[] | undefined;         // 子组件
    formWidth?: number;                   // 自定义表单宽度，如不设置则默认为500
    initParams?: object;                  // 初始化参数
    title: ITitle;                        // 组件名称
    customForm?: Function;                // 自定义表单
    searchForm?: () => {};                  // 高级搜索表单
    zIndex?: number;              // 高级搜索表单
    menuProp?: MenuData[];           // 是否显示右侧菜单，默认不显示
    menuButton?: Record<string, unknown>[]      // 菜单初始化那妞
    tabProps?: TabProps;
    addReadonly?: boolean;
    customAction?: (store: EpsTableStore, record: any[]) => any  | ((store: EpsTableStore, record: any[]) => any)[]   // 自定义功能按钮
    customTableAction?: (text: string, record, index: number, store: EpsTableStore, checkedRows: any[]) => any | ((text: string, record, index: number, store: EpsTableStore, checkedRows: any[]) => any)[]  // 自定义表格功能按钮
    afterTreeSelectAction?: (key) => any;
    tableRowClick?: (kdy, store: EpsTableStore) => any;
    initKey?: any;
    setCheckRows?: (value) => void;
}
