import React from 'react';
import {action, makeObservable, observable, runInAction} from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '@/utils/fetch';
import SysStore from '@/stores/system/SysStore';
import LoginStore from '@/stores/system/LoginStore';
import IceNotification from '@icedesign/notification';

class XZxyjStore extends BaseStore {
    // querySjzd 查询数据字典 zdx: 证件名称
    @observable sjzdData = {};
    @observable bqgxData = [];
    @observable treeData = [];
    @observable tloading = [];
    @observable tpageno = 1;
    @observable tpagesize = 10;
    @observable tdata = [];
    @observable tparams = [];
    @observable lymxData = {};
    @observable fjData = [];
    @observable dwData = [];
    @observable dakDate = {};
    @observable scDakDate = [];
    @observable dakKfields = [];
    @observable dakJnKfields = [];
    @observable jsResult = [];
    @observable jsJnResult = [];
    @observable searparams = {};
    @observable progressValue = 0;
    @observable jsprogressValue = 0;
    @observable percentage = 0;

    @observable sxjcresult = {};
    @observable zsxresult = false;
    @observable wzxresult = false;
    @observable kyxresult = false;
    @observable aqxresult = false;
    @observable jczt = false;
    @observable jcjg ="";
    @observable list = [];
    @observable saveParams = {id: "new"};
    @observable formdata ={};
    constructor(url, wfenable, oldver = true) {
        super(url,wfenable,oldver);
        makeObservable(this);
    }


    beforeSetEditRecord(value) {
        return value;
    }
    @action setFormdata = (record) => {
        const {...v} = this.editRecord;
        this.editRecord = {...v, record};
    };
    @action seteditRecord = (record) => {
        const {...v} = this.editRecord;
        this.editRecord = {...v, record};
        console.log(this.editRecord);
    };
    @action duoJc = async (params) => {
        const bmc = params.bmc;
        let newbgqx ="";
        for(let i = 0; i < this.searparams.bgqx.length; i++){
            newbgqx +=",'"+this.searparams.bgqx[i]+"'";
        }
        const sql = "(" + bmc + "_BGQX in (" + newbgqx.substring(1) + ") and " + bmc + "_ND >= '" + this.searparams.ndb + "' and " + bmc + "_ND <= '" + this.searparams.nde + "')";
        const fd = new FormData();
        fd.append('bmc', bmc);
        fd.append('telesql', sql);
        fd.append('tmzt', "3");
        fd.append('hszbz', "N");
        let tmlist = [];
        fetch.post(`/api/eps/control/main/dagl/queryForList`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}}).then(
            response => {
                tmlist = response.data;
                let ids = "";
                for (let i = 0; i < tmlist.length; i++) {
                    ids += "," + tmlist[i].id;
                }
                const keyvalues = {};
                const lx = "3";
                keyvalues["dakid"] = params.dakid;
                keyvalues["bmc"] = params.bmc;
                keyvalues["daklx"] = this.searparams.daklx;
                keyvalues["tmzt"] = lx;
                keyvalues["mbid"] = this.searparams.mbid;
                keyvalues["dakmc"] = params.bmc;
                keyvalues["whrid"] = SysStore.getCurrentUser().id;
                keyvalues["whr"] = SysStore.getCurrentUser().mc;
                keyvalues["ids"] = ids.substring(1);
                keyvalues["sqdbmc"] = "GSYJSQD";
                keyvalues["lx"] = lx;
                keyvalues["ly"] = "04";
                keyvalues["sxjcly"] = "04";
                keyvalues["code"] = this.searparams.mbid;
                keyvalues["sxjchj"] = "04";
                keyvalues["JDBC"] = this.editRecord.id;
                fetch.post(`/eps/api/xsxjc/xsjsxjc`, keyvalues, {responseType: 'json'}).then(resp => {
                    if (resp.status === 200) {
                        this.progressValue = 40;
                        let timer = null;
                        if (timer == null) {
                            timer = setInterval(() => {
                                const params = {id: this.editRecord.id};
                                fetch.get(`/api/eps/control/main/gsyjsqd/queryForId`, {params}).then(gszxyjsqd => {
                                    if (gszxyjsqd.data?.jczt === "Y") {
                                        this.jczt = true;
                                        this.progressValue = 100;
                                        this.opt = "edit";
                                        clearInterval(timer);
                                        fetch.get(`/api/api/sxjcjgz/sxjcjgxq?jcbc=`+this.editRecord.id, {}).then(sxjcjgxq => {
                                            const ywresult = {};
                                            const {...v} = this.editRecord;
                                            ywresult.zsx = sxjcjgxq.data.zsx;
                                            ywresult.wzx =  sxjcjgxq.data.wzx;
                                            ywresult.kyx = sxjcjgxq.data.kyx;
                                            ywresult.aqx =  sxjcjgxq.data.kkx;
                                            this.editRecord = {...v, ...ywresult};
                                        });
                                    }else if (gszxyjsqd.data?.jczt === "N"){
                                       this.jcjg=gszxyjsqd.data.jcjg;
                                    }
                                });

                            }, 10000);
                        }
                    }
                });
            });

    }

    @action xduoJc = async (paramid) => {
        const fd = new FormData();
        fd.append('id', paramid);
        fd.append('whrid', SysStore.getCurrentUser().id);
        fd.append('whr', SysStore.getCurrentUser().yhmc);
        fd.append('sqdbmc', "GSYJSQD");
        fetch.post(`/api/eps/control/main/gsyjsqd/duoJc`, fd, {responseType: 'json'}).then(resp => {
            if (resp.status === 200) {
                this.progressValue = 40;
                let timer = null;
                if (timer == null) {
                    timer = setInterval(() => {
                    const params = {id: paramid};
                    fetch.get(`/api/eps/control/main/gsyjsqd/queryForId`, {params}).then(gszxyjsqd => {
                       if (gszxyjsqd.data.jczt === "Y") {
                                        this.jczt = true;
                                        this.progressValue = 100;
                                        this.opt = "edit";
                                        clearInterval(timer);
                                        fetch.get(`/api/api/sxjcjgz/sxjcjgxq?jcbc=`+paramid, {}).then(sxjcjgxq => {
                                            const fd = new FormData();
                                            fd.append('id', paramid);
                                            fd.append('zsx', sxjcjgxq.data.zsx == undefined ? "" : sxjcjgxq.data.zsx);
                                            fd.append('qzx', sxjcjgxq.data.wzx == undefined ? "" : sxjcjgxq.data.wzx);
                                            fd.append('kyx', sxjcjgxq.data.kyx == undefined ? "" : sxjcjgxq.data.kyx);
                                            fd.append('aqx', sxjcjgxq.data.kkx == undefined ? "" : sxjcjgxq.data.kkx);
                                            fetch.post(`/api/eps/control/main/gsyjsqd/uploadjg`, fd, {responseType: 'json'}).then(resp => {
                                            });
                                          //  this.editRecord = {...v, ...ywresult};
                                        });
                                    }else if (gszxyjsqd.data.jczt === "N"){
                                       this.jcjg=gszxyjsqd.data.jcjg;
                                    }
                                });

                }, 10000);
                }
            }
        });
    }

    @action jsxduoJc = async (paramid) => {
        const fd = new FormData();
        fd.append('id', paramid);
        fd.append('whrid', SysStore.getCurrentUser().id);
        fd.append('whr', SysStore.getCurrentUser().yhmc);
        fd.append('sqdbmc', "GSYJJSSQD");
        fetch.post(`/api/eps/control/main/gsyjjssqd/duoJc`, fd, {responseType: 'json'}).then(resp => {
            if (resp.status === 200) {
                this.jsprogressValue = 40;
                let timer = null;
                if (timer == null) {
                    timer = setInterval(() => {
                    const params = {id: paramid};
                    fetch.get(`/api/eps/control/main/gsyjjssqd/queryForId`, {params}).then(gszxyjsqd => {
                       if (gszxyjsqd.data?.jczt === "Y") {
                                        this.jczt = true;
                                        this.jsprogressValue = 100;
                                        this.opt = "edit";
                                        clearInterval(timer);
                                        fetch.get(`/api/api/sxjcjgz/sxjcjgxq?jcbc=`+paramid, {}).then(sxjcjgxq => {
                                            const fd = new FormData();
                                            fd.append('id', paramid);
                                            fd.append('zsx', sxjcjgxq.data.zsx == undefined ? "" : sxjcjgxq.data.zsx);
                                            fd.append('qzx', sxjcjgxq.data.wzx == undefined ? "" : sxjcjgxq.data.wzx);
                                            fd.append('kyx', sxjcjgxq.data.kyx == undefined ? "" : sxjcjgxq.data.kyx);
                                            fd.append('aqx', sxjcjgxq.data.kkx == undefined ? "" : sxjcjgxq.data.kkx);
                                            fetch.post(`/api/eps/control/main/gsyjjssqd/uploadjg`, fd, {responseType: 'json'}).then(resp => {
                                            });
                                          //  this.editRecord = {...v, ...ywresult};
                                        });
                                    }else if (gszxyjsqd.data?.jczt === "N"){
                                       this.jcjg=gszxyjsqd.data.jcjg;
                                    }
                                });

                }, 10000);
                }
            }
        });
    }

    @action setTmmerjs = (a) => {
        this.jsprogressValue = a;
    };
    @action setTmmer = (a) => {
        this.progressValue = a;
    };
    @action getColumns = async (params) => {
        const fd = new FormData();
        fd.append('dakid', params.dakid);
        fd.append("lx", "3")
        const kfields = await fetch.post(`/api/eps/control/main/mbkzzlx/queryForList`, fd);
        const newkfields = [];
        kfields.data.map(item => {
            if (item.lbkj == "Y" && item.mc) {
                newkfields.push({title: item.ms, dataIndex: item.mc.toLowerCase(), width: item.mlkd, ellipsis: true});
            }
        });
        this.dakKfields = newkfields;
        if (params.daklx === "02") {
            const jndakparams = new FormData();
            jndakparams.append('fid', params.dakid);
            const jndak = await fetch.post(`/api/eps/control/main/dak/queryForId`, jndakparams);
            fd.append("dakid", jndak.data.id);
            const jnkfields = await fetch.post(`/api/eps/control/main/mbkzzlx/queryForList`, fd);
            const newjnkfields = [];
            jnkfields.data.map(item => {
                if (item.lbkj == "Y" && item.mc) {
                    newjnkfields.push({
                        title: item.ms,
                        dataIndex: item.mc.toLowerCase(),
                        width: item.mlkd,
                        ellipsis: true
                    });
                }
            });
            this.dakJnKfields = newjnkfields;
        }
    }

    @action setFdw = async (params) => {
        const fd = new FormData();
        fd.append('id', SysStore.getCurrentCmp().id);
        fetch.post(`/api/eps/control/main/dw/queryForId`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}}).then(
            response => {
                if(response.data.fid===undefined){
                    const ywresult = {
                        gmc: response.data.id,
                    }
                    this.getScDak({dwid: response.data.id, mbid: this.searparams.mbid});
                }else{
                    const ywresult = {
                        gmc: response.data.fid,
                    }
                    this.getScDak({dwid: response.data.fid, mbid: this.searparams.mbid});
                }

            });
    }
    @action queryTmSl = async (params) => {
        const bmc = params.bmc;
        let newbgqx ="";
        for(let i = 0; i < this.searparams.bgqx.length; i++){
            newbgqx +=",'"+this.searparams.bgqx[i]+"'";
        }
        const sql = "(" + bmc + "_BGQX in (" + newbgqx.substring(1) + ") and " + bmc + "_ND >= '" + this.searparams.ndb + "' and " + bmc + "_ND <= '" + this.searparams.nde + "')";
        const fd = new FormData();
        fd.append('bmc', bmc);
        fd.append('sql', sql);
        fd.append('tmzt', "3");
        fd.append('hszbz', "N");
        fetch.post(this.url + `/queryTmsk`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}}).then(
            response => {
                const ywresult = {
                    tmsl: response.data.tmsl,
                    ywsl: response.data.ywsl,
                    ywsize: (response.data.ywsize / 1024 / 1024).toFixed(2)
                }
                const {...v} = this.editRecord;
                this.editRecord = {...v, ...ywresult};
            });
    }
    @action queryJnTmSl = (params) => {

    }
    @action saveDjrData = (values, dakid, bmc) => {
        const {...v} = this.editRecord;
        this.editRecord = {...v, ...values};
        this.jsSearch()
    };
     saveData = async (values) => {
        values = this.beforeSaveData(values);
        let response;
        if (!this.oldver) {
            if (this.opt === 'edit') {
                response = await fetch
                    .put(`${this.url}/${encodeURIComponent(this.editRecord.id)}`, values);
            } else {
                response = await fetch.post(this.url, values);
            }
            if (response && response.status === 201) {

                runInAction(() => {
                    this.editVisible = false;
                    this.editRecord = this.beforeSetEditRecord(response.data);
                    if (this.wfenable) {
                        this.getProcOpt(this.editRecord);
                    }
                    this.afterSaveData(response.data);
                });
            }
        } else {
            const fd = new FormData();
            for (const key in values) {
                fd.append(key, values[key]);
            }
            fd.append("sqrbh", SysStore.getCurrentUser().id)
            if (this.opt === 'edit') {
                response = await fetch
                    .put(`${this.url}${this.updateUrl || "/update"}`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
            } else {
                response = await fetch.post(`${this.url}${this.addUrl || "/add"}`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
            }
            if (response && response.status === 200 && response.data) {
                runInAction(() => {
                    if (response.data.success === false) {
                        this.openNotification(response.data.message, 'warning');
                    }
                    this.editVisible = false;
                    this.editRecord = this.beforeSetEditRecord(response.data.results);
                    if (this.wfenable) {
                        this.getProcOpt(this.editRecord);
                    }
                    if (response.data && response.data.success) {
                        this.openNotification("提交成功", 'success');
                    }
                });
            }
        }

    }
    @action setsearparams = (values, data,sjdata) => {
        const params = {
            bgqx: values.bgqx,
            ndb: values.ndb,
            nde: values.nde,
            dakid: data.dakid,
            bmc: data.bmc,
            mbid: sjdata.mbid,
            daklx:sjdata.daklx
        }
        this.searparams = params;
    };
    @action jsSearch = async () => {
        const bmc = this.searparams.bmc;
        let newbgqx ="";
        for(let i = 0; i < this.searparams.bgqx.length; i++){
            newbgqx +=",'"+this.searparams.bgqx[i]+"'";
        }
        const sql = "(" + bmc + "_BGQX in (" + newbgqx.substring(1) + ") and " + bmc + "_ND >= '" + this.searparams.ndb + "' and " + bmc + "_ND <= '" + this.searparams.nde + "')";
        const params = {
            dakid: this.searparams.dakid,
            tmzt: "3",
            hszbz: "N",
            bmc: this.searparams.bmc,
            telesql: sql
        };
        const fd = new FormData();
        fd.append('page', this.pageno - 1);
        fd.append('limit', this.pagesize);
        fd.append('dayh', SysStore.getCurrentUser().id);
        fd.append('dwid', SysStore.getCurrentCmp().id);
        if (params) {
            for (const key in params) {
                fd.append(key, params[key]);
            }
        }
        const response = await fetch
            .post(`/api/eps/control/main/dagl/queryForPage`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
        console.log(response);
        if (response && response.status === 200 && response.data.success) {
            this.jsResult = response.data;
            this.loading = false;
        } else {
            this.loading = true;
        }
    }

    @action jsJnSearch = async (fid, dakid, dakmc) => {
        const jndakparams = new FormData();
        jndakparams.append('fid', dakid);
        const jndak = await fetch.post(`/api/eps/control/main/dak/queryForId`, jndakparams);
        const params = {
            dakid: jndak.data.id,
            tmzt: "3",
            hszbz: "N",
            fid: fid,
            bmc: dakmc + "A"
        };
        const fd = new FormData();
        fd.append('page', this.tpageno - 1);
        fd.append('limit', this.tpagesize);
        fd.append('dayh', SysStore.getCurrentUser().id);
        fd.append('dwid', SysStore.getCurrentCmp().id);
        if (params) {
            for (const key in params) {
                fd.append(key, params[key]);
            }
        }
        const response = await fetch
            .post(`eps/control/main/dagl/queryForPage`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
        console.log(response);
        if (response && response.status === 200 && response.data.success) {
            this.jsJnResult = response.data;
            this.loading = false;
        } else {
            this.loading = true;
        }
    }
    @action doSumitTj = async (values) => {
        values = this.beforeSaveData(values);
        let response;
        const fd = new FormData();
        for (const key in values) {
            fd.append(key, values[key]);
        }
        fd.append("gnbs", "G")
        response = await fetch.post(`${this.url}${this.addUrl || "/autoGenSqd"}`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
        if (response && response.status === 200 && response.data) {
            runInAction(() => {
                this.editRecord = this.beforeSetEditRecord(response.data.results);
            });
        }
    }
    @action getSjzdData = async (zdmc) => {
        const fd = new FormData();
        fd.append('zdx', zdmc);
        const res = await fetch.post(`/api/eps/control/main/dalydj/querySjzd`, fd);
        if (res && res.data && res.data.success) {
            runInAction(() => {
                this.bqgxData = res.data.results;
            });
        }
    }
    @action getDWlist = async () => {
        const res = await fetch.get(`/api/eps/control/main/dw/queryForList`);
        if (res.status === 200) {
            this.dwData = res.data;
        }
    }
    @action getDak = async (id) => {
        const fd = new FormData();
        fd.append('id', id);
        const res = await fetch.post(`/api/eps/control/main/dak/queryForId`, fd);
        if (res.status === 200) {
            this.dakDate = res.data;
            console.log(this.dakDate);
        }
    }
    @action onchagedw = async (data) => {
        const fd = new FormData();
        fd.append('dw', data);
        fd.append('mbid',  this.searparams.mbid);
        fd.append('nodydakid',  'N');
        const res = await fetch.post(`/api/eps/control/main/dak/queryForList`, fd);
        if (res.status === 200) {
            this.scDakDate = res.data;
        }

    }

    @action getScDak = async (data) => {
        const fd = new FormData();
        fd.append('dw', data.dwid);
        fd.append('mbid', data.mbid);
        fd.append('nodydakid',  'N');
        const res = await fetch.post(`/api/eps/control/main/dak/queryForList`, fd);
        if (res.status === 200) {
            this.scDakDate = res.data;
            console.log(this.scDakDate);
        }

    }

    getData = (data) => {
        if (!data) {
            return null;
        }
        return data.map(
            d => ({
                label: d.label, value: d.id, key: d.key, children: this.getData(d.children),
                icon: (<i className={`iconfont ${d.type === 'F' || !d.leaf ? 'icondir' : 'iconfile'}`}/>),
                selectable: d.leaf,
            })
        );
    }

     showEditForm = (editRecord) => {
        this.editRecord = this.beforeSetEditRecord(editRecord);
    }
    @action getDakTree = async () => {
        const params = {isby: 'N', noshowdw: 'Y', node: 'root', tmzt: '4'};
        params['dayh'] = SysStore.getCurrentUser().id;
        params['dw'] = SysStore.getCurrentCmp().id;
        const res = await fetch.get("/api/eps/control/main/dak/queryTree", {params});
        this.treeData = this.getData(res && res.data);
    }

    @action queryDakData = async (index, params) => {
        let newPage = false;
        if (index == this.tpageno.length) {
            newPage = true;
            this.tpageno.push(1);
            this.tpagesize.push(20);
            this.tparams.push(params || {});
            this.tloading.push(true);
        }
        const fd = new FormData();
        fd.append('page', this.tpageno[index] - 1);
        fd.append('limit', this.tpagesize[index]);
        fd.append('tmzt', '4');
        fd.append('hszbz', 'N');
        fd.append('dayh', SysStore.getCurrentUser().id);
        fd.append('dwid', SysStore.getCurrentCmp().id);
        if (params) {
            for (const key in params) {
                fd.append(key, params[key]);
            }
        } else {
            for (const key in this.tparams[index]) {
                fd.append(key, this.tparams[index][key]);
            }
        }
        const res = await fetch.post("/api/eps/control/main/dagl/queryForPage", fd);
        const data = res && res.status === 200 && res.data.success && res.data;
        runInAction(() => {
            if (newPage) {
                this.tdata.push(data);
            } else {
                this.tdata[index] = data;
            }
            this.tloading[index] = false;
        });
    }

    @action removeTab = (index) => {
        this.tloading.splice(index, 1);
        this.tpageno.splice(index, 1);
        this.tpagesize.splice(index, 1);
        this.tdata.splice(index, 1);
        this.tparams.splice(index, 1);
    }

    @action setTPageNo = async (pageno, bgqx, ndb, nde, dakid, bmc) => {
        this.pageno = pageno;
        await this.jsSearch();
    }

    @action setTPageSize = async (pageSize, bgqx, ndb, nde, dakid, bmc) => {
        this.pagesize = pageSize;
        await this.jsSearch();
    }

    @action queryFJList = async (id, grpid) => {
        const params = {doctbl: "DALYDJ_FJ", grptbl: "DALYDJ_FJFZ", grpid, sfzxbb: 1, daktmid: id};
        const res = await fetch.get("/eps/wdgl/attachdoc/queryForList", {params});
        if (res && res.status === 200 && res.data) {
            runInAction(() => {
                this.fjData = res.data;
                console.log(this.fjData);
            });
        }
    }
    @action queryForList = async (params) => {
        const fd = new FormData();
        if (params) {
            for (const key in params) {
                fd.append(key, params[key]);
            }
        }
        const response = await fetch
            .post(`${this.url}/queryForList`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
        if (response && response.status === 200 && response.data) {
            runInAction(() => {
                this.list = response.data.results;
                this.opt = "add";
            });
            return response.data;
        }
    }
    @action setSaveParams = (key, value) => {
        const {...p} = this.saveParams;
        p[key] = value;
        this.saveParams = p;
        if (value === "new") {
            const ywresult = {};
            const {...v} = this.editRecord;
            ywresult.bgqx = "";
            ywresult.nde = "";
            ywresult.ndb = "";
            this.editRecord = {...v, ...ywresult};
            this.opt = "add";
            this.jczt = false;
        } else {
            const params = {id: value};
            fetch.get(`/api/eps/control/main/gsyjsqd/queryForId`, {params}).then(gszxyjsqd => {
                const {...v} = this.editRecord;
                this.editRecord = {...v, ...gszxyjsqd.data};
                this.opt = "edit";
                if (gszxyjsqd.data?.jczt === "Y") {
                    fetch.get(`/api/api/sxjcjgz/sxjcjgxq?jcbc=`+this.editRecord.id, {}).then(sxjcjgxq => {
                        const ywresult = {};
                        const {...v} = this.editRecord;
                        ywresult.zsx = sxjcjgxq.data.zsx;
                        ywresult.wzx =  sxjcjgxq.data.wzx;
                        ywresult.kyx = sxjcjgxq.data.kyx;
                        ywresult.aqx =  sxjcjgxq.data.kkx;
                        this.editRecord = {...v, ...ywresult};
                    });
                }
            })
        }
    }
}


export default new XZxyjStore('/api/eps/control/main/gsyjsqd', true, true);
