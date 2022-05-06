import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from "@/stores/system/SysStore";

class Dagdgzcltj {

    url = "";
    wfenable = false;
    oldver = true;
    constructor(url, wfenable, oldver = true) {

        this.url = url;
        this.wfenable = wfenable;
        this.oldver = oldver;
        makeAutoObservable(this)
    }

    @observable isExpand = true;
    @observable dw = [SysStore.getCurrentUser().dwid];
    @observable dakid = "";
    @observable xslx = "tjlb";
    @observable bgqx = "";
    @observable daklx = "";
    @observable nd = [];
    @observable tjxs = ['dwsx'];
    @observable tmzt = ['3'];
    @observable daklb = "";
    @observable gdrmc = "";
    @observable data = [];
    @observable record = {};
    @observable params = {};
    @observable loading = false;
    @observable pageno = 1;
    @observable pagesize = 20;
    @observable opt = "view";
    @observable editVisible = false;
    @observable editRecord = {};
    @observable selectRowKeys = [];
    @observable selectRowRecords = [];
    @observable columns = [];
    @observable signcomment = "";
    @observable procOpt = {};
    @observable dataSource = [];

    @observable paramValue = "";

    columnameList = [];
    columnResult = [];
    yhdwData=[];

    @action setDw = (dw) => {
        this.dw = dw;
    }

    @action setDdakid = (dakid) => {
        this.dakid = dakid;
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

    @action setDaklb = (daklb) => {
        this.daklb = daklb;
    }

    @action setGdrmc = (gdrmc) => {
        this.gdrmc = gdrmc;
    }


    @action setExpand = (expend) => {
        this.expand = expend;
    };

    @action setData = (data) => {
        this.data = data;
    }


    openNotification = (a, type) => {
        Notification.open({ title: a, type });
    };

    setSigncomment = (comment) => {
        this.signcomment = comment;
    };

    setColumns = (columns) => {
        this.columns = columns;
    };

    setPageNo = async (pageno) => {
        this.pageno = pageno;
        await this.queryForPage();
    };

    setPageSize = async (pageSize) => {
        this.pagesize = pageSize;
        await this.queryForPage();
    };

    setParams = async (params, nosearch) => {
        this.params = { ...params };
        if (!nosearch) {
            await this.queryForPage();
        }
    };

    setDataSource = (dataSource) => {
        this.dataSource = dataSource;
    };

    setSelectRows = async (selectRowKeys, selectRowRecords) => {

        this.selectRowKeys = selectRowKeys;
        this.selectRowRecords = selectRowRecords;
    };

    afterQueryData(data) {
        return data;
    }
    setExcleContent = (records) => {
        this.columnResult = [];
        for (var i in records) {
            const record = records[i];
            const obj = {};
            for (var name in record) {
                if (name === 'dwmc') {
                    obj['单位'] = record['dwmc'];
                } else if (name === 'dakmc') {
                    obj['档案库'] = record['dakmc'];
                } else if (name === 'nd') {
                    obj['年度'] = record['nd'];
                } else if (name === 'bgqx') {
                    obj['保管期限'] = record['bgqx'];
                } else if (name === 'daklx') {
                    obj['档案类型'] = record['daklx'];
                } else if (name === 'daklb') {
                    obj['档案类别'] = record['daklb'];
                } else if (name === 'tmzt') {
                    obj['档案状态'] = record['tmzt'];
                }
                // else if (name === 'gdbmsx') {
                //   obj['归档部门'] = record['gdbm'];
                // } 
                else if (name === 'gdrmc') {
                    obj['归档人'] = record['gdrmc'];
                } else if (name === 'gdny') {
                    obj['归档年月'] = record['gdny'];
                } else if (name === 'tms') {
                    obj['条目数量'] = record['tms'];
                } else if (name === 'fjs') {
                    obj['原文数量'] = record['fjs'];
                } else if (name === 'ys') {
                    obj['页数'] = record['ys'];
                } else if (name === 'ywdx') {
                    obj['原文大小（G）'] = record['ywdx'];
                }
            }
            this.columnResult.push(obj);

        }
        console.log('columsetslist=====', this.columnResult);
    }
    setExcleHeader = () => {
        this.columnameList = [];
        if (this.tjxs.length > 0) {
            for (var i in this.tjxs) {
                s: switch (this.tjxs[i]) {
                    case 'dwsx':
                        this.columnameList.push('单位');
                        break s;
                    case 'daklbsx':
                        this.columnameList.push('档案类别');
                        break s;
                    case 'daksx':
                        this.columnameList.push('档案库');
                        break s;
                    case 'daklxsx':
                        this.columnameList.push('档案类型');
                        break s;
                    case 'tmztsx':
                        this.columnameList.push('档案状态');
                        break s;
                    case 'ndsx':
                        this.columnameList.push('年度');
                        break s;
                    case 'bgqxsx':
                        this.columnameList.push('保管期限');
                        break s;
                    case 'gdbmsx':
                        this.columnameList.push('归档部门');
                        break s;
                    case 'gdrmcsx':
                        this.columnameList.push('归档人');
                        break s;
                    case 'gdnysx':
                        this.columnameList.push('归档年月');
                        break s;
                }
            }

        }
        this.columnameList.push('条目数量');
        this.columnameList.push('原文数量');
        this.columnameList.push('页数');
        this.columnameList.push('原文大小（G）');
    }


    searchGdtjResult = async (values) => {
        this.params = { ...values };
        const response = await fetch.post(`${this.url}/queryForNewGdtjQueryList`, this.params );
        return response;
    }
}

export default new Dagdgzcltj('/api/eps/control/main/basetj');
