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
                columsetslist.push({ dataIndex: "tjms", width: 100, sorter: (a, b) => a.tjms - b.tjms, title: "名称" });
            } else {
                if (xs && xs.length > 0) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        var a = xs[i];
                        switch (a) {
                            case "jylxsx":
                                columsetslist.push({
                                    title: "借阅类型",
                                    dataIndex: "jylx",
                                    key: "jylx",
                                    width: 100,
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jylx - b.jylx,
                                });
                                columname.push('借阅类型');
                                break;
                            case "ndsx":
                                columsetslist.push({
                                    dataIndex: "jynd",
                                    key: "jynd",
                                    width: 100,
                                    title: "年度",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jynd - b.jynd,
                                });
                                columname.push('年度');
                                break
                            case "monthsx":
                                columsetslist.push({
                                    dataIndex: "jymonth",
                                    key: "jymonth",
                                    width: 100,
                                    title: "月份",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jymonth - b.jymonth,
                                });
                                columname.push('月份');
                                break;
                            case "dwsx":
                                columsetslist.push({
                                    dataIndex: "dakdw",
                                    key: "dakdw",
                                    width: 120,
                                    title: "单位名称",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.dakdw - b.dakdw,
                                });
                                columname.push('单位名称');
                                break;
                            case "daksx":
                                columsetslist.push({
                                    dataIndex: "tjms",
                                    width: 100,
                                    title: "档案库名称",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.tjms - b.tjms,
                                });
                                columname.push('档案库名称');
                                break;
                            case "jyyhsx":
                                columsetslist.push({
                                    dataIndex: "jyyhmc",
                                    width: 100,
                                    title: "借阅人",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.jyyhmc - b.jyyhmc,
                                });
                                columname.push('借阅人');
                                break;
                            case "czyhsx":
                                columsetslist.push({
                                    dataIndex: "czyhmc",
                                    width: 100,
                                    title: "操作员",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.czyhmc - b.czyhmc,
                                });
                                columname.push('操作员');
                                break;
                            case "daklxsx":
                                columsetslist.push({
                                    dataIndex: "daklx",
                                    width: 100,
                                    title: "档案库类型",
                                    defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.daklx - b.daklx,
                                });
                                columname.push('档案库类型');
                                break;
                            case "tmsx":
                                columsetslist.push({
                                    dataIndex: "tm", width: 100, defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.tm - b.tm, title: "题名"
                                });
                                columname.push('题名');
                                break;

                            case "bgqxsx":
                                columsetslist.push({
                                    dataIndex: "bgqx", width: 100, defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.bgqx - b.bgqx, title: "保管期限"
                                });
                                columname.push('保管期限');
                                break;
                            case "lymdsx":
                                columsetslist.push({
                                    dataIndex: "lymd", width: 100, defaultSortOrder: 'descend',
                                    sorter: (a, b) => a.lymd - b.lymd, title: "利用目的"
                                });
                                columname.push('利用目的');
                                break;
                        }

                    }
                }
                columsetslist.push({
                    dataIndex: "rc",
                    width: 100,
                    title: "利用人次",
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.rc - b.rc,
                    fixed: 'right',
                });
                columsetslist.push({
                    dataIndex: "ajc",
                    width: 100,
                    title: "利用卷次",
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.ajc - b.ajc,
                    fixed: 'right',
                });
                columsetslist.push({
                    dataIndex: "jc",
                    width: 100,
                    title: "利用件次",
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.jc - b.jc,
                    fixed: 'right',
                });
                columname.push('利用人次');
                columname.push('利用卷次');
                columname.push('利用件次');
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
                            obj['借阅类型'] = record['jylx']
                        } else if (name === 'jynd') {
                            obj['年度'] = record['jynd']
                        } else if (name === 'jymonth') {
                            obj['月份'] = record['jymonth']
                        } else if (name === 'dakdw') {
                            obj['单位名称'] = record['dakdw']
                        } else if (name === 'tjms') {
                            obj['档案库名称'] = record['tjms']
                        } else if (name === 'jyyhmc') {
                            obj['借阅人'] = record['jyyhmc']
                        } else if (name === 'czyhmc') {
                            obj['操作员'] = record['czyhmc']
                        } else if (name === 'daklx') {
                            obj['档案库类型'] = record['daklx']
                        } else if (name === 'tm') {
                            obj['题名'] = record['tm']
                        } else if (name === 'bgqx') {
                            obj['保管期限'] = record['bgqx']
                        } else if (name === 'lymd') {
                            obj['利用目的'] = record['lymd']
                        } else if (name === 'rc') {
                            obj['利用人次'] = record['rc']
                        } else if (name === 'ajc') {
                            obj['利用卷次'] = record['ajc']
                        } else if (name === 'jc') {
                            obj['利用件次'] = record['jc']
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

    //构建excel表格内容
    setExcleContent = (records) => {
        this.columnResult = [];
        for (var i in records) {
            const record = records[i];
            const obj = {};
            for (var name in record) {
                if (name === 'dwmc') {
                    obj['单位'] = record['dwmc'];
                } else if (name === 'dalb') {
                    obj['档案类别'] = record['dalb'];
                } else if (name === 'dakmc') {
                    obj['档案库'] = record['dakmc'];
                } else if (name === 'nf') {
                    obj['年度'] = record['nf'];
                } else if (name === 'yf') {
                    obj['月份'] = record['yf'];
                } else if (name === 'jyr') {
                    obj['借阅人'] = record['jyr'];
                } else if (name === 'bgqx') {
                    obj['保管期限'] = record['bgqx'];
                } else if (name === 'jymd') {
                    obj['借阅目的'] = record['jymd'];
                } else if (name === 'jylx') {
                    obj['借阅类型'] = record['jylx'];
                } else if (name === 'jyrc') {
                    obj['借阅人次'] = record['jyrc'];
                } else if (name === 'jyajc') {
                    obj['借阅卷次'] = record['jyajc'];
                } else if (name === 'jyjc') {
                    obj['借阅件次'] = record['jyjc'];
                }
            }
            this.columnResult.push(obj);

        }
        console.log('columsetslist=====', this.columnResult);
    }
    //构建excel表头数据
    setExcleHeader = () => {
        this.columnameList = [];
        if (this.tjxs.length > 0) {
            for (var i in this.tjxs) {
                s: switch (this.tjxs[i]) {
                    case 'dwsx':
                        this.columnameList.push('单位');
                        break s;
                    case 'dalbsx':
                        this.columnameList.push('档案类别');
                        break s;
                    case 'daksx':
                        this.columnameList.push('档案库');
                        break s;
                    case 'nfsx':
                        this.columnameList.push('年度');
                        break s;
                    case 'yfsx':
                        this.columnameList.push('月份');
                        break s;
                    case 'jyrsx':
                        this.columnameList.push('借阅人');
                        break s;
                    case 'bgqxsx':
                        this.columnameList.push('保管期限');
                        break s;
                    case 'jymdsx':
                        this.columnameList.push('借阅目的');
                        break s;
                    case 'jylxsx':
                        this.columnameList.push('借阅类型');
                        break s;

                }
            }

        }
        this.columnameList.push('借阅人次');
        this.columnameList.push('借阅卷次');
        this.columnameList.push('借阅件次');
    }

    //获取借阅统计数据
    searchJytjResult = async (values) => {
        this.params = { ...values };
        const response = await fetch.post("/api/eps/datj/jytj/queryForNewJytjQueryList", this.params);
        return response;
    }




}

export default new Dalytj('/api/eps/control/main/basetj');
