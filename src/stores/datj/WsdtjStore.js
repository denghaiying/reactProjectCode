import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';
import React from 'react';





class WsdtjStore extends BaseStore {

    url="";
    wfenable=false;
    oldver=true;
    constructor(url, wfenable, oldver = true) {
      this.url = url;
      this.wfenable = wfenable;
      this.oldver = oldver;
      makeObservable(this);
    }

    @action queryForPage = async () => {


        this.loading = true;

        const par=this.params;
        const lxxs=par["xslx"];

        this.params["qkey"] = "Datj.wsdtj";

        const response = await fetch
            .post(`${this.url}/queryForList`, this.params, { params: { ...this.params } });
        if (response && response.status === 200) {
        //    runInAction(() => {
                this.data = this.afterQueryData(response.data);
                this.loading = false;
    //        });
        }
        else {
            this.loading = true;
        }

    }


}

export default new WsdtjStore('/api/eps/control/main/basetj');
