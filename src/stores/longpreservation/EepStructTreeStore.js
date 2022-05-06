import { observable, action, runInAction } from "mobx";
import moment from "moment";
import BaseStore from "../BaseStore";

import EepStructTreeService from '../../services/longpreservation/EepStructTree';

import fetch from "../../utils/fetch";

class EepStructTreeStore extends BaseStore {
 
  @action async findAll (params) {
    this.loading = true;
    this.params = params;
    try {
      this.data = await EepStructTreeService.findEepTree(this.params);
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

  

}

export default new EepStructTreeStore("/eepinfo",true,false);
