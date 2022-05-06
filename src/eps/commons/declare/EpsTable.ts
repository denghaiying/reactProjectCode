import { EpsTableStore } from "@/eps/components/panel/EpsPanel2";
import { FormInstance } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";

export interface TabData {
    tab: string;                        // tab 显示的文字
    key: string | undefined             // tab对应的key值
  }

  export interface TabProps{
    tabData: TabData[];           // 左侧tab数据
    onTabChange: (key: any) => void        // 标签切换事件
  }

export interface MenuData {
  title: string;                    // 菜单名称
  icon: string;                     // 菜单使用图片
  color: string;                    // 菜单使用颜色
  params: Record<string, unknown>   // 菜单配置
  onClick: (record: any, store: EpsTableStore, row: any) => void      // 菜单点击事件
}


export interface ITable {
  size?: SizeType;                // 表格尺寸
  rowSelection?: unknown;          // 行选择控制
  disableEdit?: boolean;          // 是否禁用编辑
  disableDelete?: boolean;        // 是否禁用删除
  disableIndex?: boolean;         // 是否使用索引列
  disableAdd?: boolean;           // 是否使用新增
  editBtnControl?: (config: Record<string, unknown>) => boolean;    //编辑按钮控制
  delBtnControl?: (config: Record<string, unknown>) => boolean;    // 删除按钮控制
  tableSearch?: boolean;          // 右侧表格搜索框
  searchCode?: string;           // 搜索字段
  initSearchValue?: string;       // 搜索默认值
  refreshTree?: boolean;                // 在新增或删除操作后，是否刷新左侧树
  disableCopy?: boolean;          // 是否禁用复制按钮
  enableBatchDelete?: boolean;   // 是否启用批量删除
  deleteMessage?: string;         // 删除时提示信息
  labelColSpan?: number;          // 设置自定义表单标签宽度，默认为6
  actionColumnNum?: number;       // 设置表格自定义按钮区按钮数量
  defaultSize?: number;           // 默认分页大小
  disablePagination?: boolean;    // 是否禁用分页
  onAddClick?: (form: FormInstance) => void;        // 点击新增时事件
  onEditClick?: (form: FormInstance, data: Record<string, any>) => void;
  onSearchClick?: (form: FormInstance, store: EpsTableStore) => void;
  onDeleteClick?: (data?: Record<string, unknown>) => boolean;
  afterDelete?: (store: EpsTableStore, data?: Record<string, unknown>) => void;
  afterAdd?: (store: EpsTableStore, data?: Record<string, unknown>) => void;
  afterEdit?: (store: EpsTableStore, data?: Record<string, unknown>) => void;
}


