import BaseService from '@/eps/commons/v2/BaseService';

class TimeLineService extends BaseService  {
    findAll(params:any) {
        return new Promise((resolve, reject) => {
            return super.post({ url:  `${this.url}/queryForList`, params }).then(res => {
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

export default new TimeLineService('/api/eps/control/main/kfjdlog');
