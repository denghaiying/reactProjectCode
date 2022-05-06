import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';
import React from 'react';
import SysStore from '../system/SysStore';





class DalytjStore extends BaseStore {
    @observable isExpand = true;
    @observable dwid  = SysStore.currentUser.dwid;
    @observable dakid = "";
    @observable xslx = "tjlb";
    @observable rq = [];
    @observable tjxs = "";
    @observable yhmc = "";


    @action setDw = (dw) => {
        this.dwid = dw;
    }

    @action setDakid = (dakid) => {
        this.dakid = dakid;
    }

    @action setXslx = (xslx) => {
        this.xslx = xslx;
    }


    @action setTjxs = (tjxs) => {
        this.tjxs = tjxs;
    }

    @action setYhmc = (yhmc) => {
        this.yhmc = yhmc;
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
        if(lxxs == "tjlb" ) {
            par["tjfs"] = "D";
            par["qkey"] = "Datj.dalytj";
            if (par["tjfs"] != "D") {
                columsetslist.push({dataIndex: "tjms", width: 100,sorter: (a, b) => a.tjms - b.tjms, title: "名称"});
            } else {
                if (xs && xs.length > 0) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        var a = xs[i];
                        switch (a) {
                            case "jylxsx":
                                columsetslist.push({
                                    title: "借阅类型",
                                    dataIndex: "jylx",
                                    key: "jylx",
                                    width: 100,
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jylx - b.jylx,
                                });
                                break;
                            case "ndsx":
                                columsetslist.push({
                                    dataIndex: "jynd",
                                    key:"jynd",
                                    width: 100,
                                    title: "年度",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jynd - b.jynd,
                                });
                                break
                            case "monthsx":
                                columsetslist.push({
                                    dataIndex: "jymonth",
                                    key:"jymonth",
                                    width: 100,
                                    title: "月份",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jymonth - b.jymonth,
                                });
                                break;
                            case "dwsx":
                                columsetslist.push({
                                    dataIndex: "dakdw",
                                    key:"dakdw",
                                    width: 120,
                                    title: "单位名称",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.dakdw - b.dakdw,
                                });
                                break;
                            case "daksx":
                                columsetslist.push({
                                    dataIndex: "tjms",
                                    width: 100,
                                    title: "档案库名称",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.tjms - b.tjms,
                                });
                                break;
                            case "jyyhsx":
                                columsetslist.push({
                                    dataIndex: "jyyhmc",
                                    width: 100,
                                    title: "借阅人",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jyyhmc - b.jyyhmc,
                                });
                                break;
                            case "czyhsx":
                                columsetslist.push({
                                    dataIndex: "czyhmc",
                                    width: 100,
                                    title: "操作员",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.czyhmc - b.czyhmc,
                                });
                                break;
                            case "daklxsx":
                                columsetslist.push({
                                    dataIndex: "daklx",
                                    width: 100,
                                    title: "档案库类型",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.daklx - b.daklx,
                                });
                                break;
                            case "tmsx":
                                columsetslist.push({dataIndex: "tm", width: 100, defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.tm - b.tm, title: "题名"});
                                break;
                            case "bgqxsx":
                                columsetslist.push({dataIndex: "bgqx", width: 100, defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.bgqx - b.bgqx,title: "保管期限"});
                                break;
                            case "lymdsx":
                                columsetslist.push({dataIndex: "lymd", width: 100, defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.lymd - b.lymd, title: "利用目的"});
                                break;
                        }

                    }
                }
                columsetslist.push({
                    dataIndex: "rc",
                    width: 100,
                    title: "利用人次",
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.rc - b.rc,
                    fixed: 'right',
                });
                columsetslist.push({
                    dataIndex: "ajc",
                    width: 100,
                    title: "利用卷次",
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.ajc - b.ajc,
                    fixed: 'right',
                });
                columsetslist.push({
                    dataIndex: "jc",
                    width: 100,
                    title: "利用件次",
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.jc - b.jc,
                    fixed: 'right',
                });
                this.setColumns(columsetslist);
            }
        }

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

export default new DalytjStore('/api/eps/control/main/basetj');
