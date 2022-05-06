import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import qs from 'qs';
import UserService from '../../services/user/UserService';
import UserroleService from '../../services/user/UserroleService';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import util from '../../utils/util';
import SysStore from '../system/SysStore';

class ParamsManageStore {
  url = '';
  wfenable = false;
  oldver = true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
  }

  @observable usModalVisible = false;
  @observable userData = [];
  @observable userroleIds = [];
  @observable roleQyrq = moment();
  @observable list = [];
  @observable paramList = [];
  @observable total = '';

  @observable sortField = '';
  @observable sortOrder = '';

  @observable code = '';
  @observable name = '';
  //借阅车
  @observable jycCode = 'DALYF006';
  //协查单
  @observable xcdCode = 'DALYF007';
  //利用大厅
  @observable lydtCode = 'DALYF008';

  // 登录首页配置
  @observable rolePageCode = 'CONTROLROLE001';

  @observable homePageCode = 'CONTROLSY001';

  passwordModeCode = 'CONTROLSY019';

  @observable autoRunCode = 'AUTORUN';

  @observable XTPTXSMC = 'XTPTXSMC';

  @observable dwid = SysStore.getCurrentCmp().id;
  @observable yhid = SysStore.getCurrentUser().id;

  @observable jycStatus = '';
  @observable xcdStatus = '';
  @observable lydtStatus = '';
  @observable codeValue = {};
  @observable paramValue = {};

  @action setDw = (dw) => {
    this.dwid = dw;
  };

  /**
   * 系统配置窗口
   */
  @observable system_visible = false;

  @action queryList = async () => {
    this.list = await this.findAll({});
  };
  @action showUsDailog = async (visible) => {
    this.usModalVisible = visible;
    if (visible) {
      this.userData = await UserService.findAll({});
      const userroles = await UserroleService.findByRoleId(
        this.selectRowRecords[0].id,
      );
      this.userroleIds = userroles ? userroles.map((r) => r.id) : [];
    }
  };

  @action setSelectId = async (selectid) => {
    this.selectid = selectid;
  };

  @action setSelectedRow = async (selectedRow) => {
    this.selectedRow = selectedRow;
  };

  @action reSetroleData = (values) => {
    this.userroleIds = values;
  };

  @action saveUserrole = async () => {
    await UserroleService.updateByRoleId(
      this.selectRowRecords[0].id,
      this.userroleIds
        ? this.userroleIds.map((r) => ({
            roleId: this.selectRowRecords[0].id,
            userId: r,
          }))
        : [],
    );
  };

  @action queryParamsForPage = async () => {
    const response = await fetch.post(`${this.url}/queryForPage`, this.params, {
      params: {
        page: this.pageno - 1,
        pageSize: this.pagesize,
        limit: this.pagesize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        pageIndex: this.pageno,
        ...this.params,
      },
    });
    if (response.status === 200) {
      // runInAction(() => {
      this.total = response.data.total;
      var sjData = [];
      if (this.total > 0) {
        for (var i = 0; i < response.data.results.length; i++) {
          var newKey = {};
          newKey = response.data.results[i];
          newKey.key = newKey.code;
          if ((newKey.lx = 'F')) {
            newKey.clx = '功能参数';
          }
          if ((newKey.lx = 'S')) {
            newKey.clx = '系统参数';
          }
          if ((newKey.qslx = 'S')) {
            newKey.cqslx = '单选';
          }
          if ((newKey.qslx = 'N')) {
            newKey.cqslx = '数值';
          }
          if ((newKey.qslx = 'C')) {
            newKey.cqslx = '字符';
          }
          sjData.push(newKey);
        }
      }
      this.paramList = sjData;
      return;
      // });
    }
  };

  /**
   * 根据params中的code查询利用大厅是否启用状态
   */
  @action queryLydtByCode = async () => {
    const res = await fetch.get(
      `${this.url}/getUserOption?code=${this.lydtCode}&yhid=${this.yhid}`,
    );
    //runInAction(() => {
    this.lydtStatus = res.data;
    //});
  };

  /**
   * 根据params中的code查询借阅车是否启用状态
   */
  @action queryJycByCode = async () => {
    const res = await fetch.get(
      `${this.url}/getUserOption?code=${this.jycCode}&yhid=${this.yhid}`,
    );
    // runInAction(() => {
    this.jycStatus = res.data;
    // });
  };

  /**
   * 根据params中的code查询协查单是否启用状态
   */
  @action queryXcdByCode = async () => {
    const res = await fetch.get(
      `${this.url}/getUserOption?code=${this.xcdCode}&yhid=${this.yhid}`,
    );
    // runInAction(() => {
    this.xcdStatus = res.data;
    // });
  };

  findByCode(code) {
    return new Promise((resolve, reject) => {
      fetch
        .get(`${this.url}/queryForId?${qs.stringify({ code })}`)
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        })
        .catch((err) => {
          reject(
            util.bussinessException(err.response.status, err.response.data),
          );
        });
    });
  }

  @action findParamsValueById = async (code) => {
    const res = await fetch.get(
      `${this.url}/queryParamsValueById?pcode=${code}`,
    );
    this.codeValue = res.data || {};
  };

  @action findParamsByCode = async (code) => {
    const res = await fetch.get(`${this.url}/queryForKeyByCode?code=${code}`);
    this.paramValue = res.data || {};
  };
}

export default new ParamsManageStore(
  '/api/eps/control/main/params',
  false,
  true,
);
