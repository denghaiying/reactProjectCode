import BaseService from '@/eps/commons/v2/BaseService';

class YhlxService extends BaseService {
    constructor(props) {
        super(props);
    }

    page(): Function {
        throw new Error('Method not implemented.');
    }

    findAll (params){
        return new Promise((resolve, reject) => {
            return super.get({url: this.url + '/querySjzdmxBySjzd', params: {bh: 'YHLX001',yhlx: 'Y'}}).then(res => {
                if(res.status > 300){
                    return reject(res)
                }
                let result = res.data
                return resolve(result);
            }).catch(err => {
                return reject(err)
            })
            }
        )
    }

}

export default new YhlxService('/api/eps/control/main/sjzdmx');
