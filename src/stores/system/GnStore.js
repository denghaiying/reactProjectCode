import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import React from 'react';



const mkrl="/api/eps/control/main/mk/queryForList";

class GnStore extends BaseStore {
    @observable mkDataSource = [];
    @observable mkbh = "";
    @observable total = "";
    @observable visible = false;
    @observable selectid = "";
    @observable selectedRow="";


    @action setMkbh = async (mkbh) => {
        this.mkbh = mkbh;
    }

    @action setSelectId = async (selectid) => {
        this.selectid = selectid;
    }

    @action setSelectedRow = async (selectedRow) => {
        this.selectedRow = selectedRow;
    }

    @action queryMkTree = async () => {

        this.loading = true;

        const url=mkrl;
        const response = await fetch
            .post(url);
        if (response && response.status === 200) {
            this.mkDataSource=response.data.map(o=>({'id':o.mkbh,'title':o.mc,'key':o.mkbh}));
        } else {
            this.loading = true;
        }
    }

    @action queryForPage = async () => {

        this.loading = true;

        const response = await fetch
            .post(`${this.url}/queryForPage`, this.params, {
                params: {
                    pageIndex: this.pageno,
                    pageSize: this.pagesize,
                    limit: this.pagesize,
                    mkbh: this.mkbh,
                    ...this.params,
                },
            });
        if (response && response.status === 200) {
            runInAction(() => {
                this.total = response.data.total;
            //    this.data = this.afterQueryData(response.data.results);
                let totals = response.data.total;
                var sjData = [];
                if (totals > 0) {
                    for (var i = 0; i < response.data.results.length; i++) {
                        var newKey = {};
                        newKey = response.data.results[i];
                        newKey.key = newKey.id;
                        if(newKey.lx){
                            if(newKey.lx=="F"){
                                    newKey.lxname = "业务功能";
                            }
                            if(newKey.lx=="I"){
                                    newKey.lxname = "信息功能";
                            }
                            if(newKey.lx=="U"){
                                    newKey.lxname = "网址";
                            }
                            if(newKey.lx=="K"){
                                    newKey.lxname = "档案库";
                            }
                            if(newKey.lx=="G"){
                                    newKey.lxname = "GTK自定义";
                            }
                        }
                        sjData.push(newKey);
                    }
                }
                this.data = sjData;
                this.loading = false;
            });
        }
        else {
            this.loading = true;
        }

    }

}

export default new GnStore('/api/eps/control/main/gn');
