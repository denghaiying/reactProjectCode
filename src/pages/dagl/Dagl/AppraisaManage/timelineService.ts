import BaseService from '@/eps/commons/v2/BaseService';

class YhService extends BaseService  {
    findAll(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryYhDakopts', params }).then(res => {
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

export default new YhService('/api/eps/control/main/dakqx');
