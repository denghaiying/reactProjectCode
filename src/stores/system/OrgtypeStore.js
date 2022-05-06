import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';


class OrgtypeStore extends BaseStore {
    @action queryForPage = async () => {
        this.loading = true;


        console.log(this.params);
        if (!this.oldver) {
            const response = await fetch
                .post(`${this.url}/queryForPage`, this.params, { params: { pageno: this.pageno, pagesize: this.pagesize, ...this.params } });
            if (response && response.status === 200) {
                runInAction(() => {
                    this.data = this.afterQueryData(response.data);
                    this.loading = false;
                });
            }
            else {
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
                .post(`${this.url}${this.queryForPageUrl || "/queryForPage"}`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
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

    @action saveData = async (values) => {
        values = this.beforeSaveData(values);
        let response;
        if (!this.oldver) {
            if (this.opt === 'edit') {
                response = await fetch
                    .post(`${this.url}/update/`, values);
            } else {
                response = await fetch.post(`${this.url}/add`, values,{ params: { pageno: this.pageno, pagesize: this.pagesize, ...values}});
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
                    .put(`${this.url}${this.updateUrl || "/update"}`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
            } else {
                response = await fetch.post(`${this.url}${this.addUrl || "/add"}`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
            }
            if (response && response.status === 200 && response.data) {
                runInAction(() => {
                    this.editVisible = false;
                    this.editRecord = this.beforeSetEditRecord(response.data.results);
                    if (this.wfenable) {
                        this.getProcOpt(this.editRecord);
                    }
                    this.afterSaveData(response.data.results);
                });
            }
        }

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
          const response = await fetch.post(`${this.url}/delete?id=${obj}`, { headers: { 'Content-type': 'application/x-www-form-urlencoded' }, data: fd });
          if (response && response.status === 200) {
            this.afterDeleteData();
          }
        }
      }
}

export default new OrgtypeStore('/api/eps/control/main/orglx');
