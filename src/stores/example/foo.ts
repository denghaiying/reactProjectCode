import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';

class Foo extends BaseService implements IEpsStore {
  constructor(url) {
    super(url);
    this.baseUrl = url;
  }
  page(): Function {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<any> {
    return super.findAll({});
  }
  findById(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  list: any[];
  currentPage: Number;
  pageSize: Number;
  params: JSON;
  tableLoading: Boolean;
}

export default new Foo('/api/eps/control/main/orglx');
