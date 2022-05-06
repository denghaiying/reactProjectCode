import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';
import React from 'react';
import SysStore from '../system/SysStore';


class GzltjStore extends BaseStore {
    @observable isExpand = true;
    @observable dw  = SysStore.currentUser.dwid;
    @observable dakid = "";
    @observable xslx = "tjlb";
    @observable rq = [];
    @observable cjr = "";
    @observable nd = "";
    @observable daklx = "";
    @observable daklb = "";
    @observable tmzt = "";
    @observable bgqx = "";

    @action setDw = (dw) => {
        this.dw = dw;
    }

    @action setDakid = (dakid) => {
        this.dakid = dakid;
    }

    @action setXslx = (xslx) => {
        this.xslx = xslx;
    }


    @action setCjr = (cjr) => {
        this.cjr = cjr;
    }

    @action setRq = (rq) => {
        this.rq = rq;
    }

    @action setBgqx = (bgqx) => {
        this.bgqx = bgqx;
    }

    @action setDaklx = (daklx) => {
        this.daklx = daklx;
    }

    @action setDaklb = (daklb) => {
        this.daklb = daklb;
    }


    @action setTmzt = (tmzt) => {
        this.tmzt = tmzt;
    }

    @action setNd = (nd) => {
        this.nd = nd;
    }

    @action setExpand = (expend) => {
        this.expand = expend;
    };



    @action queryForPage = async () => {
        this.loading = true;
        const par=this.params;
        const lxxs=par["xslx"];

        const response = await fetch
            .post(`${this.url}/queryForDagzltjQueryList`, this.params, { params: { ...this.params } });
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

export default new GzltjStore('/api/eps/control/main/basetj');
