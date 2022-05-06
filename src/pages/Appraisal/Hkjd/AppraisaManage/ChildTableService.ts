import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import fetch from '@/utils/fetch';
import util from '@/utils/util';
const umid = "hkjd";

const getCondetion = (args) => {
    var re = this.conditionFields.map(function (field) {
        //var resultValue = this.getSubmitStoreValue();
        return {
            nm: field.name,
            vl: formValues[field.name],
            exAttr01: field.exAttr01,
            exAttr02: field.exAttr02,
            exAttr03: field.exAttr03
        };
    }).filter(function (o) {
        return o.vl != "";
    });
    return re;
}

class ChildTableService extends BaseService implements IEpsService, ITableService {

    /**
     *
    [{"nm":"qzmc","vl":"11","exAttr01":"07","exAttr02":"QZMC","exAttr03":"C"},{"nm":"nd","vl":"22","exAttr01":"01","exAttr02":"ND","exAttr03":"C"}]
     */

    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

        const params = util.getSStorage(`arch_param_${umid}_jn`)
        if (!params || !key.fid) {
            return new Promise((resolve, reject) => {
                return resolve([])

            }
            );
        }
        const dakid = params.id
        const tmzt = 3;
        if (!key) {
            key = `${params.mbc}_HKJD#value#`;
        }

        let psql = "";
        args['code'] = "";
        args['name'] = "";
        let con = [];
        /**
         * {
                 bmc: 'DAKQ1030001A',
                 dwid: 'DW201408191440170001',
                 dakid: 'DAK201907261356280061',
                 tmzt: 3,
                 dayh: 'YH201904132026100005',
                 hszbz: 'N',
                 tmid: 'detailGrid',
                 pageSize: '100',
                 psql: '((1=1))',

                 pageIndex: 0,
                 fid: 'DA202005061657410335',
                 mbid: 'MB201907261105370023',

                 page: '0',
                 limit: '100'}
         */
        args["con"] = "[" + con.toString() + "]";
        args['dwid'] = SysStore.getCurrentCmp().id;
        args['page'] = page;
        args['limit'] = size;
        args['page'] = page;
        args['limit'] = size;
        args['sortField'] = "";
        args['dakid'] = dakid;
        args['hszbz'] = 'N';
        args['tmzt'] = tmzt;
        args['psql'] = "1=1"
        // args["Yjd"]='Y';
        args['bmc'] = params.bmc;
        args['sortOrder'] = "";
        if (key.fid) {
            args['fid'] = key.fid;
        }

        // psql=window.top.EpsUtils.sqlencode(psql);
        //args["psql"]=psql;

        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + '/queryForPage', params: args }).then(res => {
                console.log("00000000", res)
                if (res.status > 300) {
                    return reject(res.data)
                }
                res.data.data = res.data.results;
                return resolve(res.data)
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

export default new ChildTableService('/api/eps/control/main/dagl');
