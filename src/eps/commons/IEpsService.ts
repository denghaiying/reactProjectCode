interface IEpsService{

    // page(params: {}): Function;           //  分页查询，通常用于表格
    findAll(params): Promise<any>;        // 查询所有数据，通常用于数据字典控件，如下拉框
    findById(params): Promise<any>;       // 根据Id查询
    update(data: Object): Promise<any>;         // 更新操作
    save(data: Object): Promise<any>;           // 新增操作
    delete(data: Object|String): Promise<any>;         // 删除操作

}

export default IEpsService;