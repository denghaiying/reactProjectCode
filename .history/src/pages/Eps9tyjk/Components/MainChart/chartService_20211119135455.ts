import BaseService from '@/eps/commons/v2/BaseService';

class ChartService extends BaseService  {
    findAll(params) {
            return new Promise((resolve, reject) => {
                return super.get({ url: this.url + '/queryYjtj', params }).then(res => {
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

    findAllSumtj(params) {
        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + '/querysumtj', params }).then(res => {
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

    findPietj(params) {
        return new Promise((resolve, reject) => {
            return super.get({ url: this.url + '/queryPietj', params }).then(res => {
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

export default new ChartService('/api/eps/control/main/gsyjjssqd');
