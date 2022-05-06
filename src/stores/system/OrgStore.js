import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import SysStore from '../system/SysStore';


class OrgStore {
    url = "";
    wfenable = false;
    oldver = true;
    constructor(url, wfenable, oldver = true) {
        this.url = url;
        this.wfenable = wfenable;
        this.oldver = oldver;

    }
    /**
 * 获取当前用户名称
 */
    @observable yhmc = SysStore.getCurrentUser().yhmc

    /**
     * 获取当前用户ID
     */
    @observable yhid = SysStore.getCurrentUser().id

    /**
     * 获取当前用户所在单位ID
     */
    @observable dw_id = SysStore.getCurrentCmp().id

    /**
     * 获取的org数据
     */
    @observable orgData = [];

    @observable orgLxDataSource = [];

     @observable orgYhData = [];

      @observable orgYhNoData = [];

    @action queryDwOrgTree = async (values) => {
        //  if (!this.orgData||this.orgData.length===0) {
        const response = await fetch.get(`/api/eps/control/main/org/queryDwOrgTreeAntD?dwid=${this.dw_id}&pageIndex=${this.pageno}&pageSize=${this.pagesize}`);
        if (response.status === 200) {
            //   runInAction(() => {
            this.orgData = response.data;
            return;
            //  });
        }
        //}

    }

    @action queryOrgLx = async () => {

        this.loading = true;
        const url = "/api/eps/control/main/orglx/queryForList";
        const response = await fetch
            .post(url);
        if (response && response.status === 200) {

            this.orgLxDataSource = response.data.map(o => ({ 'id': o.id, 'label': o.name, 'value': o.id }));
            this.loading = false;
        } else {
            this.loading = true;
        }
    }

    @action queryOrgYh = async (dwid) => {

        this.loading = true;
        const url = "/api/eps/control/main/org/queryOrgYh";

        const response = await fetch.post(url, this.params, {
        params: {
          page: this.page_No - 1,
          pageSize: this.page_Size,
          pageIndex: this.page_No - 1,
          limit: 10,
          orgid: dwid,
          dqyhlx: SysStore.currentUser.lx,
          ...this.params,
        },
      });

        if (response && response.status === 200) {

            this.orgYhData = response.data;
            this.loading = false;
        } else {
            this.loading = true;
        }
    }

     @action queryNoOrgYh = async (dwid) => {

        this.loading = true;
        const url = "/api/eps/control/main/org/queryNoOrgYh";
        const response = await fetch
            .post(url, this.params, {
        params: {
          page: this.page_No - 1,
          pageSize: this.page_Size,
          pageIndex: this.page_No - 1,
          limit: 10,
          orgid: dwid,
          dqyhlx: SysStore.currentUser.lx,
          ...this.params,
        },
      });
        if (response && response.status === 200) {

            this.orgYhNoData = response.data;
            this.loading = false;
        } else {
            this.loading = true;
        }
    }
}

export default new OrgStore('/api/eps/control/main/org');
