import BaseService from '@/eps/commons/v2/BaseService';

class ChartService extends BaseService  {
    findAll(params) {
            return new Promise((resolve, reject) => {
                return super.get({ url: this.url + '/sxjctj', params }).then(res => {
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

    findAllSxtj(params) {
            return new Promise((resolve, reject) => {
                return super.get({ url: this.url + '/sxjcsxtj', params }).then(res => {
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

export default new ChartService('/api/api/sxjcjgz');
