import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import fetch from '@/utils/fetch';
import util from '@/utils/util';

class YhService extends BaseService implements IEpsService, ITableService {


    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        const params = util.getSStorage("arch_param")
        const dakid = params.id
        const tmzt = 8;
        let psql="";
        args['code'] = "";
        args['name'] = "";

        args['dwid'] =  SysStore.getCurrentCmp().id;
        args['page'] = page;
        args['limit'] = size;
        args['page'] = page;
        args['limit'] = size;
        args['sortField'] = "";
        args['dakid'] = dakid;
        args['hszbz'] = 'N';
        args['tmzt'] = tmzt;
        // args["Yjd"]='Y';
        args['bmc'] = params.mbc;
        args['sortOrder'] = "";




        if (key == "") {
            var sql = "1=1 "
            if (psql) {
                psql += " and " + sql;
            } else {
                psql = sql;
            }
        } else if (key != null) {
            var fvs = key.split(";");
            var sql = "(1=1";
            for (var i = 0; i < fvs.length; i++) {
                var fv = fvs[i].split("#value#");
                sql += " and isnull(" + fv[0]
                    + ",' ')=isnull('" + fv[1] + "',' ') ";

            }
            sql += ")";
            if (psql) {
                psql += " and " + sql;
            } else {
                psql = sql;
            }
        }

        psql=window.top.EpsUtils.sqlencode(psql);
        args["psql"]=psql;

        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + '/queryForPage', params: args }).then(res => {
                console.log("00000000", res)
                if (res.status > 300) {

                    return reject(res.data)
                }
                return resolve(res.data.results || res.results)
            }).catch(err => {
                return reject(err)
            })
        }
        )

    }





    getKTable(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryKTable', params }).then(res => {
                if (res && res.status === 200) {
                    return resolve(res.data)
                }
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }


    findSource(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        args['code'] = "";
        args['name'] = "";

        args['dwid'] = key || SysStore.getCurrentCmp().id;
        args['page'] = page;
        args['limit'] = size;
        args['pageIndex'] = page;
        args['pageSize'] = size;
        args['sortField'] = "";
        args['sortOrder'] = "";


        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + '/queryForPage', params: args }).then(res => {
                console.log("00000000", res)
                if (res.status > 300) {

                    return reject(res)
                }
                return resolve(res.data || res.results)
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
        data['id'] = `${Math.random()}`
        data['inm'] = 'Y'
        data['mkbh'] = key
        return super.save(data);
    }

    updateForTable(data) {
        data['inm'] = 'Y'
        return super.update(data)
    }

    deleteForTable(data) {
        return super.delete(data);
    }

    page(params: {}): Function {
        return undefined;
    }
}

export default new YhService('/api/eps/control/main/dagl');
