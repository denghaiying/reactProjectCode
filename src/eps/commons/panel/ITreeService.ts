export default interface ITreeService {

    // 根据关键字查询左侧菜单
    findTree: (key: string, params?: Record<string, unknown>) => Promise<any>;

    loadAsyncDataByKey: (key: unknown, params?: Record<string, unknown>) => Promise<any>;
}
