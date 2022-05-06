import EpsFormType from "../EpsFormType";

export interface EpsSource {
    title:          string;                  // 元数据名称
    code?:          string;                  // 元数据属性，对应待操作数据的属性
    align?:         string;                 // 表格对齐方式
    view?:          boolean;                 // 详情时是否在自动表单中显示(未实现)
    edit?:          boolean;                 // 编辑时是否在自动表单中显示(未实现)
    render?:        Function;              // 表格列表中自定义渲染
    width?:         string | number;        // 表格宽度
    ellipsis?:      boolean;             // 是否省略
    fixed?:         boolean | string        // 是否列冻结
    formType:       EpsFormType;          // 自动表单对应类型
    hidden?:        boolean;                // 在编辑和新增页面中隐藏表单项
    addHidden?:     boolean;             // 新增时隐藏
    eidtHidden?:    boolean;            // 编辑时隐藏
    tableHidden?:   boolean;           // 在表格中隐藏
    disabled?:      boolean;              // 表单中是否可编辑
    require?:       boolean;             // 表单中是否必填
    roles?:         Record<string, unknown>[]                 // 表单校验规则
    dataSource?:    EPsSourceDataSource[]; // 组件数据源，（select、switch之类的）
    defaultValue?:  Record<string, unknown> | string | number | boolean;           // 默认值(select、switch之类的)
}

export interface EPsSourceDataSource {
    key: string;
    title: string | number | boolean;
}
