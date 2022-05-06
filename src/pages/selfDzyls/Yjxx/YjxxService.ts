import BaseService from '@/eps/commons/v2/BaseService';
import fetch from '../../utils/fetch';
import moment from 'moment';
import { message } from 'antd';

class YjxxService extends BaseService {
  saveByKey(data) {

    return new Promise((resolve, reject) => {
    if (!data) {
      return reject('请检查待保存数据，不能为空')
    }
    
    data['tjsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return super.post({ url: this.url, data: data}).then(res => {
      debugger
     if (res.status === 201) {
        return resolve(res.data);
      }
      return reject(res.data.message)
    }).catch(err => {
      return reject(err);
    })
  })
}
}

export default new YjxxService('/api/streamingapi/opinion');
