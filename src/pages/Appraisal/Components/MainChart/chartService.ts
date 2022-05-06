import BaseService from '@/eps/commons/v2/BaseService';

class ChartService extends BaseService  {
    findAll(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryChart', params }).then(res => {
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

    findGroupYear(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryGroupYear', params }).then(res => {
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

export default new ChartService('/api/eps/control/main/xhjdsp');
