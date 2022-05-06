import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';
import React from 'react';
import SysStore from '../system/SysStore';


class LydjdttjStore extends BaseStore {
    @observable isExpand = true;
    @observable dw  = SysStore.currentUser.dwid;
    @observable dakid = "";
    @observable xslx = "tjlb";
    @observable djr = "";
    @observable daklx = "";
    @observable rq = [];
    @observable tjxs = "";
    @observable tmzt = "";


    @action setDw = (dw) => {
        this.dw = dw;
    }

    @action setDakid = (dakid) => {
        this.dakid = dakid;
    }

    @action setXslx = (xslx) => {
        this.xslx = xslx;
    }

    @action setDjr = (djr) => {
        this.djr = djr;
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

    @action setRq = (rq) => {
        this.rq = rq;
    }


    @action setExpand = (expend) => {
        this.expand = expend;
    };

    @action queryForPage = async () => {

        ;
        this.loading = true;
        const par=this.params;
        const xs=par["tjxs"];
        const lxxs=par["xslx"];
        const columsetslist = [];
        if(lxxs == "tjlb" ){
            if( xs && xs.length>0){
                for (var i = 0, l = xs.length; i < l; i++) {
                    var a = xs[i];
                    switch (a) {
                        case "dwsx":
                            columsetslist.push({
                                title: "单位名称",
                                dataIndex: "dw",
                                key: "dw",
                                width: 100,
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.dw - b.dw,
                            });
                            break;
                        case "daksx":
                            columsetslist.push({
                                dataIndex: "dakmc",
                                key: "dakmc",
                                width: 100,
                                title: "档案库名称",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.dakmc - b.dakmc,
                            });
                            break
                        case "daklxsx":
                            columsetslist.push({
                                dataIndex: "daklx",
                                key: "daklx",
                                width: 100,
                                title: "档案库类型",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.daklx - b.daklx,
                            });
                            break;
                        case "tmztsx":
                            columsetslist.push({
                                dataIndex: "tmzt",
                                key: "tmzt",
                                width: 100,
                                title: "档案库状态",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.tmzt - b.tmzt,
                            });
                            break;
                        case "djsjsx":
                            columsetslist.push({
                                dataIndex: "djrq",
                                key: "djrq",
                                width: 120,
                                title: "归档人",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.djrq - b.djrq,
                            });
                            break;

                        case "djrsx":
                            columsetslist.push({
                                dataIndex: "djr",
                                key: "djr",
                                width: 120,
                                title: "登记人",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.djr - b.djr,
                            });
                            break;
                    }

                }
            }
            columsetslist.push({dataIndex: "tms", width: 100, title: "条目数量",defaultSortOrder: 'descend', sorter: (a, b) => a.tms - b.tms,fixed: 'right',});
            columsetslist.push({dataIndex: "fjs", width: 100,  title: "原文数量",defaultSortOrder: 'descend', sorter: (a, b) => a.fjs - b.fjs,fixed: 'right',});
            columsetslist.push({dataIndex: "ys", width: 100, title: "页数",defaultSortOrder: 'descend', sorter: (a, b) => a.ys - b.ys,fixed: 'right',});
            this.setColumns(columsetslist);
        }
        const response = await fetch
            .post(`${this.url}/queryForxLydtdjtjist`, this.params, { params: { ...this.params } });
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

export default new LydjdttjStore('/api/eps/control/main/basetj');
