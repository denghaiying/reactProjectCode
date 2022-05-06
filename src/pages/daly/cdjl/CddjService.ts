import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import LydjStore from '@/stores/dadt/LydjStore';

import { ITableService, ITreeService } from "@/eps/commons/panel";

class CddjService extends BaseService implements IEpsStore, ITreeService, ITableService {

    page(): Function {
        throw new Error('Method not implemented.');
    }

    findByKey(key: string | number, page: number = 1, size: number = 20, args: object = {}): Promise<any> {
        args['djdid'] = LydjStore.editRecord.id;
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryForLydjtmmx', params: args }).then(res => {
                if (res.status > 300) {
                    return reject(res)
                }
                return resolve(res.data)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }


    lymxCount: 0;


    findCount(args: object = {}) {
        return new Promise((resolve, reject) => {
            args['djdid'] = LydjStore.editRecord.id;
            return super.get({ url: this.url + '/queryForLydjtmmx', params: args }).then(res => {
                if (res.status > 300) {
                    return reject(res)
                }
                debugger;
                console.log("res.data.results", res.data.results)
                console.log("res.data.results.length", res.data.results.length)
                this.lymxCount = res.data.results.length
                return resolve(res.data.results.length)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }


    findAll(params: any) {
        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + '/queryForList', params }).then(res => {
                if (res.status > 300) {
                    return reject(res)
                }
                return resolve(res.data)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }

    saveByKey(key, data) {

        return super.save(data);
    }

    updateForTable(data) {
        return super.update(data)
    }

    deleteForTable(data) {
        debugger;
        return new Promise((resolve, reject) => {
            // if (!data || data.length<=0) {
            //     return reject('请选择待删除数据')
            // }
            return super.post({
                url: `${this.url}/deleteLydjtmmx?id=${data.id}&ids=${data.djdid}`
            }).then(res => {
                if (res.data && res.data.success) {
                    LydjStore.findCount(LydjStore.editRecord.id)
                    return resolve(res.data);
                }
                return reject(res.data.message)
            }).catch(err => {
                return reject(err);
            })
        })
    }

    findTree(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + '/queryForList' }).then(res => {
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

    loadAsyncDataByKey(key): Promise<any> {
        return Promise.resolve(undefined);
    }


}

export default new CddjService('/api/eps/control/main/dalydj');
