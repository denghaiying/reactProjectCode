import HttpRequest from './HttpRequest'
import { Message } from '@alifd/next';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';

class BaseService extends HttpRequest {
  url: string

  constructor(url: string) {
    super('')
    this.url = url
  }
  findAll(params) {
    return super.get({
      url: `${this.url}/`,
      params: params
    })
  }
  findById(id) {
    return super.get({
      url: `${this.url}/${id}`
    })
  }
  update(data) {
    if (!(data && data.id)) {
      Message.error('请正确输入待修改数据');
      return
    }
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whrid'] = SysStore.getCurrentUser().id;
    data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return super.put({
      url: `${this.url}/${data.id}`,
      data
    })
  }
  save(data) {
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whrid'] = SysStore.getCurrentUser().id;
    data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return super.post({
      url: `${this.url}/`,
      data
    })
  }
  del(data) {
    if (!data || !(data.id)) {
      Message.error('请正确输入待删除数据');
      return
    }
    return super.delete({
      url: `${this.url}/${data.id}`
    })
  }
  deleteData(data) {
    if (!data || !(data.id)) {
      Message.error('请正确输入待删除数据')
    }
    return super.delete({
      url: `${this.url}/`,
      data
    })
  }

}
export default BaseService
