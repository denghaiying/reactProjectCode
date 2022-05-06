import { Button, Dropdown, Menu, Tabs } from 'antd';
import { useEffect } from 'react';

import { Observer } from 'mobx-react';
import util from '@/utils/util';
import './TabLayout.less';
import tabLayoutStore from './BaseLayoutStore';
import childIcon from '@/styles/assets/img/tree/icon_child.png';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

// todo定义store用于存储tab切换时需要缓存的状态，用immutable



/**
 *
 * @param menuData
 * @param currentPath
 * @returns
 */
// eslint-disable-next-line consistent-return
const getMenuInfo = (children: any): MenuNodeType => {
  const location: locationType = children?.props?.location;
  const query: ArchParams = location?.query;

  const menuData = util.getLStorage("menuData");
  const userinfo = util.getLStorage('userinfo')
  const pathname = util.getLStorage(`homePage-${window.btoa(userinfo.id)}`)
  if (location.pathname === pathname.substring(0, pathname.indexOf('?'))) {
    return {
      layout: false,
      locale: false,
      name: "首页",
      path: pathname.replaceAll('|', '%7C') || '/',
      key: pathname.replaceAll('|', '%7C') || '/',
      closable: false,
    }
    // return {}
  }

  // 从menudata runFunc路由中获取生成标签信息
  const runFucnRoutes = menuData && menuData.find((o: MenuNodeType) => o.path === "/runFunc")?.routes;
  if (runFucnRoutes) {
    const currentMenInfo = runFucnRoutes.find((item: MenuNodeType) => item.path === `/runFunc${location.pathname}`)
    if(currentMenInfo){
      currentMenInfo.path=location.pathname+ decodeURI(location.search).replaceAll('|', '%7C');
      return currentMenInfo;
    }
  }
  // 从路由查询参数中获取生成标签信息
  // eslint-disable-next-line prefer-const
  let currentMenuInfo: MenuNodeType = {
    layout: false,
    locale: false,
    name: query.umname,
    path: decodeURI(location.pathname+location.search).replaceAll('|', '%7C'),
    key: decodeURI(location.pathname+location.search).replaceAll('|', '%7C'),
    opentype:query.opentype,
    closable: true,
  }
  if(query && query.type==="K"){
    currentMenuInfo.query=query;
  }
  return currentMenuInfo;
}


const Layout: React.FC = ({ children }) => {
  // const { pathname } = window.location;
  const pathname = decodeURI(location.pathname + location.search).replaceAll('|', '%7C')
  useEffect(() => {
    // window.pushHistory = history.push;
  }, []
  )
  useEffect(() => {
    const currentMenuInfo: MenuNodeType  = getMenuInfo(children);
    const hasPath = tabLayoutStore.tabs.find(item => {
      return item.key === pathname ;
    })
    if (!hasPath && currentMenuInfo) {
      currentMenuInfo.key = pathname;
      tabLayoutStore.addTab(currentMenuInfo, pathname);
    }
    if (hasPath) {
      tabLayoutStore.activeKey = pathname
      const tab = tabLayoutStore.tabs.find(item =>
          item.path === pathname
      )
      tabLayoutStore.currentMenuInfo = tab;
    }
  }, [pathname])
  const onChange = (activeKey: string) => {
    tabLayoutStore.onChangeTab(activeKey);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const remove = (targetKey: string) => {
    tabLayoutStore.removeTab(targetKey);
  }

  const onEdit = (targetKey: any, e: string) => {
    // eslint-disable-next-line no-eval
    eval(`${e}('${targetKey}')`);
  };
  // const getChildCompnent = () => {
  // //  if (tabLayoutStore.currentMenuInfo.opentype != "6") {
  //     return (
  //       <iframe
  //         width="100%"
  //         height="100%"
  //         frameBorder={'none'}
  //         scrolling="auto"
  //         src="http://www.163.com"
  //       ></iframe>
  //     )

  // }
  function handleMenuClick({key}) {
    if(key === '1') {
      tabLayoutStore.removeAllTab()
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<CloseOutlined />} style={{fontSize: '12px'}}>
        关闭所有
      </Menu.Item>
    </Menu>
  )


  return (
    <Observer>{() =>(
      <div className="card-container" style={{ height: '100%' }}>

        <Tabs type="editable-card"
          hideAdd
          tabBarExtraContent={{right: <Dropdown overlay={menu}>
          <Button icon={<DownOutlined />}>
          </Button>
        </Dropdown>}}
          activeKey={tabLayoutStore.activeKey}
          onEdit={onEdit}
          onChange={onChange}
        >
          {tabLayoutStore.tabs.map((item) =>
            <TabPane key={item.key} tab={item.name} closable={item.closable} />
          )}
        </Tabs>
        <div key={`${tabLayoutStore.currentMenuInfo?.umid}_tabContent`} style={{ height: "calc(100% - 38px)", background: "#fff",padding:10,overflow:"auto"}}>
        <iframe id={tabLayoutStore.currentMenuInfo?.umid}  style={{width:"calc(100%", height: "calc(100% - 10px)",border:"none"}}
          src={`/runRfunc/kfjdsp`} ></iframe>
        </div>
      </div>
    )}</Observer>
  )
};

export default Layout;
