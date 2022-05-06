import { makeAutoObservable, runInAction } from 'mobx';
import { createHashHistory } from 'history';
import util from '@/utils/util';
import qs from 'qs';
import update from 'immutability-helper';
import menu from '@/locales/en-US/menu';

const userinfo = util.getLStorage('userinfo');
const pathname = util.getLStorage(`homePage-${window.btoa(userinfo.id)}`) || '';

class BaseLayouttStore {
  tabs: MenuNodeType[] = [
    {
      layout: false,
      locale: false,
      name: '首页',
      path: pathname.replaceAll('|', '%7C'),
      key: pathname.replaceAll('|', '%7C'),
      closable: false,
    },
  ];
  menuList = [];
  mkmc: string = '';
  currentMenuInfo: MenuNodeType = {};

  activeKey: string = pathname.replaceAll('|', '%7C');
  constructor() {
    makeAutoObservable(this);
  }
  addTab = (tab: MenuNodeType, activeKey: string, params) => {
    debugger;
    if (tab.openlx == '3') {
      window.open(tab.path.replace('/runRfunc/', ''));
      return;
    }
    runInAction(() => {
      if (this.tabs.findIndex((item) => item.key == activeKey) < 0) {
        if (params || tab.openlx != '5') {
          const result = update(tab, {
            path: {
              $set: `${tab.path}?${qs.stringify({
                ...params,
                name: tab.name,
              })}`,
            },
          });
          this.tabs.push(result);
        } else {
          this.tabs.push(tab);
        }
      }

      this.activeKey = activeKey;
      //  this.currentMenuInfo = tab;
    });
  };
  onChangeTab = (activeKey: string) => {
    runInAction(() => {
      this.activeKey = activeKey.replaceAll('|', '%7C');
    });
  };
  removeTab = (targetKey: string) => {
    debugger;
    let newActiveKey: string = targetKey;
    let lastIndex = 0;
    this.tabs.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = this.tabs.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key || '';
      } else {
        newActiveKey = newPanes[0].key || '';
      }
    }
    runInAction(() => {
      this.tabs = newPanes;
      this.onChangeTab(newActiveKey);
    });
  };
  removeAllTab = () => {
    const tab = {
      layout: false,
      locale: false,
      name: '首页',
      path: util.getLStorage(`homePage-${window.btoa(userinfo.id)}`),
      key: util.getLStorage(`homePage-${window.btoa(userinfo.id)}`),
      closable: false,
    };
    runInAction(() => {
      this.tabs = [tab];
      this.activeKey = util.getLStorage(`homePage-${window.btoa(userinfo.id)}`);
      this.currentMenuInfo = tab;
    });
    let his = createHashHistory();
    his.push({
      pathname: util.getLStorage(`homePage-${window.btoa(userinfo.id)}`),
    });
  };

  getMenuList = (mk: string) => {
    let menuList = util.getLStorage('menuData');
    const mkRouter = menuList.find((item: any) => item.key == mk) || {};
    runInAction(() => {
      if (mk) {
        if (mkRouter.furl) {
          this.tabs = [];
          this.tabs = [
            {
              layout: false,
              locale: false,
              name: '首页',
              path: mkRouter.furl,
              key: mkRouter.furl,
              closable: false,
            },
          ];
        }
        this.activeKey = mkRouter.furl;
        this.menuList = mkRouter.routes;
        this.mkmc = mkRouter.name;
      } else {
        this.menuList = menuList;
      }
    });
  };
}
export default new BaseLayouttStore();
