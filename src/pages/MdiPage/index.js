/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, Suspense } from 'react';
import { observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Loading } from '@alifd/next';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import Header from '@/layout/header';
import LeftHeader from '@/layout/leftHeader';
import TopMenu from '@/layout/topMenu';
// import TopNavMenu from '../../layout/topNavMenu';
import SideBar from '@/layout/sideBar';
import LeftSideBar from '@/layout/leftSideBar';
import TopHeader from '@/layout/topHeader';
import LoginStore from '@/stores/system/LoginStore';
import UserMenuStore from '@/stores/system/UserMenuStore';
import '@/styles/css/style.less';
import { routerData } from '@/routerConfig';
import history from '@/utils/history';
import EIFrame from '../EIFrame';
import ToTabContent from '../ToTabContent';
import { Icon } from '@alifd/next';
import { runFunc } from '@/utils/common';
import TabHeader from '@/layout/tabHeader';
import './index.less'
import { Nav } from '@alifd/next';
const { Item, SubNav } = Nav;
import util from '../../utils/util';
import { Tab } from '@alifd/next';
import SysStore from '@/stores/system/SysStore';

const MdiPage = observer(props => {
  const { intl: { formatMessage }, match: { params: { sysid = '0' } }, location: { pathname } } = props;
  const [nomenu, setNoenmu] = useState(false);
  //  const skin = util.getSStorage('skin');
  const indexNum = pathname.indexOf("$$$") + 3
  let homeUrl;
  if (indexNum >= 3) {
    homeUrl = pathname.substring(indexNum);
  }
  // homeUrl="/api/eps/control/main/iframePage?rungn=dagl001";
  //const menuList=TabMenuStore.userMenu[0];
  let path = props.location.pathname
  //const currentNavs= [{val: getItemByPath(path, menuList).id, name: getItemByPath(path, menuList).name, path: path}];

  const clickNav = (item) => {
       //点击顶部导航切换
    UserMenuStore.setCurrentNavList(item);
    // UserMenuStore.setSelectedTab(item.umid)
    const funcItem = { sysid: "0", umid: item.umid, url: item.url, openlx: item.openlx };
    runFunc(funcItem);
  }
  const removeTop = (obj) => {         // 点击顶部导航删除
    let arr = UserMenuStore.currentNavList;

    arr.forEach((item, index) => {
      // item.val === obj.val ? arr.splice(index, 1) : ''
      if (item.val === obj.val) {
        arr.splice(index, 1)
      }
    })
    UserMenuStore.setCurrentNavList(arr);
    setTimeout(() => {
      UserMenuStore.setSelectedTab('0');
    }, 0)
  }

  useEffect(() => {
    SysStore.setCurrentCmpList();
    if (sysid && sysid !== '0') {
      UserMenuStore.getMenu(sysid);
      const v = LoginStore.systems.find(item =>
        item.umid == sysid
      );
      setNoenmu(v && v.nomenu);
      if (v && v.furl) {
        const item = { umid: 0, text: "首页", url: v.furl, sysid: sysid }
        UserMenuStore.setCurrentNavList(item);
        UserMenuStore.setSelectedTab(item.umid);
        runFunc(item);
        //history.push(`/run/${sysid}${v.furl}`);
      }
    }
  }, [sysid]);



  useEffect(() => {
    UserMenuStore.setHomePage();
    UserMenuStore.setSelectedTab("0")
  }, []);

  const showMenu = () => !!!nomenu;

  const tabs = [
    { tab: 'Home', key: 0, content: 'loginCompoment' },
  ];

  const getChildrenRouter = () => {
    return (
      <Suspense fallback={<Loading size="large" style={{ position: 'fixed', left: '49%', top: '49%' }} />}>
        <Switch>
          {routerData.map(item =>
          (<Route
            key={item.path}
            path={`/run/${sysid}${item.path}`}
            component={(p) => <item.component {...p} />}
            exact={item.exact}
          />))}
          <Route path={`/run/${sysid}/iframe/:umid`} component={(props) => <EIFrame {...props} />} />
        </Switch>
      </Suspense>);
  };

  const commonApp = (
    <div className="main-page">
      <Header />
      {UserMenuStore.opensys && UserMenuStore.opensys.systemType !== 9 &&
        <div className="layout-main">
          {showMenu() &&
            <div className={`pull-left left-sidebar${(UserMenuStore.collapse && '-min') || ''}`}>
              <TopMenu />
              <SideBar />
            </div>
          }
          <div className={`pull-right ${showMenu() ? (UserMenuStore.collapse ? 'page-left' : 'page-content') : 'page-content-nonmenu'}`}>
            <div className="main-body">
              <Tab>
                {
                  UserMenuStore.currentNavList.map(item => <Tab.Item key={item.umid} title={item.text}><ToTabContent item={item} /></Tab.Item>)
                }
              </Tab>
            </div>

            {/* <div className="menu-change">
            <div className="menu-change-logo">
              <Tooltip trigger={<div className={`logo-dot ${!props.theme ? 'logo-dot1' : 'logo-y-dot1'}`} onClick={() => { }} />} align="t" triggerType="hover">首页</Tooltip>
              <Tooltip trigger={<div className={`logo-dot ${!props.theme ? 'logo-dot2' : 'logo-y-dot2'}`} />} align="t" triggerType="hover">text1</Tooltip>
              <Tooltip trigger={<div className={`logo-dot ${!props.theme ? 'logo-dot3' : 'logo-y-dot3'}`} />} align="t" triggerType="hover">text2</Tooltip>
            </div>
          </div> */}
            {/* <div className="page-footer">{PtinfoStore.record.reg && `${formatMessage({ id: 'e9.main.licto' })} ${PtinfoStore.record.ptinfoConame}`}
              {!PtinfoStore.record.reg && formatMessage({ id: 'e9.main.nolic' })}
            </div> */}
          </div>

          <div className="clear" />
        </div>
      }
      {UserMenuStore.opensys && UserMenuStore.opensys.systemType === 9 &&
        <div className="layout-main">
          <div className="frame">
            <iframe src={UserMenuStore.opensys.systemUrl} scrolling="no" title={UserMenuStore.opensys.systemName} />
            {/* <div className="page-footer">{PtinfoStore.record.reg && `${formatMessage({ id: 'e9.main.licto' })} ${PtinfoStore.record.ptinfoConame}`}
              {!PtinfoStore.record.reg && formatMessage({ id: 'e9.main.nolic' })}
            </div> */}
          </div>
        </div>
      }
    </div >);
  const topApp = (
    <div>
      <TopHeader />
      {UserMenuStore.opensys && UserMenuStore.opensys.systemType !== 9 &&
        <div className="layout-main">
          {showMenu() &&
            <div className={`pull-left left-sidebar${(UserMenuStore.collapse && '-min') || ''}`}>
              <TopMenu />
              <SideBar />
            </div>}
          <div className={`pull-right ${showMenu() ? (UserMenuStore.collapse ? 'page-left' : 'page-content') : 'page-content-nonmenu'}`}>
            <div className="top-nav">
              {
              }
              <div className="cells" >
                <div className="inner">
                  {
                    UserMenuStore.currentNavList.map((item, index) => (
                      <li className={item.val === UserMenuStore.selectedTab ? 'selected' : ''} key={index} onClick={() => clickTopNav(item)}>
                        <span className="cell-name">{item.name}</span>
                        <Icon style={{ paddingLeft: 2 }} type="error" size={"xs"} onClick={() => removeTop(item)} />
                      </li>
                    ))
                  }
                </div>
              </div>
              {
              }
            </div>
            {getChildrenRouter()}
            {/* <div className="menu-change">
            <div className="menu-change-logo">
              <Tooltip trigger={<div className={`logo-dot ${!props.theme ? 'logo-dot1' : 'logo-y-dot1'}`} onClick={() => { }} />} align="t" triggerType="hover">首页</Tooltip>
              <Tooltip trigger={<div className={`logo-dot ${!props.theme ? 'logo-dot2' : 'logo-y-dot2'}`} />} align="t" triggerType="hover">text1</Tooltip>
              <Tooltip trigger={<div className={`logo-dot ${!props.theme ? 'logo-dot3' : 'logo-y-dot3'}`} />} align="t" triggerType="hover">text2</Tooltip>
            </div>
          </div> */}
            {/* <div className="page-footer">{PtinfoStore.record.reg && `${formatMessage({ id: 'e9.main.licto' })} ${PtinfoStore.record.ptinfoConame}`}
              {!PtinfoStore.record.reg && formatMessage({ id: 'e9.main.nolic' })}
            </div> */}
          </div>
          <div className="clear" />
        </div>
      }
      {UserMenuStore.opensys && UserMenuStore.opensys.systemType === 9 &&
        <div className="layout-main">
          <div className="frame">
            <iframe src={UserMenuStore.opensys.systemUrl} scrolling="no" title={UserMenuStore.opensys.systemName} />
            {/* <div className="page-footer">{PtinfoStore.record.reg && `${formatMessage({ id: 'e9.main.licto' })} ${PtinfoStore.record.ptinfoConame}`}
              {!PtinfoStore.record.reg && formatMessage({ id: 'e9.main.nolic' })}
            </div> */}
          </div>
        </div>
      }
    </div>);
  const leftApp = (
    <div>
      <div className="menu">
        <LeftSideBar />
      </div>
      <div className={`layout-main-left${(UserMenuStore.collapse && '-min') || ''}`}>
        <LeftHeader />
        <div className="page-content">
          {UserMenuStore.opensys && UserMenuStore.opensys.systemType !== 9 && getChildrenRouter()}
          {UserMenuStore.opensys && UserMenuStore.opensys.systemType === 9 &&
            <div className="frame">
              <iframe src={UserMenuStore.opensys.systemUrl} scrolling="no" title={UserMenuStore.opensys.systemName} />
            </div>
          }
          {/* <div className="menu-change">
            <div className="menu-change-logo">
              <Tooltip trigger={<div className={`logo-dot ${!props.theme ? 'logo-dot1' : 'logo-y-dot1'}`} onClick={() => { }} />} align="t" triggerType="hover">首页</Tooltip>
              <Tooltip trigger={<div className={`logo-dot ${!props.theme ? 'logo-dot2' : 'logo-y-dot2'}`} />} align="t" triggerType="hover">text1</Tooltip>
              <Tooltip trigger={<div className={`logo-dot ${!props.theme ? 'logo-dot3' : 'logo-y-dot3'}`} />} align="t" triggerType="hover">text2</Tooltip>
            </div>
          </div> */}
          {/* <div className="page-footer">{PtinfoStore.record.reg && `${formatMessage({ id: 'e9.main.licto' })} ${PtinfoStore.record.ptinfoConame}`}
            {!PtinfoStore.record.reg && formatMessage({ id: 'e9.main.nolic' })}
          </div> */}
        </div>
      </div>
    </div>);
  const tabApp = (
    <div className="main-page">
      <TabHeader />
      <div className="main-body">
        {/* <Leftnav getCurrentNav={this.getCurrentNav}></Leftnav> */}
        <div className="left-nav">

          <Nav openMode="single" className="my-menu"
            defaultSelectedKeys={['1']}
            selectedKeys={UserMenuStore.selectedTab}
            defaultOpenKeys={['1']}
          >
            {UserMenuStore.opensys &&
              UserMenuStore.userMenu[UserMenuStore.opensys.id] &&
              UserMenuStore.userMenu[UserMenuStore.opensys.id].map((item, index) => {
                return item.children && item.children.length ? (
                  <SubNav key={item.umid} icon={<img style={{ verticalAlign: "middle" }} src={`/api/eps/control/main/${item.icon}` || getDefaultIcon(item.sysid, item.umid.substr(1)) || require('@/styles/img/menu-default.png')} style={{ width: '22px' }} alt="" />} label={<span style={{ color: '#333', marginLeft: '8px' }}>{item.text}</span>}>
                    {
                      item.children.map((item, index) => (
                        <Item onClick={() => clickNav(item)} key={item.umid}>{item.text}</Item>
                      ))
                    }
                  </SubNav>) : (<Item onClick={() => clickNav(item)} key={item.umid} icon={<img src={item.icon || getDefaultIcon(item.sysid, item.umid.substr(1)) || require('@/styles/img/menu-default.png')} style={{ width: '22px' }} alt="" />}><span style={{ color: '#333', marginLeft: '8px' }}>{item.text}</span></Item>)
              })
            }
          </Nav>
        </div>
        <div className="right-content">
          <Tab
            //  onChange={UserMenuStore.setSelectedTab}
            onClose={UserMenuStore.onRemoveTab}
            activeKey={UserMenuStore.selectedTab}
          >
            {
              UserMenuStore.currentNavList.map(item => <Tab.Item onClick={() => clickNav(item)} closeable={item.umid != "0"} key={item.umid} title={item.text}> </Tab.Item>)
            }
          </Tab>
          <div className="child">
            {getChildrenRouter()}
          </div>

        </div>

      </div>

    </div>);

  return (
    <div style={{ height: "100%" }}>
      {LoginStore.menutype === 'L' && leftApp}
      {LoginStore.menutype === 'T' && topApp}
      {LoginStore.menutype === 'T' && topApp}

      {LoginStore.menutype !== 'L' && LoginStore.menutype !== 'T' && tabApp}
    </div>);
});

export default withRouter(injectIntl(MdiPage));

