import {action, observable, runInAction} from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import SysStore from "@/stores/system/SysStore";
import moment from 'moment';
const dakurl = "/api/eps/control/main/dak/queryTreeReact";

class HoldingstatiStore extends BaseStore {

    @observable dakbmclist = [];
    @observable seardataSource = [];
    @observable dakid = "";
    @observable dwlist = [];
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
    @action setSearDatasous = (dataSource) => {
        this.seardataSource = dataSource;
    }
    @action queryDwlist = async (value) => {
        const params = {
            dwmc: value,
        };
        const list = await fetch
            .get(`eps/control/main/dw/queryForList`, {params});
        this.dwlist = list.data;
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

            const params = this.params;
            const response = await fetch
                .get(`${this.url}${this.queryForPageUrl || "/queryGsForList"}`, {params});
            if (response && response.status === 200) {
                runInAction(() => {
                    this.data = this.afterQueryData(response.data || []);
                    console.log(this.data);
                    this.loading = false;
                });
            } else {
                runInAction(() => {
                    this.data = [];
                    this.loading = false;
                });
            }
        }
    }


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
    //导出Excel
    @action downloadExcel = async (records) => {

        const excel = '.xlsx';
        fetch.post("/api/eps/control/main/holdinggroup/exportExcel", records, { responseType: 'blob' }).then(response => {
            if (response.status === 200) {
                runInAction(() => {
                    const data = response.data;
                    if (!data) {
                        Message.error('导出EXCEL失败！');
                    } else {
                        const url = window.URL.createObjectURL(new Blob([data]));
                        const link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = url;
                        link.setAttribute('download', `馆藏档案统计_ ${moment().format('YYYY-MM-DD')}${excel}`);
                        document.body.appendChild(link);
                        link.click();
                    }
                });
            }
        });
    }
}

export default new HoldingstatiStore('/api/eps/control/main/basetj');
