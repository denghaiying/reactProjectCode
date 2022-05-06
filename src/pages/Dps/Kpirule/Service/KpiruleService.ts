import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';

/**
 * 绩效计算规则定义与后台交互层
 */
class KpiruleService extends BaseService implements ITableService {

    // 分页查询
    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        const params = { params: args, page: page + 1, size };
        return new Promise((resolve, reject) => {
            return super.findAll(params).then(res => {
                // 数据渲染
                return resolve(res.data);
            }).catch(err => {
                return reject(err);
            })
        });
    }

    // 新增数据
    saveByKey(key, data) {
        data['id'] = `${Math.random()}`;
        data['whrid'] = SysStore.getCurrentUser().id;
        return super.save(data);
    };

    // 修改数据
    updateForTable(data) {
        return super.update(data)
    };

    // 删除数据
    deleteForTable(data: object): Promise<any> {
        return super.del(data);
    };
    /**
     * 查询全部数据
     * @param values 
     * @returns 
     */
    findAll(values) {
        return super.get({
          url: `${this.url}/list/`,
          params: {params: values}
        })
      }

    /**
     *  查询所有的工作内容
     * @returns 
     */
    findAllWorkData() {
        return new Promise((resolve, reject) => {
            return super.get({ url: '/api/eps/dps/work/list/' }).then(res => {
                // 数据渲染
                return resolve(res.data);
            }).catch(err => {
                return reject(err);
            })
        });
    }

    /**
     *  查询所有的工作内容
     * @returns 
     */
    findAllProcessData(values) {
        const params = { params: values }
        return new Promise((resolve, reject) => {
            return super.get({ url: '/api/eps/dps/process/list/', params: params }).then(res => {
                // 数据渲染
                return resolve(res.data);
            }).catch(err => {
                return reject(err);
            })
        });
    }

}
export default new KpiruleService('/api/eps/dps/kpirule');