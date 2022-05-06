import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import './index.less';

import util from '@/utils/util';

import tabLayoutStore from '@/layouts/BaseLayoutStore';
import '@/layouts/TabLayout.less';
import { DownOutlined, CloseOutlined } from '@ant-design/icons';
import { createHashHistory } from 'history';
import { Button, Dropdown, Menu, Space, Tabs } from 'antd';
import { Observer } from 'mobx-react';
import { ArchParams } from '@/stores/appraisa/AppraisaManageStore';
const { TabPane } = Tabs;
const { SubMenu, Item } = Menu;
import { history, useParams } from 'umi';
import { ViewGridDetail, Box } from '@icon-park/react';
import { message } from 'antd';
const ssoPath = '/sso';
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  menuData?: API.CurrentMenu;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  //fetchCmpInfo?: () => Promise<API.CurrentCmp | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      // = util.getLStorage('currentUser');
      // if (!currentUser) {

      const currentUser = await queryCurrentUser();
      // }
      util.setLStorage('currentUser', currentUser);

      return currentUser;
    } catch (error) {
      if (window.top.location.pathname.indexOf(ssoPath) >= 0) {
        // window.top.location.href = ssoPath;
        return;
      } else if (window.top.location.pathname.indexOf(loginPath) < 0) {
        window.top.location.href = loginPath;
      }
      //history.push(loginPath);
    }
    return undefined;
  };

  // 如果是登录页面，不执行
  if (
    history.location.pathname != loginPath &&
    history.location.pathname != ssoPath
  ) {
    const currentUser = await fetchUserInfo();
    if (currentUser) {
      //   menuData=await fetchMenuInfo();
    }
    return {
      fetchUserInfo,
      currentUser,
      // menuData,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

//getInitialState();

/**
 * 异常处理程序
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    405: '请求方法不被允许。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
 //-----English
    200: The server successfully returned the requested data. ',
    201: New or modified data is successful. ',
    202: A request has entered the background queue (asynchronous task). ',
    204: Data deleted successfully. ',
    400: 'There was an error in the request sent, and the server did not create or modify data. ',
    401: The user does not have permission (token, username, password error). ',
    403: The user is authorized, but access is forbidden. ',
    404: The request sent was for a record that did not exist. ',
    405: The request method is not allowed. ',
    406: The requested format is not available. ',
    410':
        'The requested resource is permanently deleted and will no longer be available. ',
    422: When creating an object, a validation error occurred. ',
    500: An error occurred on the server, please check the server. ',
    502: Gateway error. ',
    503: The service is unavailable. ',
    504: The gateway timed out. ',
 * @see https://beta-pro.ant.design/docs/request-cn
 */

const getMenuInfo = (children: any): MenuNodeType => {
  const location: locationType = children?.props?.location;
  const query: ArchParams = location?.query;

  const menuData = util.getLStorage('menuData');
  const userinfo = util.getLStorage('userinfo');
  const pathname = util.getLStorage(`homePage-${window.btoa(userinfo.id)}`);
  if (location.pathname === pathname.substring(0, pathname.indexOf('?'))) {
    return {
      layout: false,
      locale: false,
      name: '首页',
      path: pathname.replaceAll('|', '%7C') || '/',
      key: pathname.replaceAll('|', '%7C') || '/',
      closable: false,
    };
    // return {}
  }

  // 从menudata runFunc路由中获取生成标签信息
  const runFucnRoutes =
    menuData &&
    menuData.find((o: MenuNodeType) => o.path === '/runFunc')?.routes;
  if (runFucnRoutes) {
    const currentMenInfo = runFucnRoutes.find(
      (item: MenuNodeType) => item.path === `/runFunc${location.pathname}`,
    );
    if (currentMenInfo) {
      currentMenInfo.path =
        location.pathname + decodeURI(location.search).replaceAll('|', '%7C');
      return currentMenInfo;
    }
  }
  // 从路由查询参数中获取生成标签信息
  // eslint-disable-next-line prefer-const
  let currentMenuInfo: MenuNodeType = {
    layout: false,
    locale: false,
    name: query.umname,
    path: decodeURI(location.pathname + location.search).replaceAll('|', '%7C'),
    key: decodeURI(location.pathname + location.search).replaceAll('|', '%7C'),
    opentype: query.opentype,
    closable: true,
  };
  if (query && query.type === 'K') {
    currentMenuInfo.query = query;
  }
  return currentMenuInfo;
};

const Main = (props) => {
  const params = useParams();

  //const menuList = tabLayoutStore.menuList;

  let path = props.location.pathname;

  const clickLeftnav = (obj) => {
    debugger;
    tabLayoutStore.addTab(obj, obj.key || obj.id);
  };

  // const { pathname } = window.location;
  const pathname = decodeURI(location.pathname + location.search)
    .replaceAll('|', '%7C')
    .substr(location.pathname.indexOf('#') + 1);

  useEffect(() => {
    window.mainStore = tabLayoutStore;
    window.message = message;
    tabLayoutStore.getMenuList(params.mk);
  }, []);

  const onChange = (activeKey: string) => {
    tabLayoutStore.onChangeTab(activeKey);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const remove = (targetKey: string) => {
    tabLayoutStore.removeTab(targetKey);
  };

  const onEdit = (targetKey: any, e: string) => {
    // eslint-disable-next-line no-eval
    eval(`${e}('${targetKey}')`);
  };

  function handleMenuClick({ key }) {
    if (key === '1') {
      tabLayoutStore.removeAllTab();
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<CloseOutlined />} style={{ fontSize: '12px' }}>
        关闭所有
      </Menu.Item>
    </Menu>
  );

  return (
    <Observer>
      {() => (
        <div className="main-page">
          <Header mainStore={tabLayoutStore} showMainHome={params.mk} />
          <div className="main-body">
            {/* <Leftnav getCurrentNav={this.getCurrentNav}></Leftnav> */}
            <div className="left-nav">
              <Menu
                // className="my-menu"

                //  onSelect={()=>clickLeftnav}
                mode="vertical"
              >
                {/* 判断是否模块并且模块是否有二级菜单 */}
                {!params.mk ||
                (params.mk &&
                  tabLayoutStore.menuList &&
                  tabLayoutStore.menuList[0] &&
                  tabLayoutStore.menuList[0].routes)
                  ? tabLayoutStore.menuList.map((item) => {
                      return item.routes && item.routes.length ? (
                        <SubMenu
                          key={item.key}
                          title={
                            <Space size={12}>
                              <ViewGridDetail
                                theme="filled"
                                size="20"
                                fill="#859097"
                                style={{ position: 'absolute', top: '30%' }}
                                strokeWidth={2}
                              />
                              <span
                                style={{ left: '40px', position: 'absolute' }}
                              ></span>
                              {item.name}
                            </Space>
                          }
                        >
                          {item.routes.map((item) => (
                            <Item
                              onClick={() => clickLeftnav(item)}
                              key={item.url}
                            >
                              <span>{item.name}</span>
                            </Item>
                          ))}
                        </SubMenu>
                      ) : (
                        <Item key={item.url}>
                          <img
                            src={item.icon}
                            style={{ width: '20px' }}
                            alt=""
                          />
                          <span
                            style={{
                              color: '#333',
                              marginLeft: '8px',
                            }}
                          >
                            {item.name}
                          </span>
                        </Item>
                      );
                    })
                  : tabLayoutStore.menuList.map((item) => (
                      <Item onClick={() => clickLeftnav(item)} key={item.url}>
                        <Space size={12}>
                          <ViewGridDetail
                            theme="filled"
                            size="20"
                            fill="#859097"
                            style={{ position: 'absolute', top: '30%' }}
                            strokeWidth={2}
                          />
                          <span
                            style={{ left: '40px', position: 'absolute' }}
                          ></span>
                          {item.name}
                        </Space>
                      </Item>
                    ))}
              </Menu>
            </div>
            <div className="right-content">
              <div className="child" style={{ height: '100%' }}>
                <Tabs
                  type="editable-card"
                  hideAdd
                  style={{ height: '100%' }}
                  activeKey={tabLayoutStore.activeKey}
                  onChange={tabLayoutStore.onChangeTab}
                  tabBarExtraContent={{
                    right: (
                      <Dropdown overlay={menu}>
                        <Button icon={<DownOutlined />}></Button>
                      </Dropdown>
                    ),
                  }}
                  // activeKey={tabLayoutStore.activeKey}
                  onEdit={onEdit}
                  // onChange={onChange}
                >
                  {tabLayoutStore.tabs.map((item) => (
                    <TabPane
                      key={item.key}
                      tab={item.name}
                      closable={item.closable}
                      style={{ height: '100%' }}
                    >
                      <iframe
                        id={`${item.key}_iframe`}
                        style={{
                          width: 'calc(100%)',
                          height: 'calc(100%)',
                          padding: '5px 0px',
                          border: 'none',
                        }}
                        src={item.path}
                      ></iframe>
                    </TabPane>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      )}
    </Observer>
  );
};

// 当装饰器在import跟export之间时语法会报错，所以将export挪到最下面
export default Main;
