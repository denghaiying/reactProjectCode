export default interface ISelectService {

    // 根据左侧tree的节点查询数据
    findByKey(key: string | number, args?: object) : Promise<any>;

}