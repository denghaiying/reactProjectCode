import { action, observable, runInAction } from "mobx";
import IEpsService from "../../../commons/IEpsService";


class EpsNormalTableStore {

  readonly service: IEpsService

  @observable list: Object[] = []

  constructor(service: IEpsService){
    this.service = service
  }
    
    @action
    async page(params){
        let result = await this.service.page(params);
        return result;
    }

    @action
    async findAll(params){
      let result = await this.service.findAll(params);
      runInAction(() => {
        this.list = result?.results || [];
      })
    }

    @observable
    params: JSON;

    @observable
    currentPage: Number;

    @observable
    pageSize: Number;

    @observable
    tableLoading: Boolean;

}
export default EpsNormalTableStore;