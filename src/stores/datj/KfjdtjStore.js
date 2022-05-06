import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';
import React from 'react';
import SysStore from '../system/SysStore';
import DwStore from '@/stores/system/DwStore';

class KfjdtjStore extends BaseStore {
    @observable isExpand = true;
    @observable dws = SysStore.currentUser.dwid;
    @observable searchField = "";
    @observable beginDate = "";
    @observable endDate = "";
    @observable nd = "";
    @observable bgqx = "";
    @observable tm = "";

    @observable KfjdtjData = ""



    @action setDws = (dws) => {
        this.dws = dws;
    }

    @action setBeginDate = (beginDate) => {
        this.beginDate = beginDate;
    }

    @action setEndDate = (endDate) => {
        this.endDate = endDate;
    }

    @action setBgqx = (bgqx) => {
        this.bgqx = bgqx;
    }

    @action setNd = (nd) => {
        this.nd = nd;
    }

    @action setTm = (tm) => {
        this.tm = tm;
    }
    @action setTjxs = (tjxs) => {

        this.searchField = tjxs;

    }

    @action setExpand = (expend) => {
        this.expand = expend;
    };

    @action setPar = (params, nosearch) => {
        this.params = { ...params };
        if (!nosearch) {
            this.queryForPage();
        }
    }



     queryForPage = async () => {
        this.loading = true;

        console.log("this.tjxs", this.searchField);
        const columsetslist =[];
        if (this.searchField && this.searchField.length > 0) {
            for (var i = 0; i < this.searchField.length; i++) {
                var a = this.searchField[i];
                switch (a) {
                    case "dw":
                        columsetslist.push({
                            title: "单位名称",
                            dataIndex: "dwid",
                            width: 200,
                            defaultSortOrder: 'descend',
                            sorter: (a, b) => a.dwid - b.dwid,
                            render: (text) => {
                                for (var i = 0; i < DwStore.dwList.length; i++) {
                                    var dw = DwStore.dwList[i];
                                    if (dw.id === text) {
                                        return dw.mc;
                                    }
                                }
                            }
                        });
                        break;
                    case "dak":
                        columsetslist.push({
                            dataIndex: "dakmc",
                            width: 150,
                            title: "档案库名称",
                            defaultSortOrder: 'descend',
                            sorter: (a, b) => a.dakmc - b.dakmc,
                        });
                        break

                    case "bgqx":
                        columsetslist.push({
                            dataIndex: "bgqx",
                            width: 80,
                            title: "保管期限",
                            defaultSortOrder: 'descend',
                            sorter: (a, b) => a.bgqx - b.bgqx,
                        });
                        break;
                }

            }

        }
        columsetslist.push({ dataIndex: "nd", width: 80, title: "档案年度", defaultSortOrder: 'descend', sorter: (a, b) => a.nd - b.nd, fixed: 'right', });
        columsetslist.push({ dataIndex: "kfsl", width: 80, title: "开放数量", defaultSortOrder: 'descend', sorter: (a, b) => a.kfsl - b.kfsl, fixed: 'right', });
        columsetslist.push({ dataIndex: "bkfsl", width: 80, title: "未开放数量", defaultSortOrder: 'descend', sorter: (a, b) => a.bkfsl - b.bkfsl, fixed: 'right', });
        this.setColumns(columsetslist);
        const response = await fetch.post(`${this.url}/queryForKfjdtj?dws=${this.dws}&searchField=${this.searchField}&beginDate=${this.beginDate}&endDate=${this.endDate}&bgqx=${this.bgqx}&nd=${this.nd}&tm=${this.tm}`);
        if (response && response.status === 200) {
            runInAction('查询', () => {
                this.data = this.afterQueryData(response.data);
                this.loading = false;
            });
        }
        else {
            this.loading = true;
        }

    }


}

export default new KfjdtjStore('/api/eps/control/main/kfjd');
