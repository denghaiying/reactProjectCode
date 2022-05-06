import { EpsMainTableStore, EpsChildTableStore } from "@/eps/components/panel/EpsDakPanel";
import { EpsSource, ITable, ITree, MenuData, TabProps } from ".";
import { ITableService, ITreeService } from "../panel";

export interface ITitle {
    name: string;                   // 组件名称
    icon?: string;                  // 组件图标
}

export interface EpsDakProps {
    treeService: ITreeService;            // 树 service
    mainTableService: ITableService;      // 上表格 service
    childTableService: ITableService;     // 下表格 service
    source: EpsSource[];                  // 数据结构
    mainTableProp?: ITable;               // 上表格属性配置
    childTableProp?: ITable;              // 下表格属性配置
    treeProp?: ITree;                     // 树属性配置
    children?: any[] | undefined;         // 子组件
    title: ITitle;                        // 组件名称
    mainCustomForm?: Function;            // 上表格自定义表单
    childCustomForm?: Function;           // 下表格自定义表单
    mainSearchForm?: () => {};            // 上表格高级搜索表单
    childSearchForm?: () => {};           // 下表格高级搜索表单
    mainMenuProp?: Array<MenuData>;       // 上表格是否显示右侧菜单，默认不显示
    childMenuProp?: Array<MenuData>;      // 下表格是否显示右侧菜单，默认不显示
    tabProps?: TabProps;
    mainCustomAction?: (store: EpsMainTableStore) => any | ((store: EpsMainTableStore) => any)[]   // 上表格自定义功能按钮
    childCustomAction?: (store: EpsChildTableStore) => any | ((store: EpsChildTableStore) => any)[]   // 下表格自定义功能按钮
    mainCustomTableAction?: (text: string, record, index: number, store: EpsMainTableStore) => any | ((text: string, record, index: number, store: EpsMainTableStore) => any)[]  // 上表格自定义表格功能按钮
    childCustomTableAction?: (text: string, record, index: number, store: EpsChildTableStore) => any | ((text: string, record, index: number, store: EpsChildTableStore) => any)[]  // 下表格自定义表格功能按钮
    onTreeSelect?: (key) => any;          // 自定义左侧树点击事件
}