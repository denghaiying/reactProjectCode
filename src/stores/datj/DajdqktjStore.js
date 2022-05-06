import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';
import React from 'react';
import SysStore from '../system/SysStore';


class DajdqktjStore extends BaseStore {


    @observable isExpand = true;
    @observable dwid  = SysStore.currentUser.dwid;
    @observable dakid = "";
    @observable daklx = "";
    @observable jdlxid= "";
    @observable sqr= "";
    @observable xslx = "tjlb";
    @observable rq = [];

    @action setDw = (dw) => {
        this.dwid = dw;
    }

    @action setDakid = (dakid) => {
        this.dakid = dakid;
    }

    @action setXslx = (xslx) => {
        this.xslx = xslx;
    }

    @action setDaklx = (daklx) => {
        this.daklx = daklx;
    }

    @action setJdlxid = (jdlxid) => {
        this.jdlxid = jdlxid;
    }

    @action setSqr = (sqr) => {
        this.sqr = sqr;
    }

    @action setRq = (rq) => {
        this.rq = rq;
    }


    @action setExpand = (expend) => {
        this.expand = expend;
    };



    @action queryForPage = async () => {
        this.loading = true;
        const par=this.params;
        const lxxs=par["xslx"];

        const response = await fetch
            .post(`${this.url}/queryForJdtjList`, this.params, { params: { ...this.params } });
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

export default new DajdqktjStore('/api/eps/control/main/basetj');
