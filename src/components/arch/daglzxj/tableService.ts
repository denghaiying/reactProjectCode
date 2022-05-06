import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import {ITableService} from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import {sqldecode, sqlencode} from '@/utils/EpsUtils';
import qs from 'qs';

const getCondetion=(args)=>{
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

class TableService extends BaseService implements IEpsService, ITableService {

/**
 *
[{"nm":"qzmc","vl":"11","exAttr01":"07","exAttr02":"QZMC","exAttr03":"C"},{"nm":"nd","vl":"22","exAttr01":"01","exAttr02":"ND","exAttr03":"C"}]
 */
    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        if(!args.bmc){
            return;
        }
        const bmc=args.bmc;
        const tmzt=args.tmzt;
        let psql=args.psql;
        args['code'] = "";
        args['name'] = "";
        let con=[];
        for(const i in args){
            if(i != "key" && args[i]){
                // todo 需要方法区分出高级查询的检索
                if( i.toUpperCase()=== i){
                //todo args需要支持日期，数字，范围等高级检索的情况，key和initparams还是需要区分开来
                    con.push(`{"nm":"${i}",vl:${args[i]},"exAttr01":"07","exAttr02":"${i}","exAttr03":"C"}`);
                }
            }

        }
        args["con"]="["+con.toString()+"]";
        args['dwid'] =  SysStore.getCurrentCmp().id;
        args['page'] = page;
        args['limit'] = size;
        args['page'] = page;
        args['limit'] = size;
        args['sortField'] = "";
        args['hszbz'] = 'N';
        args['tmzt'] = tmzt;
        // args["Yjd"]='Y';
        args['sortOrder'] = "";
        if(psql && psql.indexOf("$S$")>=0){
            psql=sqldecode(psql)
        }
        if (key == "" && !psql) {
            var sql = "1=1 "
            if (psql) {
                psql += " and " + sql;
            } else {
                psql = sql;
            }
        } else if (key && !psql) {
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
        if(key === 'root'){
            psql = '((1=1))'
        }

        psql=sqlencode(psql);
        args["psql"]=psql;

        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryForPage?'+qs.stringify(args) }).then(res => {
                if (res.status > 300) {
                    return reject(res.data)
                }
                res.data.data=res.data.results;
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

    queryKTable(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryKTable', params }).then(res => {
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

    getKField(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryKFields', params }).then(res => {
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

   getSjqxSql(params) {
       return new Promise((resolve, reject) => {
        return super.post({ url: '/eps/control/main/sjqxvalue/getSjqxSql', params }).then(res => {
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

      getSearchColumns(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url:  '/api/eps/control/main/mbcx/queryForList', params }).then(res => {
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

    getGuid() {
        return new Promise((resolve, reject) => {
            return super.post({ url:  '/api/eps/wdgl/attachdoc/getGuid'}).then(res => {
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
    getDoctype() {
        return new Promise((resolve, reject) => {
            return super.post({ url:  '/api/eps/wdgl/doctype/queryForList'}).then(res => {
                if (res.status > 300) {
                    return reject(res)
                }
                res.data?.map(o => (o.value=o.id,o.id=o.id,o.label=o.name));
                return resolve(res.data);
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }

    cqbcDataRecovery(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url:  '/api/eps/control/main/dacqbc/cqbcDataRecovery', params }).then(res => {
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


}

export default new TableService('/api/eps/control/main/dagl');
