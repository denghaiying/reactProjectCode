import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from '../../../../stores/system/SysStore';


class CqbcDakService extends BaseService implements IEpsService, ITreeService, ITableService {
    loadAsyncDataByKey(key: any): Promise<any> {
        return new Promise<any>(resolve => {
            return resolve([])
        });
    }

    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        args['dw'] = key || SysStore.getCurrentCmp().id;
        args['isdzwjzx'] = "Y";
        args['node'] = "root";
        args['page'] = page;
        args['limit'] = size;
        args['pageIndex'] = page;
        args['pageSize'] = size;
        args['sortField'] = "";
        args['sortOrder'] = "";
        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + '/queryAllTree_e9', params: args }).then(res => {
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



    findAll(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryForPage', params }).then(res => {
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

        return super.del(data);
    }




    //左边单位树
    findTree(key: string = '') {
        let params = { 'dwmc': key }
        let address = "/api/eps/control/main/dw"
        return new Promise((resolve, reject) => {
            return super.get({ url: address + `/queryForListByYhid?yhid=${SysStore.getCurrentUser().id}`, params }).then(res => {
                if (res.status > 300) {
                    return reject(res)
                }
                let data = res.data.map(item => { return { id: item.id, title: item.mc, key: item.id } })
                return resolve(data)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }


    addDakFz(data) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/addDakfz', params: data }).then(res => {
                if (res.data && res.data.success) {
                    return resolve(res.data);
                }
                return reject(res.data.message)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }

    addDak(data) {
        data['wlb'] = data.wlb === undefined ? null : data.wlb
        data['xh'] = data.xh === undefined ? null : data.xh
        let address = "/api/eps/control/main/dak"
        return new Promise((resolve, reject) => {
            return super.post({ url: address + '/add', params: data }).then(res => {
                if (res.data && res.data.success) {
                    return resolve(res.data);
                }
                return reject(res.data.message)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }

    updateDak(data) {
        let address = "/api/eps/control/main/dak"
        return new Promise((resolve, reject) => {
            return super.post({ url: address + '/update', params: data }).then(res => {
                if (res.data && res.data.success) {
                    return resolve(res.data);
                }
                return reject(res.data.message)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }



    updateDakfz(data) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/updateDakfz', params: data }).then(res => {
                if (res.data && res.data.success) {
                    return resolve(res.data);
                }
                return reject(res.data.message)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }

    queryMbList(data) {
        let address = "/api/eps/control/main/mb";
        return new Promise((resolve, reject) => {
            return super.post({ url: address + '/queryForPage', params }).then(res => {
                if (res.status > 300) {
                    return reject(res)
                } else {
                    var sjData = [];
                    if (res.data.length > 0) {
                        for (var i = 0; i < res.data.length; i++) {
                            let newKey = {};
                            newKey = res.data[i];
                            newKey.key = newKey.id
                            newKey.title = newKey.lable
                            sjData.push(newKey)
                        }
                        return resolve(sjData)
                    }
                }
            }).catch(err => {
                return reject(err)
            })
        }


        )
    }

    deleteDakfz(data) {

        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/deleteDakfz', params: data }).then(res => {
                if (res.data && res.data.success) {
                    return resolve(res.data);
                }
                return reject(res.data.message)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }

    deleteDak(data) {
        let address = "/api/eps/control/main/dak"
        return new Promise((resolve, reject) => {
            return super.post({ url: address + '/delete', params: data }).then(res => {
                if (res.data && res.data.success) {
                    return resolve(res.data);
                }
                return reject(res.data.message)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }

    //移动档案库，但是后端暂未实现方法
    moveFunction(data) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/updateDakXh', data }).then(res => {
                if (res.data && res.data.success) {
                    return resolve(res.data);
                }
                return reject(res.data.message)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }




    page(): Function {
        throw new Error('Method not implemented.');
    }
}

export default new CqbcDakService('/api/eps/control/main/dzwjzxdak');
