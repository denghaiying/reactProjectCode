import BaseService from '@/eps/commons/v2/BaseService';
import moment from 'moment';
import { ITableService } from "@/eps/commons/panel";


class EpsReportService extends BaseService implements ITableService {

    page(): Function {
        throw new Error('Method not implemented.');
    }

    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
   //     args['ipaddresses'] = key;
        args['page'] = page;
        args['limit'] = size;
        args['pageIndex'] = page;
        args['pageSize'] = size;
        args['sortField'] = "";
        args['sortOrder'] = "";
        args['umid'] = key;
        return new Promise((resolve, reject) => {
                return super.get({ url: this.url + '/queryForPageEps9', params: args }).then(res => {
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

        data['whsj']=moment().format('YYYY-MM-DD HH:mm:ss');
        if(key) {
            data['umid'] = key;
            data['gnid'] = key;
        }else {
            data['umid'] = data.gnid;
            data['gnid'] = data.gnid;
        }

        return super.save(data);
    }

    updateForTable(data) {
        data['whsj']=moment().format('YYYY-MM-DD HH:mm:ss');

        return super.update(data)
    }

    deleteForTable(data) {

        return super.del(data);
    }

    //左边单位树
    findTree(key: string = '') {
        let params = { 'mc': key }
        let address = "/api/eps/control/main/epsreport"
        return new Promise((resolve, reject) => {
                return super.get({ url: address + `/queryForPage?umid=CONTROL0003` }).then(res => {
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

}

export default new EpsReportService('/api/eps/control/main/epsreport');
