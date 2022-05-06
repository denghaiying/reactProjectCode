export default interface ITableService {

    // 根据左侧tree的节点查询数据
    findByKey: (key: string | number, page: number, size: number, args?: Record<string, unknown>) => Promise<any>;

    // 新增方法
    saveByKey: (key: any, data: Record<string, unknown>, params?: Record<string, unknown>) => Promise<any>;

    // 删除
    deleteForTable: (data: Record<string, unknown>, params?: Record<string, unknown>) => Promise<any>;

    // 修改
    updateForTable: (data: Record<string, unknown>, params?: Record<string, unknown>) => Promise<any>

    // 批量删除
    batchDelete: (data: any[]) => Promise<any>
}