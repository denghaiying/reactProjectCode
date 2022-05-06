import { observable, action, runInAction,makeObservable } from "mobx";
import moment from "moment";
import BaseStore from "../BaseStore";
import ArchiveTableService from "../../services/etl/ArchiveTableService";
import fetch from "../../utils/fetch";

class ArchiveTableStore extends BaseStore {
  @observable dataSourceMetadata = [];

  
  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this);
}
   queryForPage = async (params) => {
    this.params = params;
    this.loading = true;
    const response = await fetch.post(this.url, this.params, {
      params: { pageno: this.pageno, pagesize: this.pagesize },
    });
    if (response && response.status === 200) {
      runInAction( () => {
        this.data = this.afterQueryData(response.data);
        this.loading = false;
      });
    } else {
      this.loading = true;
    }
  };

  @action findMetadata = async () => {
    this.loading = false;
    this.dataSourceMetadata = await ArchiveTableService.findMetadata();
    this.loading = true;
  };
}

export default new ArchiveTableStore("/api/archivecolumn",false,false);
