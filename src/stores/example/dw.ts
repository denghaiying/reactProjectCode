import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';

class DwService extends BaseService implements IEpsStore {

    page(): Function {
        throw new Error('Method not implemented.');
    }

    findAll(params: any){
        return super.get({url: this.url + '/queryForListInOwner' ,params})
    }

    list: any[];
    currentPage: Number;
    pageSize: Number;
    params: JSON;
    tableLoading: Boolean;

}

export default new DwService('/api/eps/control/main/dw/');
