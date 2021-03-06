import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from "@/stores/system/SysStore";

class Dalytj {

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
    @observable dwid = [SysStore.getCurrentUser().dwid];
    @observable dakid = [];
    @observable xslx = "tjlb";
    @observable rq = [];
    @observable tjxs = ["dwsx"];
    @observable yhmc = "";




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
    yhdwData = [];
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
    @action setData = (data) => {
        this.data = data;
    }
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

    @action queryForPage = async () => {

        ;
        this.loading = true;

        const par = this.params;
        const xs = par["tjxs"];
        const lxxs = par["xslx"];
        const columsetslist = [];
        const columname = [];
        if (lxxs == "tjlb") {
            par["tjfs"] = "D";
            par["qkey"] = "Datj.dalytj";
            if (par["tjfs"] != "D") {
                columsetslist.push({ dataIndex: "tjms", width: 100, sorter: (a, b) => a.tjms - b.tjms, title: "??????" });
            } else {
                if (xs && xs.length > 0) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        var a = xs[i];
                        switch (a) {
                            case "jylxsx":
                                columsetslist.push({
                                    title: "????????????",
                                    dataIndex: "jylx",
                                    key: "jylx",
                                    width: 100,
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jylx - b.jylx,
                                });
                                columname.push('????????????');
                                break;
                            case "ndsx":
                                columsetslist.push({
                                    dataIndex: "jynd",
                                    key: "jynd",
                                    width: 100,
                                    title: "??????",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jynd - b.jynd,
                                });
                                columname.push('??????');
                                break
                            case "monthsx":
                                columsetslist.push({
                                    dataIndex: "jymonth",
                                    key: "jymonth",
                                    width: 100,
                                    title: "??????",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jymonth - b.jymonth,
                                });
                                columname.push('??????');
                                break;
                            case "dwsx":
                                columsetslist.push({
                                    dataIndex: "dakdw",
                                    key: "dakdw",
                                    width: 120,
                                    title: "????????????",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.dakdw - b.dakdw,
                                });
                                columname.push('????????????');
                                break;
                            case "daksx":
                                columsetslist.push({
                                    dataIndex: "tjms",
                                    width: 100,
                                    title: "???????????????",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.tjms - b.tjms,
                                });
                                columname.push('???????????????');
                                break;
                            case "jyyhsx":
                                columsetslist.push({
                                    dataIndex: "jyyhmc",
                                    width: 100,
                                    title: "?????????",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jyyhmc - b.jyyhmc,
                                });
                                columname.push('?????????');
                                break;
                            case "czyhsx":
                                columsetslist.push({
                                    dataIndex: "czyhmc",
                                    width: 100,
                                    title: "?????????",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.czyhmc - b.czyhmc,
                                });
                                columname.push('?????????');
                                break;
                            case "daklxsx":
                                columsetslist.push({
                                    dataIndex: "daklx",
                                    width: 100,
                                    title: "???????????????",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.daklx - b.daklx,
                                });
                                columname.push('???????????????');
                                break;
                            case "tmsx":
                                columsetslist.push({
                                    dataIndex: "tm", width: 100, defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.tm - b.tm, title: "??????"
                                });
                                columname.push('??????');
                                break;

                            case "bgqxsx":
                                columsetslist.push({
                                    dataIndex: "bgqx", width: 100, defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.bgqx - b.bgqx, title: "????????????"
                                });
                                columname.push('????????????');
                                break;
                            case "lymdsx":
                                columsetslist.push({
                                    dataIndex: "lymd", width: 100, defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.lymd - b.lymd, title: "????????????"
                                });
                                columname.push('????????????');
                                break;
                        }

                    }
                }
                columsetslist.push({
                    dataIndex: "rc",
                    width: 100,
                    title: "????????????",
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.rc - b.rc,
                    fixed: 'right',
                });
                columsetslist.push({
                    dataIndex: "ajc",
                    width: 100,
                    title: "????????????",
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.ajc - b.ajc,
                    fixed: 'right',
                });
                columsetslist.push({
                    dataIndex: "jc",
                    width: 100,
                    title: "????????????",
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.jc - b.jc,
                    fixed: 'right',
                });
                columname.push('????????????');
                columname.push('????????????');
                columname.push('????????????');
                this.setColumns(columsetslist);
            }
        }

        const pars = this.params;
        const dakids = pars["dakid"];
        pars["dakid"] = dakids.toString();

        const dws = pars["dw"];
        if (dws && dws != "undefined") {
            pars["dw"] = dws.toString();
        } else {
            pars["dw"] = SysStore.getCurrentCmp().id;
        }

        const tjxss = pars["tjxs"];
        pars["tjxs"] = tjxss.toString();

        const response = await fetch
            .post(`${this.url}/queryForList`, pars, { params: { ...pars } });
        if (response && response.status === 200) {
            runInAction(() => {
                this.data = this.afterQueryData(response.data);
                const records = response.data.results;
                this.columnameList = columname;
                for (var i in records) {
                    const record = records[i];
                    const obj = {};
                    for (var name in record) {
                        if (name === "jylx") {
                            obj['????????????'] = record['jylx']
                        } else if (name === 'jynd') {
                            obj['??????'] = record['jynd']
                        } else if (name === 'jymonth') {
                            obj['??????'] = record['jymonth']
                        } else if (name === 'dakdw') {
                            obj['????????????'] = record['dakdw']
                        } else if (name === 'tjms') {
                            obj['???????????????'] = record['tjms']
                        } else if (name === 'jyyhmc') {
                            obj['?????????'] = record['jyyhmc']
                        } else if (name === 'czyhmc') {
                            obj['?????????'] = record['czyhmc']
                        } else if (name === 'daklx') {
                            obj['???????????????'] = record['daklx']
                        } else if (name === 'tm') {
                            obj['??????'] = record['tm']
                        } else if (name === 'bgqx') {
                            obj['????????????'] = record['bgqx']
                        } else if (name === 'lymd') {
                            obj['????????????'] = record['lymd']
                        } else if (name === 'rc') {
                            obj['????????????'] = record['rc']
                        } else if (name === 'ajc') {
                            obj['????????????'] = record['ajc']
                        } else if (name === 'jc') {
                            obj['????????????'] = record['jc']
                        }
                    }
                    this.columnResult.push(obj);
                }
                this.loading = false;
            });
        }
        else {
            this.loading = true;
        }
    }

    //??????excel????????????
    setExcleContent = (records) => {
        this.columnResult = [];
        for (var i in records) {
            const record = records[i];
            const obj = {};
            for (var name in record) {
                if (name === 'dwmc') {
                    obj['??????'] = record['dwmc'];
                } else if (name === 'dalb') {
                    obj['????????????'] = record['dalb'];
                } else if (name === 'dakmc') {
                    obj['?????????'] = record['dakmc'];
                } else if (name === 'nf') {
                    obj['??????'] = record['nf'];
                } else if (name === 'yf') {
                    obj['??????'] = record['yf'];
                } else if (name === 'jyr') {
                    obj['?????????'] = record['jyr'];
                } else if (name === 'bgqx') {
                    obj['????????????'] = record['bgqx'];
                } else if (name === 'jymd') {
                    obj['????????????'] = record['jymd'];
                } else if (name === 'jylx') {
                    obj['????????????'] = record['jylx'];
                } else if (name === 'jyrc') {
                    obj['????????????'] = record['jyrc'];
                } else if (name === 'jyajc') {
                    obj['????????????'] = record['jyajc'];
                } else if (name === 'jyjc') {
                    obj['????????????'] = record['jyjc'];
                }
            }
            this.columnResult.push(obj);

        }
        console.log('columsetslist=====', this.columnResult);
    }
    //??????excel????????????
    setExcleHeader = () => {
        this.columnameList = [];
        if (this.tjxs.length > 0) {
            for (var i in this.tjxs) {
                s: switch (this.tjxs[i]) {
                    case 'dwsx':
                        this.columnameList.push('??????');
                        break s;
                    case 'dalbsx':
                        this.columnameList.push('????????????');
                        break s;
                    case 'daksx':
                        this.columnameList.push('?????????');
                        break s;
                    case 'nfsx':
                        this.columnameList.push('??????');
                        break s;
                    case 'yfsx':
                        this.columnameList.push('??????');
                        break s;
                    case 'jyrsx':
                        this.columnameList.push('?????????');
                        break s;
                    case 'bgqxsx':
                        this.columnameList.push('????????????');
                        break s;
                    case 'jymdsx':
                        this.columnameList.push('????????????');
                        break s;
                    case 'jylxsx':
                        this.columnameList.push('????????????');
                        break s;

                }
            }

        }
        this.columnameList.push('????????????');
        this.columnameList.push('????????????');
        this.columnameList.push('????????????');
    }

    //????????????????????????
    searchJytjResult = async (values) => {
        this.params = { ...values };
        const response = await fetch.post("/api/eps/datj/jytj/queryForNewJytjQueryList", this.params);
        return response;
    }




}

export default new Dalytj('/api/eps/control/main/basetj');
