import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';
import { ConsoleSqlOutlined } from '@ant-design/icons';


class RecycleBinService extends BaseService implements IEpsService, ITreeService, ITableService {
    loadAsyncDataByKey(key: any): Promise<any> {
        return new Promise<any>(resolve => {
            return resolve([])
        });
    }

    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

        let newArgs: Object = {};
        if (args['keyValue']) {
            newArgs['key'] = args['keyValue'];
        }
        newArgs['dakid'] = args['dakid'];
        newArgs['mbid'] = args['ktable'].mbid;
        newArgs['bmc'] = args['ktable'].bmc;
        newArgs['daklx'] = args['ktable'].daklx;
        newArgs['tmzt'] = args['tmzt'];
        newArgs['dayh'] = SysStore.getCurrentUser().id;
        newArgs['dwid'] = SysStore.getCurrentUser().dwid;
        newArgs['hszbz'] = "Y";
        newArgs['orderwhsj'] = 1;
        newArgs['psql'] = "((1=1))";

        newArgs['start'] = page;
        newArgs['limit'] = size;
        newArgs['pageIndex'] = page;
        newArgs['pageSize'] = size;
        newArgs['sortField'] = "";
        newArgs['sortOrder'] = "";

        //查询当前用户权限,只可以查看自己的删除数据
        newArgs['showAuth'] = "N";
        newArgs['deleteUserID'] =SysStore.getCurrentUser().id;
        let data: Object = {};
        data['code'] = "DALYF022";
        data['yhid'] =  SysStore.getCurrentUser().id;
        this.getUserOption(data).then(res => {
            if (res.message) {
                if (res != "Y") {
                    //不启用,可以可以查看并删除其他用户的数据
                    newArgs['showAuth'] = "Y";

                }
            }
        });

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

    saveByKey(key, data) {
        return super.save(data);
    }

    updateForTable(data) {
        return super.update(data)
    }

    deleteForTable(data) {

        return super.del(data);
    }




    getUserOption(params) {
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

    //删除所选
    recycleRemove(params) {
        debugger;
        return new Promise((resolve, reject) => {
            return super
              .postForm({url:`/api/eps/control/main/dagl/delete`, params }).then(res => {
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

    //还原所选
    recycleRestore(params) {
        debugger;
        return new Promise((resolve, reject) => {
            return super
            .postForm({url:`/api/eps/control/main/dagl/restoreData`, params }).then(res => {
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

    //还原所有
    recycleAllRestore(params) {
        return new Promise((resolve, reject) => {
            return super
            .postForm({url:`/api/eps/control/main/dagl/restoreAllData`, params }).then(res => {
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


    //删除所有
    recycleAllRemove(params) {
        return new Promise((resolve, reject) => {
            return super
            .postForm({url:`/api/eps/control/main/dagl/cleanHsz`, params }).then(res => {
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

export default new RecycleBinService('/api/eps/control/main/dagl');
