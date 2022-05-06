import { ITableService } from "../../../commons/panel";
import { EpsProps } from '../../../commons/declare/EpsPanel';
import type { ProColumns } from '@ant-design/pro-table';

export interface RecordTabsProps {
    name: string;     // tab的title
    key: any;        // tab的key
    comp: React.FC    // tab对应组件
}
type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    children?: DataSourceType[];
};

//用于明细表的表格配置
export interface EpsDetailProps extends EpsProps {
    detailService: ITableService;        //明细表的表格service
    detailSource: ProColumns<DataSourceType>[];           //明细表的数据解构   
    tabs?: Array<RecordTabsProps>        // 动态tab列表
    setDisabled?: (value) => void      // 控制主表单组件是否可以编辑
    setSelectedRowData?:(value) => void  //获取行点击事件的值
    setDisabledelete?: (Value) => void    //控制详情页流程按钮的显隐
    setDisablesave?: (Value) => void   //控制保存按钮和确认按钮是否可编
}
