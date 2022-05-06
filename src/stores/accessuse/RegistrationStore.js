import {action, observable, runInAction} from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import SysStore from "../system/SysStore";
import LoginStore from '../system/LoginStore';
import {Message} from "@alifd/next";
class RegistrationStore extends BaseStore {
    @observable showRegistPage = false;
    // 数据字典利用目的
    @observable lymd = [];
    // 数据字典证件
    @observable zj = [];
    // 数据字典利用方式
    @observable lyfs = [];
    //查档人base64照片
    @observable cdrbase64 = "";
    //被查档人base64照片
    @observable bcdrbase64 = "";
    //档案库树形
    @observable treeData = [];
    //djdid
    @observable djdid = "";
    //查档内容数量
    @observable cdnrnub = 0;
    //档案库著录项
    @observable dakKfields = [{
        title: "全宗号",
        dataIndex: "lsh",
        width: 100,
    },
        {
            title: "全宗名称",
            dataIndex: "cyrxm",
            width: 100
        }, {
            title: "档号",
            dataIndex: "zjmc",
            width: 100
        }, {
            title: "年度",
            dataIndex: "zjhm",
            width: 200
        }, {
            title: "题名",
            dataIndex: "jyrxz",
            width: 80
        }];
    //全文检索结果
    @observable esResult = [];
    //档案库id
    @observable checkdakid = "";
    @observable espageno = 1;
    @observable espagesize = 5;
    @observable esloading = false;
    //档案库id
    @observable dakmc = "";
    @observable searchvalue = "";
    @observable filedvaule = {};
    @observable bcdfiledvaule = {};

    @action setRegistPage = async (vaule) => {
        runInAction(() => {
            this.showRegistPage = vaule;
        });

    }

    @action queryCdnrNub = async (djdid) => {
        const params = {djdid: djdid}
        const idata = await fetch
            .get(`/api/eps/control/main/dalydj/queryForLydjtmmx`, {params});
        runInAction(() => {
            this.cdnrnub = idata.data.results.length;
        });

    }
    @action setCdnrNum = async (djdid) => {
        runInAction(() => {
            this.cdnrnub = 0;
        });

    }
    @action setDjdid = async (id) => {
        const idata = await fetch
            .get(`/api/eps/control/main/dalydj/byserqid`, {});
        runInAction(() => {
            if (typeof(id) == "undefined") {
                this.djdid = idata.data
            } else {
                this.djdid = id;
            }
        });

    }
    @action findSzjd = async () => {
        const params = {
            zdx: "借阅目的"
        };
        const lymddata = await fetch
            .get(`${this.url}/querySjzd`, {params});
        if (lymddata && lymddata.status === 200) {
            runInAction(() => {
                this.lymd = lymddata.data.results;
            });
        }
        params["zdx"] = "证件名称";
        const zjdata = await fetch
            .get(`${this.url}/querySjzd`, {params});
        if (zjdata && zjdata.status === 200) {
            runInAction(() => {
                this.zj = zjdata.data.results;
            });
        }
        params["zdx"] = "利用方式";
        const lyfsdata = await fetch
            .get(`${this.url}/querySjzd`, {params});
        if (zjdata && lyfsdata.status === 200) {
            runInAction(() => {
                this.lyfs = lyfsdata.data.results;
            });
        }
    }

    @action findDakList = async () => {
        const params = {
            isby: "N",
            noshowdw: "Y",
            node: "root",
            dw: SysStore.currentCmp.id,
            tmzt: "3",
            dayh: SysStore.currentUser.id
        };
        const daklist = await fetch
            .get(`eps/control/main/dak/queryTree`, {params});
        this.treeData = daklist.data;
        console.log(this.treeData);
    }

    @action queryForPage = async () => {
        this.loading = true;
        if (!this.oldver) {
            const response = await fetch
                .post(`${this.url}/queryForPage`, this.params, {
                    params: {
                        pageno: this.pageno,
                        pagesize: this.pagesize, ...this.params
                    }
                });
            if (response && response.status === 200) {
                runInAction(() => {
                    this.data = this.afterQueryData(response.data);
                    this.loading = false;
                });
            } else {
                this.loading = true;
            }
        } else {
            const fd = new FormData();
            fd.append('page', this.pageno - 1);
            fd.append('limit', this.pagesize);
            if (this.params) {
                for (const key in this.params) {
                    fd.append(key, this.params[key]);
                }
            }
            const response = await fetch
                .post(`${this.url}${this.queryForPageUrl || "/queryForPage"}`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
            if (response && response.status === 200 && response.data.success) {
                runInAction(() => {
                    this.data = this.afterQueryData(response.data);
                    this.loading = false;
                });
            } else {
                this.loading = true;
            }
        }
    }

    beforeSetEditRecord(value) {
        this.cdrbase64 = "";
        this.bcdrbase64="";
        this.esResult = "";
        this.checkdakid = "";
        this.searchvalue = "";
        this.espagesize = 5;
        this.espageno = 1;
        this.dakKfields = [{
            title: "全宗号",
            dataIndex: "lsh",
            width: 100,
        },
            {
                title: "全宗名称",
                dataIndex: "cyrxm",
                width: 100
            }, {
                title: "档号",
                dataIndex: "zjmc",
                width: 100
            }, {
                title: "年度",
                dataIndex: "zjhm",
                width: 200
            }, {
                title: "题名",
                dataIndex: "jyrxz",
                width: 80
            }];
        return value;
    }

    afterQueryData(data) {
        if (data.results && data.results.length > 0) {
            data.results.map((item) => {
                this.lymd.map((i) => {
                    if (item.lymd == i.id) {
                        item.lymd = i.mc;
                    }
                })
                this.zj.map((i) => {
                    if (item.zjmc == i.id) {
                        item.zjmc = i.mc;
                    }
                })
                if (item.jyrxz == "A") {
                    item.jyrxz = "个人";
                } else {
                    item.jyrxz = "单位"
                }
            })
        }
        return data;
    }

    @action showSfz = async () => {
        const sfzxx = await fetch
            .get(`${this.url}/ReadMsg`, {});
        this.filedvaule.zjhm = sfzxx.data.cardno;
        this.filedvaule.cyrxm = sfzxx.data.name;
        this.filedvaule.jtzz = sfzxx.data.address;
        runInAction(() => {
            this.cdrbase64 = "data:image/png;base64," + sfzxx.data.photobase64;
            this.bcdrbase64=sfzxx.data.photobase64;
        })
    }
    @action showCdrSfz = async () => {
        const sfzxx = await fetch
            .get(`${this.url}/ReadMsg`, {});
        this.bcdfiledvaule.wtrzjhm = sfzxx.data.cardno;
        this.bcdfiledvaule.wtrxm = sfzxx.data.name;
        this.bcdfiledvaule.wtrjjwz = sfzxx.data.address;

    }
    @action setBase64 = async (record) => {
        runInAction(() => {
            this.cdrbase64 = "data:image/png;base64," + record.zwxx;
            this.bcdrbase64= record.zwxx;
        })
    }

    @action setEsPageNo = async (pageno) => {
        this.espageno = pageno;
        await this.eqSearch(this.searchvalue);
    }
    @action setEsPageSize = async (pageSize) => {
        this.espagesize = pageSize;
        await this.queryForPage(this.searchvalue);
    }
    @action saveData = async (values) => {
        values = this.beforeSaveData(values);
        let response;
        if (!this.oldver) {
            if (this.opt === 'edit') {
                response = await fetch
                    .post(`${this.url}/update/`, values);
            } else {
                response = await fetch.post(`${this.url}/add`, values, {
                    params: {
                        pageno: this.pageno,
                        pagesize: this.pagesize, ...values
                    }
                });
            }
            if (response && response.status === 200) {

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
            if (this.opt === 'edit') {
                response = await fetch
                    .put(`${this.url}${this.updateUrl || "/update"}`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
            } else {
                response = await fetch.post(`${this.url}${this.addUrl || "/add"}`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
            }
            if (response && response.status === 200 && response.data) {
                runInAction(() => {
                    this.editVisible = false;
                    this.showRegistPage = false;
                    this.editRecord = this.beforeSetEditRecord(response.data.results);
                    if (this.wfenable) {
                        this.getProcOpt(this.editRecord);
                    }
                    this.afterSaveData(response.data.results);
                });
            }
        }

    }

    beforeSaveData(value) {
        value.zt = false;
        value.id = this.djdid;
        value.zwxx =  this.bcdrbase64;
        return value;
    }

    @action delete = async (obj) => {
        console.log(obj);
        if (!this.oldver) {
            const response = await fetch.delete(`${this.url}/${encodeURIComponent(obj)}`);
            if (response && response.status === 204) {
                this.afterDeleteData();
            }
        } else {
            const fd = new FormData();
            if (typeof obj === "string") {
                fd.append("id", obj);
            } else {
                for (const key in obj) {
                    fd.append(key, obj[key]);
                }
            }
            const response = await fetch.post(`${this.url}/delete?id=${obj}`, {
                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                data: fd
            });
            if (response && response.status === 200) {
                this.afterDeleteData();
            }
        }
    }
    @action onDakChanged = async (e, item) => {
        this.esResult = [];
        this.checkdakid = e[0];
        const dak = await fetch
            .get(`eps/control/main/dak/queryForId?id=` + e[0], {});
        this.dakmc = dak.data.mbc;
        const params = {
            dakid: e[0],
            lx: "3",
        };
        const kfields = await fetch
            .get(`eps/control/main/mbkzzlx/queryForList`, {params});
        const newkfields = [];
        kfields.data.map(item => {
            if (item.lbkj == "Y" && item.mc) {
                newkfields.push({title: item.ms, dataIndex: item.mc.toLowerCase(), width: item.mlkd, ellipsis: true});
            }
        });
        this.dakKfields = newkfields;
    }
    @action eqSearch = async (value) => {
        if (this.checkdakid == "") {
            Message.warning('请选择档案库!');
            return;
        }
        this.searchvalue = value;
        const params = {
            dakid: this.checkdakid,
            tmzt: "3",
            dwid: SysStore.currentCmp.id,
            dayh: LoginStore.userinfo.id,
            hszbz: "N",
            key: value,
            bmc: this.dakmc
        };
        const fd = new FormData();
        fd.append('page', this.espageno - 1);
        fd.append('limit', this.espagesize);
        if (params) {
            for (const key in params) {
                fd.append(key, params[key]);
            }
        }
        const response = await fetch
            .post(`eps/control/main/dagl/queryForPage`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
        if (response && response.status === 200 && response.data.success) {
            runInAction(() => {
                this.esResult = response.data;
                this.esloading = false;
            });
        } else {
            this.esloading = true;
        }
    }

    @action addDalydj = async (value) => {false
        const params = {
            tmid: value.id.replace("[", "").replace("]", ""),
            djdid: this.djdid
        };
        const result = await fetch
            .get(`eps/control/main/dalydj/queryForLydjtmmx`, {params});
        const isExsist = true;
        if (result.data.results.length > 0) {
            Message.warning('重复添加!');
            return;
        }
        const dak = await fetch
            .get(`eps/control/main/dak/queryForId?id=`+this.checkdakid, {});
        const mb = await fetch
            .get(`/api/eps/control/main/mbsz/queryForId?id=`+dak.data.mbid, {});
        const keyvalues = {
            bmc: this.dakmc,
            yhid: LoginStore.userinfo.id,
            dakid: this.checkdakid,
            ids: value.id.replace("[", "").replace("]", ""),
            djdid: this.djdid,
            dwid: SysStore.currentCmp.id,
            mblb:mb.data.lb
        };
        const fd = new FormData();
        if (keyvalues) {
            for (const key in keyvalues) {
                fd.append(key, keyvalues[key]);
            }
        }
        if (isExsist) {
            const aa = await fetch
                .post(`eps/control/main/daly/addLydts`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
            if (aa.data.success) {
                Message.success('添加成功!');
                this.queryCdnrNub(this.djdid)
            }

        }
    }
}

export default new RegistrationStore('/api/eps/control/main/dalydj');
