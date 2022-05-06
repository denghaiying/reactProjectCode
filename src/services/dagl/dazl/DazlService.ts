import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';
import { ConsoleSqlOutlined } from '@ant-design/icons';


class DazlService extends BaseService implements IEpsService, ITreeService, ITableService {
    loadAsyncDataByKey(key: any): Promise<any> {
        return new Promise<any>(resolve => {
            return resolve([])
        });
    }

    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

        let newArgs: Object = {};

        // tmzt: 1
        // dakid: DAK201905080013030023
        // hszbz: N
        // bmc: DAK0010002
        // ids: DA202109161514380002,DA202109161515230003
        // pageIndex: 0
        // pageSize: 10
        // sortField:
        // sortOrder:
        // page: 0
        // limit: 10

        // if (args['keyValue']) {
        //     newArgs['key'] = args['keyValue'];
        // }

        newArgs['tmzt'] = args['tmzt'];
        newArgs['dakid'] = args['dakid'];
        newArgs['hszbz'] = "N";
        newArgs['bmc'] = args['ktable'].bmc;
        newArgs['mbid'] = args['ktable'].mbid;
        newArgs['ids'] = args['ids'].toString();
        newArgs['start'] = page;
        newArgs['limit'] = size;
        newArgs['pageIndex'] = page;
        newArgs['pageSize'] = size;
        newArgs['sortField'] = "";
        newArgs['sortOrder'] = "";

        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + '/queryForPage', params: newArgs }).then(res => {
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

    saveByKey(key: string, data: {} | undefined) {
        return super.save(data);
    }

    updateForTable(data) {
        return super.update(data)
    }

    deleteForTable(data) {

        return super.del(data);
    }




    getUserOption(params: any) {
        return new Promise((resolve, reject) => {
            return super.post({ url: '/api/eps/control/main/params/getUserOption', params }).then(res => {
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



    //排序刷新
    refreshDakPx(data: Object) {
        return new Promise((resolve, reject) => {
            return super.post({ url: '/api/eps/control/main/dagl/refreshDakPx', params: data }).then(res => {
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

    //生成档号
    createDh(data: Object) {
        return new Promise((resolve, reject) => {
            return super.post({ url: '/api/eps/control/main/dagl/genDh', params: data }).then(res => {
                if (res.data && res.data.success) {
                    return resolve(res.data);
                }
                return resolve(res.data)
            })
        }
        )
    }
    //下调
    dataDown(data: Object) {
        return new Promise((resolve, reject) => {
            return super.post({ url: '/api/eps/control/main/dagl/moveupdown', params: data }).then(res => {
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
    //上调
    dataUp(data: Object) {
        return new Promise((resolve, reject) => {
            return super.post({ url: '/api/eps/control/main/dagl/moveupdown', params: data }).then(res => {
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
    //互换
    dataExchange(data: Object) {
        return new Promise((resolve, reject) => {
            return super.post({ url: '/api/eps/control/main/dagl/dakTj', params: data }).then(res => {
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



    //检查是否以添加
    //   checkStjyd(jydid: string = '', tmid: string = '') {
    //     return new Promise((resolve, reject) => {
    //       return super.post({ url: `/api/eps/control/main/jydcx/queryJydmxForList?jydid=${jydid}&tmid=${tmid}` }).then(res => {
    //         if (res.data && res.data.success) {
    //           return resolve(res.data);
    //         }
    //         return reject(res.data.message)
    //       }).catch(err => {
    //         return reject(err)
    //       })
    //     }
    //     )
    //   }


    page(): Function {
        throw new Error('Method not implemented.');
    }
}

export default new DazlService('/api/eps/control/main/dagl');
