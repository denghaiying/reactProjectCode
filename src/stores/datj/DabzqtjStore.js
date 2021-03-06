import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';
import React from 'react';
import SysStore from '../system/SysStore';





class DabzqtjStore extends BaseStore {
    @observable isExpand = true;
    @observable dw  = SysStore.currentUser.dwid;
    @observable dakid = "";
    @observable tjxs = "";
    @observable nd = [];
    @observable tmzt = "";

    @action setDw = (dw) => {
        this.dw = dw;
    }

    @action setDdakid = (dakid) => {
        this.dakid = dakid;
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



    @action queryForPage = async () => {

        this.loading = true;

        const par=this.params;
        const xs=par["tjxs"];
        const columsetslist = [];
            if( xs && xs.length>0){
                for (var i = 0, l = xs.length; i < l; i++) {
                    var a = xs[i];
                    switch (a) {
                        case "dwsx":
                            columsetslist.push({
                                title: "单位名称",
                                dataIndex: "dwmc",
                                width: 100,
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.dwmc - b.dwmc,
                            });
                            break;
                        case "ndsx":
                            columsetslist.push({
                                dataIndex: "nd",
                                width: 100,
                                title: "年度",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.nd - b.nd,
                            });
                            break;
                    }

                }
            }
            const list = await fetch
                .post(`${this.url}/queryDakBGQXmap`, this.params, { params: { ...this.params } });

            const dakData = await fetch
                .post(`${this.url}/queryForDakList`, this.params, { params: { ...this.params } });



;

            let columsdakli=[];
            let columsli=[];

            let colMapList=[];

            for(let j = 0, m = dakData.length; j < m; j++){
                let dakls = dakData[j];
                let colMap;
                colMap.put("title",dakls.mc);
                colMap.put("dataIndex",dakls.id);
                colMap.put("key",dakls.id);


                let bcqxMapList=[];
                let bgqxlist=  await fetch
                    .post(`${this.url}/queryDAkBGQX`, this.params, { params: { mbid:dakls.mbid,dakid:dakls.id,bmc:dakls.mbc,...this.params } });
                for (let b = 0,u = bgqxlist.length; b < u; b++) {
                    let led = bgqxlist[b];
                    let aaaa;
                    let bcqxMap;
                    if(led.mc){
                        aaaa=dakls.id+"_"+led.mc;
                    }else{
                        aaaa=dakls.id+"_BGQXnull"
                    }
                    let flhfileid;
                    for (let n in list) {
                        let  alist=list[n];
                        if(alist.hasOwnProperty(aaaa)){
                            flhfileid= alist[aaaa]
                        }
                    }

                    bcqxMap.put("title",flhfileid);
                    bcqxMap.put("dataIndex",lhfileid);
                    bcqxMap.put("key",flhfileid);
                    bcqxMap.put("width","100");

                    let map;
                    let map1;
                    let maplist=[];
                    map.put("title","条目");
                    map.put("dataIndex",flhfileid+"tms");
                    map.put("key",flhfileid+"tms");

                    if( xs && xs.length>0) {
                        for (var i = 0, l = xs.length; i < l; i++) {
                            var a = xs[i];
                            switch (a) {
                                case "yssx":
                                    map1.put("title","页数");
                                    map1.put("dataIndex",flhfileid+"ys");
                                    map1.put("key",flhfileid+"ys");
                                    maplist.push(map1);
                            }


                        }
                    }

                    maplist.push(map);

                    bcqxMap.put("children",maplist);

                    bcqxMapList.push(bcqxMap);
                }

                colMap.push("children",bcqxMapList);
                columsetslist.push(colMap);

            }
            this.setColumns(columsetslist);


        ;
        const response = await fetch
            .post(`${this.url}/queryForBgqtjList`, this.params, { params: { ...this.params } });
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

export default new DabzqtjStore('/api/eps/control/main/basetj');
