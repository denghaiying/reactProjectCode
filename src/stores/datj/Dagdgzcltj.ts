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
                    obj['??????'] = record['dwmc'];
                } else if (name === 'dakmc') {
                    obj['?????????'] = record['dakmc'];
                } else if (name === 'nd') {
                    obj['??????'] = record['nd'];
                } else if (name === 'bgqx') {
                    obj['????????????'] = record['bgqx'];
                } else if (name === 'daklx') {
                    obj['????????????'] = record['daklx'];
                } else if (name === 'daklb') {
                    obj['????????????'] = record['daklb'];
                } else if (name === 'tmzt') {
                    obj['????????????'] = record['tmzt'];
                }
                // else if (name === 'gdbmsx') {
                //   obj['????????????'] = record['gdbm'];
                // } 
                else if (name === 'gdrmc') {
                    obj['?????????'] = record['gdrmc'];
                } else if (name === 'gdny') {
                    obj['????????????'] = record['gdny'];
                } else if (name === 'tms') {
                    obj['????????????'] = record['tms'];
                } else if (name === 'fjs') {
                    obj['????????????'] = record['fjs'];
                } else if (name === 'ys') {
                    obj['??????'] = record['ys'];
                } else if (name === 'ywdx') {
                    obj['???????????????G???'] = record['ywdx'];
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
                        this.columnameList.push('??????');
                        break s;
                    case 'daklbsx':
                        this.columnameList.push('????????????');
                        break s;
                    case 'daksx':
                        this.columnameList.push('?????????');
                        break s;
                    case 'daklxsx':
                        this.columnameList.push('????????????');
                        break s;
                    case 'tmztsx':
                        this.columnameList.push('????????????');
                        break s;
                    case 'ndsx':
                        this.columnameList.push('??????');
                        break s;
                    case 'bgqxsx':
                        this.columnameList.push('????????????');
                        break s;
                    case 'gdbmsx':
                        this.columnameList.push('????????????');
                        break s;
                    case 'gdrmcsx':
                        this.columnameList.push('?????????');
                        break s;
                    case 'gdnysx':
                        this.columnameList.push('????????????');
                        break s;
                }
            }

        }
        this.columnameList.push('????????????');
        this.columnameList.push('????????????');
        this.columnameList.push('??????');
        this.columnameList.push('???????????????G???');
    }


    searchGdtjResult = async (values) => {
        this.params = { ...values };
        const response = await fetch.post(`${this.url}/queryForNewGdtjQueryList`, this.params );
        return response;
    }
}

export default new Dagdgzcltj('/api/eps/control/main/basetj');
