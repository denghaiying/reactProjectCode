import {action, observable, runInAction} from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import SysStore from "@/stores/system/SysStore";

const dakurl = "/api/eps/control/main/dak/queryTreeReact";

class AccussusetjStore extends BaseStore {


  url = "";
  wfenable = false;
  oldver = true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;

  }



    @observable data = {}
    @observable dakbmclist = [];
    @observable dakid = "";
    @observable slcount = 0;
    @action findlist = async () => {
        const dwid = SysStore.currentUser.dwid;
        const url = dakurl + "?dw=" + dwid;
        const response = await fetch.post(url);
        if (response && response.status === 200) {
            this.dakbmclist = response.data;
        }
    }
    @action setDakid = (dakid) => {
        this.dakid = dakid;
    }
    queryForPage = async () => {
        this.loading = true;
        console.log(this.params);
        if (!this.oldver) {
            const response = await fetch.post(`${this.url}/queryForPage`, this.params, {
                params: {
                    pageno: this.pageno,
                    pagesize: this.pagesize, ...this.params
                }
            });
            console.log(response);
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
            const format = "dd MMM yyy HH:mm:ss 'GMT'";
            const jsrqKey = await fetch
                .get(`eps/control/main/daly/getGmtDate?date=` + this.GMTToStr(this.params["jsrq"]) + `&format=` + format, {});
            const jsrq = jsrqKey.data.message;
            const ksrqKey = await fetch
                .get(`eps/control/main/daly/getGmtDate?date=` + this.GMTToStr(this.params["ksrq"]) + `&format=` + format, {});
            const ksrq = ksrqKey.data.message;
            fd.append("jsrq", jsrq);
            fd.append("ksrq", ksrq);
            const qnjsrqKey = await fetch
                .get(`eps/control/main/daly/getGmtDate?date=` + this.GMTQNToStr(this.params["jsrq"]) + `&format=` + format, {});
            const qnjsrq = qnjsrqKey.data.message;
            const qnksrqKey = await fetch
                .get(`eps/control/main/daly/getGmtDate?date=` + this.GMTQNToStr(this.params["ksrq"]) + `&format=` + format, {});
            const qnksrq = qnksrqKey.data.message;
            fd.append("qnjsrq", qnjsrq);
            fd.append("qnksrq", qnksrq);
            const response = await fetch
                .post(`${this.url}${this.queryForPageUrl || "/queryLydjlist"}`, fd, {headers: {'Content-type': 'application/x-www-form-urlencoded'}});
            if (response.status === 200) {
                runInAction(() => {
                    this.data = this.afterQueryData(response.data);
                    this.slcount = this.data.slcount;
                    console.log(this.slcount);
                    this.loading = false;
                });
            } else {
                this.loading = true;
            }
        }
    }

    GMTToStr(time) {
        const date = new Date(time)
        const Str = date.getFullYear() + '-' +
            (date.getMonth() + 1) + '-' +
            date.getDate() + ' ' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds()
        return Str;
    }

    GMTQNToStr(time) {
        const date = new Date(time)
        const Str = (date.getFullYear() - 1) + '-' +
            (date.getMonth() + 1) + '-' +
            date.getDate() + ' ' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds()
        return Str;
    }

    @action parserDate = async (date, format) => {
        const dataKey = await fetch
            .get(`eps/control/main/daly/getGmtDate?date=` + date + `&format=` + format, {});
        return dataKey.data.message;
    };

    beforeSaveData(value) {
        value.dakid = this.dakid;
        return value;
    }

    saveData = async (values) => {
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
                    this.editRecord = this.beforeSetEditRecord(response.data.results);
                    if (this.wfenable) {
                        this.getProcOpt(this.editRecord);
                    }
                    this.afterSaveData(response.data.results);
                });
            }
        }

    }

    beforeSetEditRecord(value) {
        this.dakid = "";
        return value;
    }

    delete = async (obj) => {
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
}

export default new AccussusetjStore('/api/eps/control/main/basetj');
