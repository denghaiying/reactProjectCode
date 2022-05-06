import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import React from 'react';



const mkrl="/api/eps/control/main/mk/queryForList";

class MkStore extends BaseStore {
    @observable total = 15;
    @observable visible = false;
    @observable selectid = "";
    @observable selectedRow="";
    @observable currentData=[];
    @observable agriculturalList=[];
    @observable pageNumber= parseInt(window.location.hash.slice(1), 0) || 1;

    @action setTotal = async (total) => {
        this.total = total;
    }

    @action setCurrentData = async (currentData) => {
        this.currentData = currentData;
    }

    @action setPageNumber = async (pageNumber) => {
        this.pageNumber = pageNumber;
    }

    @action setSelectId = async (selectid) => {
        this.selectid = selectid;
    }

    @action setSelectedRow = async (selectedRow) => {
        this.selectedRow = selectedRow;
    }

    @action queryForPage = async () => {

        this.loading = true;

        const response = await fetch
            .post(`${this.url}/queryForPage`, this.params, {
                params: {
                    page: this.pageno-1,
                    pagesize: this.pagesize,
                    limit: this.pagesize,
                    mkbh: this.mkbh,
                    canshow : "Y",
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
                        newKey.key = newKey.mkbh;
                        if(newKey.ty) {
                            if (newKey.ty == "Y") {
                                newKey.tymc = "停用";
                            }
                            if (newKey.ty == "N") {
                                newKey.tymc = "启用";
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

export default new MkStore('/api/eps/control/main/mk');
