import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ISelectService } from '@/eps/commons/panel';

class SelectService extends BaseService implements IEpsService, ISelectService {

    findByKey(key: string, args: object = {}): Promise<any> {

        console.log("key++++++++",key)
        if (key && Array.isArray(key)) {
            var dwid = JSON.stringify(key)
        } else {
            var dwid = JSON.stringify([key])
        }
        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + `/queryDwRoles?dwids=${dwid}`, params: args }).then(res => {
                if (res.status > 300) {
                    reject(res)
                }

                    return resolve(res.data && res.data.map(item => {
                        return { 'key': item.id, 'id': item.id, 'label': item.rolename, 'value': item.id, ...item }
                    }))

            }).catch(err => {
                return reject(err)
            })
        }

        )
    }

}

export default new SelectService('/api/eps/control/main/role');
