import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import React from 'react';
import SysStore from "@/stores/system/SysStore";

const lefturl="/api/eps/control/main/orgmodel/queryOrgmodelResults";
const righturl="/api/eps/control/main/orgmodel/queryWanForList" ;

class OrgModelStore extends BaseStore {
    @observable targetKeys = [];
    @observable leftKeys = [];
    @observable selectid = "";
    @observable selectedRow="";
    @observable currentData=[];
    @observable agriculturalList=[];


    @action setCurrentData = async (currentData) => {
        this.currentData = currentData;
    }


    @action setSelectId = async (selectid) => {
        this.selectid = selectid;
    }

    @action setSelectedRow = async (selectedRow) => {
        this.selectedRow = selectedRow;
    }

    @action queryTargetKeys= async () => {

        this.loading = true;
        const url=righturl;
        const response = await fetch
            .post(url);
        if (response && response.status === 200) {

            /*this.targetKeys=response.data.map(o=>({'id':o.bh,'label':o.mc,'value':o.bh}));
            this.loading = false;*/
                ;
                this.targetKeys = response.data.map(o=>({'omid':o.omid,'omname':o.omname,'key':o.omid}));
                ;
                console.log("targt:"+this.targetKeys);
                this.loading = false;

        } else {
            this.loading = true;
        }
    }




    @action queryLeftKeys = async () => {

        this.loading = true;
        const url=lefturl;
        const response = await fetch
            .post(url);
        if (response && response.status === 200) {
            ;
                const r1=response.data;
                const r2=response.data.results;
                this.leftKeys = response.data.results;
            console.log("leftKeys:"+this.leftKeys);
            ;
                this.loading = false;

        } else {
            this.loading = true;
        }

    }

}

export default new OrgModelStore('/api/eps/control/main/orgmodel');
