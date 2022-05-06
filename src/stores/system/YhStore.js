import { observable, action, runInAction, makeObservable } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import React from 'react';
import SysStore from '../system/SysStore';
import { message } from 'antd';

const dwUrl = '/api/eps/control/main/dw/queryForListByYhid';
const yhLxUrl =
  '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?bh=YHLX001&&yhlx=Y';
const gwUrl = '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?bh=YHGW001';
const mjUrl = '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?bh=060';
const zjurl = '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?bh=YHZJ';
const orgurl = '/api/eps/control/main/org/queryForList';

class YhStore {
  url = '';
  wfenable = false;
  oldver = true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
  }

  @observable dwDataSource = [];
  @observable lxDataSource = [];
  @observable gwDataSource = [];
  @observable mjDataSource = [];
  @observable zjDataSource = [];
  @observable orgDataSource = [];
  @observable roleDataSource = [];
  @observable yhByRoleDataSource = [];
  @observable yhByRoleDataTotal = 0;
  @observable mkbh = '';
  @observable total = '';
  @observable roleVisible = false;
  @observable updatPwdVisible = false;
  @observable selectid = '';
  @observable selectedRow = {};
  @observable bh = '';
  @observable yhmc = '';
  @observable bmid = '';
  @observable lx = '';
  @observable dwid = '';
  @observable dwstatus = true;
  @observable treeDwid = '';
  @observable roleColumns = [];

  @observable page_No = 1;
  @observable page_Size = 20;

  //begin
  /**
   * 根据角色查询所需的参数
   * @param {*} values
   */

  //当前获取的角色ID
  @observable role_Ids = [];
  //全部
  @observable syry = 'N';
  //已配置
  @observable yfp = 'Y';
  //默认当前用户所在单位
  @observable dw_id = SysStore.getCurrentCmp().id;
  //部门ID
  @observable bm_id = '';
  //用户编码
  @observable yh_code = '';
  //用户名称
  @observable yh_name = '';

  @observable dwTreeData = [];

  @observable userOption16 = '';
  @observable userOption17 = '';
  @observable userOption18 = '';

  //end

  @action getUserOption16 = async (values) => {
    this.loading = true;
    const response = await fetch.post(
      '/api/eps/control/main/params/getUserOption',
      {
        code: 'CONTROLS016',
        gnid: 'CONTROL0003',
        yhid: SysStore.currentUser.id,
      },
    );
    if (response && response.status === 200) {
      this.userOption16 = response;
    } else {
      this.loading = true;
    }
  };

  @action getUserOption17 = async (values) => {
    this.loading = true;
    const response = await fetch.post(
      '/api/eps/control/main/params/getUserOption',
      {
        code: 'CONTROLS017',
        gnid: 'CONTROL0003',
        yhid: SysStore.currentUser.id,
      },
    );
    if (response && response.status === 200) {
      this.userOption17 = response;
    } else {
      this.loading = true;
    }
  };

  @action getUserOption18 = async () => {
    this.loading = true;
    const response = await fetch.post(
      '/api/eps/control/main/params/getUserOption',
      {
        code: 'CONTROLS018',
        gnid: 'CONTROL0003',
        yhid: SysStore.currentUser.id,
      },
    );
    if (response && response.status === 200) {
      this.userOption18 = response;
    } else {
      this.loading = true;
    }
  };

  @action changepassword = async (values) => {
    this.loading = true;
    //参数  密码传递加密
    var pwdResult = window.btoa(values.pwd);
    debugger;
    // var pwdResult=values.pwd;
    let url =
      '/api/eps/control/main/yh/changepassword?yhid=' +
      values.id +
      '&btoaPassword=' +
      pwdResult +
      '&yhmc=' +
      values.yhmc;

    const response = await fetch.post(url);

    if (response && response.status === 200) {
      if (response.data.success == false) {
        message.error(`修改密码失败!` + response.data.message);
      } else {
        message.success(`修改密码成功!`);
        this.updatPwdVisible = false;
        //   this.afterDeleteData();
      }
      this.loading = false;
    } else {
      this.loading = true;
    }
  };

  @action resepassword = async (record) => {
    this.loading = true;
    const url = '/api/eps/control/main/yh/resepassword';

    const fd = new FormData();
    fd.append('mm', '888');
    for (const key in record) {
      if (key === 'mm') {
        fd.append(key, '888');
      } else {
        fd.append(key, record[key]);
      }
    }
    const response = await fetch.post(url, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });

    if (response && response.status === 200 && response.data) {
      //        runInAction(() => {
      if (response.data.success == false) {
        message.error(`密码重置失败!`);
      } else {
        message.success(`密码重置成功!密码为：888`);
        //   this.afterDeleteData();
      }

      //        });
      this.loading = false;
    } else {
      this.loading = true;
    }
  };

  @action updateJc = async (record) => {
    this.loading = true;
    const url = '/api/eps/control/main/yh/updateJc';

    const fd = new FormData();
    for (const key in record) {
      if (key === 'cwcs') {
        fd.append(key, 0);
      } else {
        fd.append(key, record[key]);
      }
    }
    const response = await fetch.post(url, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });

    if (response && response.status === 200 && response.data) {
      //      runInAction(() => {
      if (response.data.success == false) {
        message.error(`解除锁定失败!`);
        //      this.openNotification('解除锁定失败', 'warning');
      } else {
        message.success(`解除锁定成功!`);
        //        this.openNotification('解除锁定成功', 'warning');
        this.afterDeleteData();
      }

      //       });
      this.loading = false;
    } else {
      this.loading = true;
    }
  };

  @action setRoleColumns = (roleColumns) => {
    runInAction(() => {
      this.roleColumns = roleColumns;
    });
  };

  @action showRoleForm = (record) => {
    this.roleVisible = true;
    this.editRecord = this.beforeSetEditRecord(record);
    if (record && record.id) {
      this.queryRole(record);
    }
  };
  @action showUpdatePwdForm = (opt, record) => {
    this.opt = opt;
    this.updatPwdVisible = true;

    this.editRecord = this.beforeSetEditRecord(record);

    console.log('aaaaa=' + this.editRecord);
  };

  @action queryRole = async (record) => {
    this.loading = true;

    if (record && record.id) {
      const url =
        '/api/eps/control/main/yhrole/queryForListByByYhId?yhid=' + record.id;
      const res = await fetch.post(url);
      if (res && res.status === 200) {
        this.roleDataSource = res.data;
        this.loading = false;
      } else {
        this.loading = true;
      }
    }
  };

  @action setDwstatus = async (dwstatus) => {
    this.dwstatus = dwstatus;
  };

  @action setTreeDwid = async (treeDwid) => {
    this.treeDwid = treeDwid;
  };

  @action setMkbh = async (mkbh) => {
    this.mkbh = mkbh;
  };

  @action setDwid = async (dwid) => {
    this.dwid = dwid;
  };

  @action setSelectId = async (selectid) => {
    this.selectid = selectid;
  };

  @action setSelectedRow = async (selectedRow) => {
    this.selectedRow = selectedRow;
  };

  @action queryOrg = async (tdwid) => {
    console.log('dwid===' + SysStore.currentUser.dwid);
    console.log('dwid1===' + SysStore.getCurrentCmp().id);

    this.loading = true;
    let did = '';
    if (tdwid) {
      did = tdwid;
    } else {
      this.dwid = {
        id: SysStore.getCurrentCmp().id,
        mc: SysStore.getCurrentCmp().dwname,
      };
      did = SysStore.getCurrentCmp().id;
    }

    const url = orgurl + '?dwid=' + did;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      this.orgDataSource = response.data.map((o) => ({
        id: o.id,
        label: o.name,
        value: o.id,
      }));
      this.loading = false;
    } else {
      this.loading = true;
    }
  };

  @action queryYhZj = async () => {
    this.loading = true;
    const url = zjurl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      this.zjDataSource = response.data.map((o) => ({
        id: o.bh,
        label: o.mc,
        value: o.bh,
      }));
      this.loading = false;
    } else {
      this.loading = true;
    }
  };

  /**
   * 根据角色查询用户
   */
  @action queryYhByRole = async () => {
    if (this.yfp != 'null') {
      this.loading = true;
      const response = await fetch.post(
        `/api/eps/control/main/yhrole/queryByRole`,
        this.params,
        {
          params: {
            page: this.page_No - 1,
            pageSize: this.page_Size,
            pageIndex: this.page_No - 1,
            limit: this.page_Size,
            roleid: this.role_Ids,
            dwid: this.dw_id,
            syry: 'N',
            yfp: this.yfp,
            bmid: this.bm_id,
            yhcode: this.yh_code,
            yhname: this.yh_name,
            ...this.params,
          },
        },
      );
      if (response && response.status === 200) {
        //              runInAction(() => {
        this.yhByRoleDataTotal = response.data.total;
        this.yhByRoleDataSource = response.data.results;
        this.loading = false;

        //             });
      }
    } else {
      this.loading = true;
      const response = await fetch.post(
        `/api/eps/control/main/yhrole/queryByRole`,
        this.params,
        {
          params: {
            page: this.page_No - 1,
            pageSize: this.page_Size,
            pageIndex: this.page_No - 1,
            limit: this.page_Size,
            roleid: this.role_Ids,
            dwid: this.dw_id,
            syry: 'N',
            bmid: this.bm_id,
            yhcode: this.yh_code,
            yhname: this.yh_name,
            ...this.params,
          },
        },
      );

      if (response && response.status === 200) {
        //             runInAction(() => {
        this.yhByRoleDataTotal = response.data.total;
        this.yhByRoleDataSource = response.data.results;
        this.loading = false;

        //             });
      }
    }
  };

  @action queryYhMj = async () => {
    this.loading = true;
    const url = mjUrl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      this.mjDataSource = response.data.map((o) => ({
        id: o.mc,
        label: o.mc,
        value: o.mc,
      }));
      this.loading = false;
    } else {
      this.loading = true;
    }
  };

  @action queryGw = async () => {
    this.loading = true;
    const url = gwUrl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      this.gwDataSource = response.data.map((o) => ({
        id: o.mc,
        label: o.mc,
        value: o.mc,
      }));
      this.loading = false;
    } else {
      this.loading = true;
    }
  };

  @action queryYhLx = async () => {
    this.loading = true;
    const url = yhLxUrl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      this.lxDataSource = response.data.map((o) => ({
        id: o.bh,
        label: o.mc,
        value: o.bh,
      }));
      this.loading = false;
    } else {
      this.loading = true;
    }
  };

  @action queryTreeDwList = async () => {
    this.loading = true;
    const response = await fetch.get(
      `/api/eps/control/main/dw/queryForListByYhid_ReactTree`,
    );
    if (response.status === 200) {
      var sjData = [];
      if (response.data.length > 0) {
        for (var i = 0; i < response.data.length; i++) {
          let newKey = {};
          newKey = response.data[i];
          newKey.key = newKey.id;
          newKey.title = newKey.mc;
          newKey.value = newKey.id;
          sjData.push(newKey);
        }
        this.dwTreeData = sjData;
      }
      console.log('dwTreeData', this.dwTreeData);
      this.loading = false;
    }
  };

  @action queryDwTree = async () => {
    this.loading = true;

    const url = dwUrl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      this.dwDataSource = response.data.map((o) => ({
        id: o.id,
        title: o.mc,
        key: o.id,
        value: o.id,
      }));
      this.loading = false;
    } else {
      this.loading = true;
    }
  };

  @action queryDw = async () => {
    this.loading = true;
    let url = '';

    if (SysStore.currentUser.golbalrole != 'SYSROLE01') {
      url = '/api/eps/control/main/dw/queryForListByYhid';
    } else {
      url = '/api/eps/control/main/dw/queryForList';
    }
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      this.dwDataSource = response.data.map((o) => ({
        id: o.id,
        label: o.mc,
        value: o.id,
      }));
      this.loading = false;
    } else {
      this.loading = true;
    }
  };

  queryForPage = async () => {
    this.loading = true;
    let did = '';

    if (this.treeDwid) {
      did = this.treeDwid;
    } else if (this.dwid) {
      did = this.dwid.id;
    } else {
      this.dwid = {
        id: SysStore.currentUser.dwid,
        mc: SysStore.currentUser.dwmc,
      };
      did = SysStore.currentUser.dwid;
    }

    const response = await fetch.post(`${this.url}/queryForPage`, this.params, {
      params: {
        page: this.pageno - 1,
        pagesize: this.pagesize,
        limit: this.pagesize,
        dwid: did,
        syry: 'N',
        ykyhlx: 'Y',
        ...this.params,
      },
    });
    if (response && response.status === 200) {
      //  runInAction(() => {
      this.total = response.data.total;
      let totals = response.data.total;

      var sjData = [];
      if (totals > 0) {
        for (var i = 0; i < response.data.results.length; i++) {
          var newKey = {};
          newKey = response.data.results[i];
          newKey.key = newKey.id;

          if (newKey.ty == 'Y') {
            newKey.tyboolean = true;
            newKey.tymc = '停用';
          } else {
            newKey.tyboolean = false;
            newKey.tymc = '启用';
          }
          if (newKey.xb == '1') {
            newKey.xbmc = '男';
          } else if (newKey.xb == '2') {
            newKey.xbmc = '女';
          } else {
            newKey.xbmc = '未知';
          }

          sjData.push(newKey);
        }
      }
      this.data = sjData;
      this.loading = false;
      //  });
    } else {
      this.loading = true;
    }
  };
}

export default new YhStore('/api/eps/control/main/yh');
