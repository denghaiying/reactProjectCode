import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import fetch from '../../utils/fetch';
import BaseStore from '../BaseStore';
import SysStore from '@/stores/system/SysStore';
import { message } from 'antd';
import HttpRequest from "@/eps/commons/v2/HttpRequest";
import moment from 'moment';
class NewDajyStore extends BaseStore {
  // 全局变量,默认取类型第一个值放置页面搜索下拉框用来回显
  @observable defaultData = {};
  // 单位列表
  @observable dwdata = [];
  // 档案库列表
  @observable dakdata = [];
  // 部门列表
  @observable bmdata = [];

  @observable lxdataSource = [];

  @observable stlqlx = [];

  @observable stghlx = [];

  @observable stcklx = [];

  @observable strklx = [];

  @observable jydmxSpzt = [];

  @observable selectlqlx = '1';

  @observable selectghlx = '2';

  @observable selectcklx = '0';

  @observable selectrklx = '9';

  @observable getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  //档案馆室移交查询列表
  @observable dayjcxdata = [];
  //默认当前用户所在单位
  @observable dw_id = SysStore.getCurrentCmp().id;
  //获取当前默认用户的角色
  @observable roleCode = SysStore.getCurrentUser().golbalrole;
  //领取说明
  @observable lqsm = '';
  //归还说明
  @observable ghsm = '';

  //部门单位
  @observable org_dw_id = SysStore.getCurrentCmp().id;
  //部门数据
  @observable orgData = [];
  //部门ID
  @observable bm_id = '';
  @observable lymdData = [];
  @observable lymdDataSelect = [];

  //行复选框
  @observable hangData = []; 

  // 获取单位列表
  @action findDw = async () => {
    const response = await fetch.get(
      `/api/eps/control/main/dw/queryForListByYhid_ReactTree`,
    );
    if (response.status === 200) {
      runInAction(() => {
        var sjData = [];
        if (response.data.length > 0) {
          for (var i = 0; i < response.data.length; i++) {
            let newKey = {};
            newKey = response.data[i];
            newKey.key = newKey.id;
            newKey.title = newKey.mc;
            sjData.push(newKey);
          }
          this.dwTreeData = sjData;
        }
      });
    }
  };

  @observable detailData = [];

  // 获取明细详情
  @action findByDetailFid = async (fid, wpid, dakid, jylx) => {
    const response = await fetch.get(
      `/api/eps/control/main/jydcx/queryDetailForPage?page=0&limit=50&fid=${fid}&wpid=${wpid}&dakid=${dakid}&jylx=${jylx}`,
    );
    debugger;
    if (response.status === 200) {
      runInAction(() => {
        this.detailData = response.data.results;
      });
    }
  };

  // 查询所有部门列表
  @action findBm = async () => {
    const response = await fetch.post(
      `/api/eps/control/main/org/queryForList9_1?dwid=${this.org_dw_id}`,
    );
    if (response && response.status === 200) {
      runInAction(() => {
        var sjData = [];
        if (response.data.length > 0) {
          for (var i = 0; i < response.data.length; i++) {
            let newKey = {};
            newKey = response.data[i];
            newKey.value = newKey.title;
            sjData.push(newKey);
          }
          this.orgData = sjData;
        }
      });
    }
  };

  // 查询所有利用目的
  @action querySjzdByLymd = async () => {
    const fd = new FormData();
    fd.append('zdx', '借阅目的');
    const response = await fetch.post(
      `/api/eps/control/main/dalydj/querySjzd`,
      fd,
    );
    if (response && response.status === 200) {
      runInAction(() => {
        this.lymdData = response.data.results;
        var sjData = [];
        for (var i = 0; i < response.data.results.length; i++) {
          let newKey = {};
          newKey = response.data.results[i];
          newKey.key = newKey.bh;
          newKey.value = newKey.bh;
          newKey.label = newKey.mc;
          sjData.push(newKey);
        }
        this.lymdDataSelect = sjData;
      });
    }
  };
  // 效果反馈
  @action updateXgfk = async (values) => {
    const fd = new FormData();
    fd.append('xgfk', values.xgfk);
    fd.append('dajz', values.dajz);
    fd.append('id', values.id);
    const response = await fetch.post(
      `/api/eps/control/main/jydcx/updateXgfk`,
      fd,
    );
    if (response && response.status === 200) {
    }
  };

  //新增协查单申请
  @action addXcdApply = async (data) => {
    debugger;
    data['ck'] = data.opetionGroup && data.opetionGroup.indexOf("查看") < 0 ? 'N' : 'Y';
    data['dy'] = data.opetionGroup && data.opetionGroup.indexOf("打印") < 0 ? 'N' : 'Y';
    data['xz'] = data.opetionGroup && data.opetionGroup.indexOf("下载") < 0 ? 'N' : 'Y';
    data['sjh'] = data.sjh === undefined ? null : data.sjh;
    data['yx'] = data.yx === undefined ? null : data.yx;
    delete data.opetionGroup
    const response = await new HttpRequest('').post({ url: `/api/eps/control/main/daxc9/add`, params: data });
    this.visible = false;
    console.log("response",response)
    if (response.status == 200) {
      message.success('创建协查申请成功!')
    } else {
      message.error('抱歉,创建协查申请失败!')
    }
  };



  // 出库修改状态
  @action updateJydMxSpztByJydIdAndZero = async (values) => {
    debugger;
    const fd = new FormData();
    fd.append('spzt', values.spzt);
    fd.append('jydid', values.id);
    const response = await fetch.post(
      `/api/eps/control/main/jydcx/updateJydMxSpztByJydIdAndZero`, fd, );
    if (response && response.status === 200) {
    }
  };

  // 入库修改状态
  @action updateJydMxSpztByJydIdAndOne = async (values) => {
    debugger;
    const fd = new FormData();
    fd.append('spzt', values.spzt);
    fd.append('jydid', values.id);
    const response = await fetch.post(
      `/api/eps/control/main/jydcx/updateJydMxSpztByJydIdAndOne`,
      fd,
    );
    if (response && response.status === 200) {
    }
  };

  @observable stlqghspzt = '';
  @observable stlqghop = '';
  @observable stlqghdazt = '';

  // 实体领取
  @action updateStlq = async (values, note) => {
    const response = await fetch.all(values.map(o => {
      const fd = new FormData();
      fd.append('id', o.id);
      fd.append('tmid', o.tmid);
      fd.append('dakid', o.dakid);
      fd.append('spzt', "2"); //当前状态是1
      fd.append('op', '实体领取');
      fd.append('dazt', '领取待归还');
      fd.append('lqsm', note);
      fd.append('lqsj', moment().format('YYYY-MM-DD HH:mm:ss'));
      return fetch.post(`/api/eps/control/main/jydcx/lqgh`, fd);
    }));
    if (response && response.filter(o => o && o.status === 200).length > 0) {
      message.success('操作成功!');
    } else {
      message.error("操作失败，请联系管理员");
    }
  };
 // 实体归还
  @action updateStqh = async (values, note) => {
    const response = await fetch.all(values.map(o => {
      const fd = new FormData();
      fd.append('id', o.id);
      fd.append('tmid', o.tmid);
      fd.append('dakid', o.dakid);
      fd.append('spzt', "3"); //当前状态是1
      fd.append('op', '实体归还');
      fd.append('dazt', '归还待入库');
      fd.append('lqsm', note);
      fd.append('ghsj', moment().format('YYYY-MM-DD HH:mm:ss'));
      return fetch.post(`/api/eps/control/main/jydcx/lqgh`, fd);
    }));
    if (response && response.filter(o => o && o.status === 200).length > 0) {
      message.success('操作成功!');
    } else {
      message.error("操作失败，请联系管理员");
    }
  };

  // 实体出库
  @action updateStck = async (values) => {
    const fd = new FormData();
    fd.append('id', values.id);
    fd.append('tmid', values.tmid);
    fd.append('dakid', values.dakid);
    fd.append('bmc', 'JYDMX');
    fd.append('spzt', this.stlqghspzt);
    fd.append('op', this.stlqghop);
    fd.append('dazt', this.stlqghdazt);
    fd.append('lqsm', this.lqsm);
    fd.append('lqsj', this.getDate);
    const response = await fetch.post(`/api/eps/control/main/jydcx/ckrk`, fd);
    debugger;
    if (response && response.status === 200) {
      message.success('出库成功!');
    } else {
      message.error(response.data.message);
    }
  };

  // 实体入库
  @action updateStrk = async (values) => {
    const fd = new FormData();
    fd.append('id', values.id);
    fd.append('tmid', values.tmid);
    fd.append('dakid', values.dakid);
    fd.append('bmc', 'JYDMX');
    fd.append('spzt', this.stlqghspzt);
    fd.append('op', this.stlqghop);
    fd.append('dazt', this.stlqghdazt);
    fd.append('lqsm', this.lqsm);
    fd.append('lqsj', this.getDate);
    const response = await fetch.post(`/api/eps/control/main/jydcx/ckrk`, fd);
    debugger;
    if (response && response.status === 200) {
      message.success('入库成功!');
    } else {
      message.error(response.data.message);
    }
  };
  // 修改借阅单明细打印下载查看权限
  @action updateJydmx = async (values) => {
    let ck;
    let dy;
    let xz;
    if (values.mxck && values.mxck === true) {
      ck = 'Y';
    } else {
      ck = 'N';
    }
    if (values.mxdy && values.mxdy === true) {
      dy = 'Y';
    } else {
      dy = 'N';
    }
    if (values.mxxz && values.mxxz === true) {
      xz = 'Y';
    } else {
      xz = 'N';
    }
    const fd = new FormData();
    fd.append('id', values.id);
    fd.append('mxck', ck);
    fd.append('mxdy', dy);
    fd.append('mxxz', xz);
    const response = await fetch.post(
      `/api/eps/control/main/jydcx/updateJydmx`,
      fd,
    );
    if (response && response.status === 200) {
      message.success({ type: 'success', content: '修改成功!' });
    }
  };

  //根据名称获取数据字典明细
  @action querySjzdMc = async () => {
    const response = await fetch.post(
      `/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?mc=借阅单类型`,
    );
    if (response.status === 200) {
      this.lxdataSource = response.data.map((o) => ({
        id: o.id,
        label: o.mc,
        value: o.bh,
      }));
    }
  };

  //stlq的状态
  @action queryStlqZt = async () => {
    const response = await fetch.post(
      `/api/eps/control/main/jydcx/queryLqOrghTree?node=root&zt=stlq`,
    );
    if (response.status === 200) {
      this.stlqlx = response.data.map((o) => ({
        id: o.id,
        label: o.text,
        value: o.id,
      }));
    }
  };

  //stgh的状态
  @action queryStghZt = async () => {
    const response = await fetch.post(
      `/api/eps/control/main/jydcx/queryLqOrghTree?node=root&zt=stgh`,
    );
    if (response.status === 200) {
      this.stghlx = await response.data.map((o) => ({
        id: o.id,
        label: o.text,
        value: o.id,
      }));
    }
  };

  //stgh的状态
  @action queryStckZt = async () => {
    const response = await fetch.post(
      `/api/eps/control/main/jydcx/queryLqOrghTree?node=root&zt=stck`,
    );
    if (response.status === 200) {
      this.stcklx = await response.data.map((o) => ({
        id: o.id,
        label: o.text,
        value: o.id,
      }));
    }
  };

  //stgh的状态
  @action queryStrkZt = async () => {
    const response = await fetch.post(
      `/api/eps/control/main/jydcx/queryLqOrghTree?node=root&zt=strk`,
    );
    if (response.status === 200) {
      debugger;
      this.strklx = await response.data.map((o) => ({
        id: o.id,
        label: o.text,
        value: o.id,
      }));
    }
  };
  //查询审批状态
  @action queryJydmxForList = async (values) => {
    const fd = new FormData();
    fd.append('jydid', values.fid);
    fd.append('spzt', values.spzt);
    const response = await fetch.post(`/api/eps/control/main/jydcx/queryJydmxForList`, fd);
    debugger;
    if (response.status === 200) {
      this.jydmxSpzt = await response.data.results;
    }
  };




  // 修改借阅单明细打印下载查看权限
  @action updateJydmxs = async (values) => {
    let ck;
    let dy;
    let xz;
    if (values.mxck && values.mxck === true) {
      ck = 'Y';
    } else {
      ck = 'N';
    }
    if (values.mxdy && values.mxdy === true) {
      dy = 'Y';
    } else {
      dy = 'N';
    }
    if (values.mxxz && values.mxxz === true) {
      xz = 'Y';
    } else {
      xz = 'N';
    }
    const fd = new FormData();
    fd.append('id', values.id);
    fd.append('mxck', ck);
    fd.append('mxdy', dy);
    fd.append('mxxz', xz);
    fd.append('dzjy', 'Y');
    debugger;
    const response = await fetch.post(`/api/eps/control/main/jydcx/updateJydmxs_91`, fd);
    if (response && response.status === 200) {
      message.success({ type: 'success', content: '修改成功!' });
    }
  };


  // 修改协查单明细打印下载查看权限
  @action updateXcdmxs = async (values) => {
    let ck;
    let dy;
    let xz;
    let dzjy;
    let stjy;
    if (values.mxck && values.mxck === true) {
      ck = 'Y';
    } else {
      ck = 'N';
    }
    if (values.mxdy && values.mxdy === true) {
      dy = 'Y';
    } else {
      dy = 'N';
    }
    if (values.mxxz && values.mxxz === true) {
      xz = 'Y';
    } else {
      xz = 'N';
    }
    if (values.dzjy && values.dzjy === true) {
      dzjy = 'Y';
    } else {
      dzjy = 'N';
    }
    if (values.stjy && values.stjy === true) {
      stjy = 'Y';
    } else {
      stjy = 'N';
    }

    if (dzjy === 'N' && stjy === 'N') {
      message.error("请至少选择一种借阅类型")
      return;
    }
    const fd = new FormData();
    fd.append('id', values.id);
    fd.append('mxck', ck);
    fd.append('mxdy', dy);
    fd.append('mxxz', xz);
    fd.append('dzjy', dzjy);
    fd.append('stjy', stjy);
    debugger;
    if (values.dzjy == false && values.stjy == false) {
      message.error("请至少选择一种借阅类型")
    } else {
      const response = await fetch.post(`/api/eps/control/main/daxc9/updateXcdmxs_91`, fd);
      if (response && response.status === 200) {
        message.success({ type: 'success', content: '修改成功!' });
      }
    }
  };

  // 修改借阅单明细打印下载查看权限
  @action updateXcdmx = async (values) => {
    let ck;
    let dy;
    let xz;
    let dzjy;
    let stjy;
    if (values.mxck && values.mxck === true) {
      ck = 'Y';
    } else {
      ck = 'N';
    }
    if (values.mxdy && values.mxdy === true) {
      dy = 'Y';
    } else {
      dy = 'N';
    }
    if (values.mxxz && values.mxxz === true) {
      xz = 'Y';
    } else {
      xz = 'N';
    }
    if (values.dzjy && values.dzjy === true) {
      dzjy = 'Y';
    } else {
      dzjy = 'N';
    }
    if (values.stjy && values.stjy === true) {
      stjy = 'Y';
    } else {
      stjy = 'N';
    }
    const fd = new FormData();
    fd.append('id', values.id);
    fd.append('mxck', ck);
    fd.append('mxdy', dy);
    fd.append('mxxz', xz);
    fd.append('dzjy', dzjy);
    fd.append('stjy', stjy);
    if (values.dzjy == false && values.stjy == false) {
      message.error("请至少选择一种借阅类型")
    } else {
      const response = await fetch.post(
        `/api/eps/control/main/daxc9/updateXcdmx`,
        fd,
      );
      if (response && response.status === 200) {
        message.success({ type: 'success', content: '修改成功!' });
      }
    }
  };


}

export default new NewDajyStore('/api/eps/control/main/jydcx', true, true);
