import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';

class MkService extends BaseService implements IEpsStore {

    findTree(key: string = '') {
        let params = { key }
        return new Promise((resolve, reject) => {

            let data = [
                { id: 1, title: "全部", key: "1" },
                { id: 2, title: "未鉴定", key: "2" },
                { id: 3, title: "已鉴定", key: "3" },

            ]
            return resolve(data);
        })
    }

    page(): Function {
        throw new Error('Method not implemented.');
    }

    findAll(params: any) {
        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + '/queryForList', params }).then(res => {
                if (res.status > 300) {
                    return reject(res)
                }
                let data = res.data.map(item => { return { id: item.mkbh, title: item.mc, key: item.mkbh } })
                return resolve(data)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }

    list: any[];
    currentPage: number;
    pageSize: number;
    params: JSON;
    tableLoading: Boolean;

}

export default new MkService('/api/eps/control/main/mk/');
