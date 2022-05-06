import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';

/**
 * 绩效管理与后台交互层
 */
class MonkpimngService extends BaseService implements ITableService {
    // 分页查询
    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        const params = { params: args, page: page + 1, size };
        return new Promise((resolve, reject) => {
            return super.findAll(params).then(res => {
                // 数据渲染
                return resolve(this.afterQueryData(res.data));
            }).catch(err => {
                return reject(err);
            })
        });
    }

    afterQueryData(data) {
        const list = data.list;
        const rowGroup = this.groupRowBy(list, item => {
            return item.yhId;
        });
        const listout = [];
        Object.keys(rowGroup).forEach(key => {
            const values = { yhmc: key };
            const data = rowGroup[key].sort((a, b) => {
                return a.index - b.index;
            });
            data.forEach(element => {
                values[element.processId] = element.amount;
            });
            listout.push(values);
        });
        data.list = listout;
        return data;
    }

    groupRowBy(list, record) {
        const groups = {};
        list.forEach(f => {
            const group = JSON.stringify(record(f));
            groups[group] = groups[group] || [];
            groups[group].push(f);
        });
        const map = {};
        Object.keys(groups).sort((a, b) => {
            return a - b;
        }).forEach(f => {
            map[f] = groups[f];
        });
        return map;
    }



    // 新增数据
    saveByKey(data) {
        data['whrid'] = SysStore.getCurrentUser().id;
        return super.post({
            url: `${this.url}/caculate`,
            data
        });
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
    //用户表查询全部数据
    findYhAll(params) {
        return new Promise((resolve, reject) => {
            return super.get({ url: '/api/eps/control/main/yh/queryForList', params }).then(res => {
                if (res.status == 200) {
                    const yhData = {};
                    res.data.forEach(element => {
                        yhData[element.id] = element.yhmc;
                    });
                    return resolve(yhData);
                }
                return null;
            }).catch(err => {
                return reject(err)
            })
        }
        )
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

    /**
     *  查询所有的工作内容
     * @returns 
     */
    findAllProjectDataByid(id) {
        return new Promise((resolve, reject) => {
            return super.get({ url: `/api/eps/dps/project/${id}` }).then(res => {
                // 数据渲染
                return resolve(res.data);
            }).catch(err => {
                return reject(err);
            })
        });
    }

}
export default new MonkpimngService('/api/eps/dps/monthkpi');