import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';
import React from 'react';
import SysStore from '../system/SysStore';





class DatjsjStore extends BaseStore {



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
                                dataIndex: "dwmc",
                                width: 100,
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.dwmc - b.dwmc,
                            });
                            break;
                        case "daksx":
                            columsetslist.push({
                                dataIndex: "dakmc",
                                width: 100,
                                title: "档案库名称",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.dakmc - b.dakmc,
                            });
                            break
                        case "ndsx":
                            columsetslist.push({
                                dataIndex: "nd",
                                width: 100,
                                title: "年度",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.nd - b.nd,
                            });
                            break;
                        case "bgqxsx":
                            columsetslist.push({
                                dataIndex: "bgqx",
                                width: 120,
                                title: "保管期限",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.bgqx - b.bgqx,
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
                        case "daklbsx":
                            columsetslist.push({
                                dataIndex: "daklb",
                                width: 100,
                                title: "档案库类别",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.daklb - b.daklb,
                            });
                            break;
                        case "tmztsx":
                            columsetslist.push({
                                dataIndex: "tmzt",
                                width: 100,
                                title: "档案库状态",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.tmzt - b.tmzt,
                            });
                            break;
                        case "gdrmcsx":
                            columsetslist.push({
                                dataIndex: "gdrmc",
                                width: 120,
                                title: "归档人",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.gdrmc - b.gdrmc,
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

        ;
        const response = await fetch
            .post(`${this.url}/queryForDacltjQueryList`, this.params, { params: { ...this.params } });
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

export default new DatjsjStore('/api/eps/control/main/basetj');
