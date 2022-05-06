interface IEpsStore{

    page(): Function;           //  分页查询，通常用于表格
    findAll(param: any): Promise<any>;        // 查询所有数据，通常用于数据字典控件，如下拉框
    findById(id: String): Promise<any>;       // 根据Id查询
    update(data: Object): Promise<any>;         // 更新操作
    save(data: Object): Promise<any>;           // 新增操作
    delete(data: Object|String): Promise<any>;         // 删除操作

    list:           Array<any>;     // 数据结果
    currentPage:    Number;     // 当前分页
    pageSize:       Number;     // 每页数量
    params:         JSON;           // 查询参数
    tableLoading:   Boolean;        // 表格加载状态 

}

export default IEpsStore;