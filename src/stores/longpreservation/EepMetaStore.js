import { observable, action } from "mobx";
import moment from "moment";
import BaseStore from "../BaseStore";
import EepMetaService from '../../services/longpreservation/EepMetaService';
import fetch from "../../utils/fetch";

class EepMetaStore extends BaseStore {
  @observable jndata = [];
  @observable jnloading = false;
  @observable flag = false;

  @action async findAll (params) {
    this.loading = true;
    this.params = params;
    try {
      this.data = await EepMetaService.findByEepInfo(this.params);
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

  @action async findAllJn (params) {
    this.jnloading = true;
    this.params = params;
    try {
      this.jndata = await EepMetaService.findByEepInfoJN(this.params);
      this.jnloading = false;
    } catch (err) {
      this.jnloading = false;
      throw err;
    }
  }

  /*
  @action setSelectRowsJN = async (selectRowKeys, selectRowRecords) => {
    this.selectRowKeysJN = selectRowKeys;
    this.selectRowRecordsJN = selectRowRecords;
  }
  */


}

export default new EepMetaStore("/api/eepinfo",true,false);
