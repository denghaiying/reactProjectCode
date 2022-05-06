import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';
import React from 'react';
import SysStore from '../system/SysStore';

 class DatjBaseStore extends BaseStore {

    @observable isExpand = true;
    @observable dw = "";
    @observable dakid = "";
    @observable xslx = "";
    @observable bgqx = "";
    @observable daklx = "";
    @observable nd = [];
    @observable tjxs = "";
    @observable tmzt = "";


    @action setDw = (dw) => {
        this.dw = dw;
    }

    @action setXslx = (xslx) => {
        this.xslx = xslx;
    }

    @action setBgqx = (bgqx) => {
        this.bgqx = bgqx;
    }

    @action setDaklx = (daklx) => {
        this.daklx = daklx;
    }

    @action setTjxs = (tjxs) => {
        this.tjxs = tjxs;
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


}



