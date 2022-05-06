import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';
import React from 'react';





class KfaqtjStore extends BaseStore {

    @action queryForPage = async () => {

        ;
        this.loading = true;

        const par=this.params;
        const lxxs=par["xslx"];

        this.params["qkey"] = "Datj.kfaqtj";

        ;
        const response = await fetch
            .post(`${this.url}/queryForList`, this.params, { params: { ...this.params } });
        if (response && response.status === 200) {
            runInAction(() => {
                this.data = this.afterQueryData(response.data);
                this.loading = false;
            });
        }
        else {
            this.loading = true;
        }

    }


}

export default new KfaqtjStore('/api/eps/control/main/basetj');
