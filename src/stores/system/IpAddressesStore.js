import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import SysStore from '../system/SysStore';
import fetch from '../../utils/fetch';
import React from 'react';

const mkrl="/api/eps/control/main/ipAddresses";

class IpAddressesStore extends BaseStore {

    /**
     * 获取当前用户名称
     */
    @observable yhmc = SysStore.getCurrentUser().yhmc

    /**
     * 获取当前用户ID
     */
    @observable yhid = SysStore.getCurrentUser().id
       /**
     * 获取当前时间
     */
    @observable getDate = moment().format('YYYY-MM-DD HH:mm:ss');

    @observable total = 15;
    @observable visible = false;
    @observable selectid = "";
    @observable selectedRow="";
    @observable currentData=[];
    @observable agriculturalList=[];
    @observable pageNumber= parseInt(window.location.hash.slice(1), 0) || 1;



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
                    ...this.params,
                },
            });
        if (response && response.status === 200) {
            runInAction(() => {
                this.total = response.data.total;
                //    this.data = this.afterQueryData(response.data.results);
                let totals = response.data.total;
                var sjData = [];
                this.data = response.data.results;
                this.loading = false;
            });
        }
        else {
            this.loading = true;
        }

    }

}

export default new IpAddressesStore('/api/eps/control/main/ipAddresses');
