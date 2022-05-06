import BaseService from '@/eps/commons/v2/BaseService';
import SysStore from "@/stores/system/SysStore";
import IEpsService from "@/eps/commons/IEpsService";
import {ITableService} from "@/eps/commons/panel";
import {showMessage} from "@/eps/components/message";

class KpService extends BaseService implements IEpsService, ITableService{
    constructor(props) {
        super(props);
    }

    page(): Function {
        throw new Error('Method not implemented.');
    }

    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        args['pageIndex'] = page;
        args['pageSize'] = size;
        args['page'] = page;
        args['limit'] = size;
        args['sortOrder'] = "";
        args['sortField'] = "";
    //    args['status'] = "1";
    args['first'] ='first';

    debugger

        return new Promise((resolve, reject) => {
                return super.get({ url: this.url + '/queryAllTree_e9', params: args }).then(res => {

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
                return super.post({ url: this.url + '/queryAllTree_e9', params }).then(res => {
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
      // if(data.spzt !=='1') {
      //
      //   return showMessage('已经审核的记录无法删除！', 'info');
      // }
      return super.del(data);
    }
}

export default new KpService('/api/eps/control/main/fzsp');
