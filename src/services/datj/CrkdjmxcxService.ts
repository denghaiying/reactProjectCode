import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import CrktjmxStore from '@/stores/datj/CrktjmxStore';

class CrkdjmxcxService extends BaseService implements ITableService {
    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

        return new Promise((resolve, reject) => {
            return super.get({ url: this.url, params: args }).then(res => {
                if (!res.data.success) {
                    return reject(res.data.message)
                }
                CrktjmxStore.tableData = res.data.results
                return resolve(res.data.results)
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



}


export default CrkdjmxcxService;
