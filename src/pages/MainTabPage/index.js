/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, Suspense } from 'react';
import { observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Loading } from '@alifd/next';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import Header from '@/layout/tabHeader';
import LeftHeader from '@/layout/leftHeader';
import TopMenu from '@/layout/topMenu';
// import TopNavMenu from '../../layout/topNavMenu';
import SideBar from '@/layout/sideBar';
import LeftSideBar from '@/layout/leftSideBar';
import TopHeader from '@/layout/topHeader';
import LoginStore from '@/stores/system/LoginStore';
import TabMenuStore from '@/stores/system/TabMenuStore';
import PtinfoStore from '@/stores/system/PtinfoStore';
import { routerData } from '@/routerConfig';
import history from '@/utils/history';
import EIFrame from '../EIFrame';
import { Nav } from '@alifd/next';
import './index.less'
import { Icon } from '@alifd/next';
import {createHashHistory} from "history";
import { runFunc } from '@/utils/common';
const { Item, SubNav } = Nav;


// const Tooltip = Balloon.Tooltip;


const MdiPage = observer(props => {
  const { intl: { formatMessage }, match: { params: { sysid = '0' } }, location: { pathname } } = props;
  const [nomenu, setNoenmu] = useState(false);
  const [currentNavList, setCurrentNavList] = useState([{name:'首页',path:'/home',val:'1'}]);
  const [selected, setSelected] = useState(null);
  const indexNum = pathname.indexOf("$$$") + 3
  let homeUrl;

  if (indexNum >= 3) {
    homeUrl = pathname.substring(indexNum);
  }

  // homeUrl="/api/eps/control/main/iframePage?rungn=dagl001";

  const menuList=TabMenuStore.userMenu[0];
  let path = props.location.pathname
  const  getItemByPath=(path, list)=> {
    let res = {}
    list.forEach((item) => {
      if(item.path === path) {
        res = item
      } else {
        item.children.forEach(child => {
          if(child.path === path) {
            res = child
          }
        })
      }
    })
    return res
  };
  //const currentNavs= [{val: getItemByPath(path, menuList).id, name: getItemByPath(path, menuList).name, path: path}];
  const getItem=(val, list)=> {
    let res = {}
    list.forEach((item) => {
      if(item.id === val) {
        res = item
      } else {
        item.children.forEach(child => {
          if(child.umid === val) {
            res = child
          }
        })
      }
    })
    return res
  };

  useEffect(() => {
    // if (sysid && sysid !== '0') {
     if (sysid) {

      LoginStore.findSystem({ allshow: 1 });
      console.log(LoginStore.systems)
      TabMenuStore.getMenu(0);
      const v = LoginStore.systems.find(item =>
        item.umid == sysid
      );
      setNoenmu(v && v.nomenu);
      if (v && v.furl) {
     //  history.push(`/runTab/${sysid}${v.furl}`);
      }
    }
  }, [sysid]);

  const showMenu = () => !!!nomenu;

  const getChildrenRouter = () => {
    return (
      <Suspense fallback={<Loading size="large" style={{ position: 'fixed', left: '49%', top: '49%' }} />}>
        <Switch>
          {routerData.map(item =>
          (<Route
            key={item.path}
            path={`/runTab/${sysid}${item.path}`}
            component={(p) => <item.component {...p} />}
            exact={item.exact}
          />))}
          <Route path={`/runTab/iframe/:umid`} component={(props) => <EIFrame {...props} />} />
        </Switch>
      </Suspense>);
  };
  const clickLeftnav = (selectedKeys, item, obj) => {

    if(currentNavList.filter(item => item.val === obj.key).length === 0) {
      let newObj = {
        val: obj.key,
        name: getItem(obj.key, menuList).text,
        path:  getItem(obj.key, menuList).url,
      }
      let dataArr = currentNavList
      dataArr.push(newObj)
      setCurrentNavList(dataArr)
    }
    setSelected(obj.key)
    const funcItem={sysid:"0",umid:obj.key};
    runFunc(funcItem);

    function getItem(val, list) {
      let res = {}
      list.forEach((item) => {
        if(item.umid === val) {
          res = item
        } else {
          item.children.forEach(child => {
            if(child.umid === val) {
              res = child
            }
          })
        }
      })
      res.path=`/run/0/${item.url}`
      return res
    }
  }
  const clickTopNav=(item)=> {
    // 点击顶部导航切换
    setSelected(item.val)
    const funcItem={sysid:sysid,umid:item.val};
    runFunc(funcItem);

  }
  const removeTop=(obj)=> {         // 点击顶部导航删除
    let arr = currentNavList
    arr.forEach((item, index) => {
      // item.val === obj.val ? arr.splice(index, 1) : ''
      if(item.val === obj.val) {
        arr.splice(index, 1)
      }
    })
    setCurrentNavList(arr);
    setTimeout(() => {
      setSelected('1');
    }, 0)
  }

  const slideNav=(val)=> {        // 向左右滑动
    let distance = val === 'left' ? '0px' : `${this.refs.container.clientWidth - this.refs.inner.clientWidth}px`
    this.refs.inner.style.transform = `translateX(${distance})`
  };



  const tabApp = (
    <div className="main-page">
        <Header></Header>
        <div className="main-body">
          {/* <Leftnav getCurrentNav={this.getCurrentNav}></Leftnav> */}
          <div className="left-nav">
            {/* <Menu theme='light' mode="inline" className="my-menu"
              defaultSelectedKeys={['1']}
              selectedKeys={[this.state.selected]}
              defaultOpenKeys={this.state.openKeys}
              onClick={this.clickLeftnav}
              onOpenChange={this.onOpenChange}
            >
              {
                this.menuList.map((item, index) => {
                  return item.children.length ? (
                    <SubMenu key={item.id} icon={<img src={item.icon} style={{width: '22px'}} alt=""/>} title={<span style={{color: '#333', marginLeft: '8px'}}>{item.name}</span>}>
                      {
                        item.children.map((item, index) => (
                          <Menu.Item key={item.id}>{item.name}</Menu.Item>
                        ))
                      }
                    </SubMenu>) : (<Menu.Item key={item.id} icon={<img src={item.icon} style={{width: '22px'}} alt=""/>}><span style={{color: '#333', marginLeft: '8px'}}>{item.name}</span></Menu.Item>)
                })
              }
            </Menu> */}
            <Nav openMode="single" className="my-menu"
              defaultSelectedKeys={['1']}
              selectedKeys={selected}
              defaultOpenKeys={['1']}
              onSelect={clickLeftnav}
            >
               { menuList &&
                 menuList.map((item, index) => {
                  return item.children && item.children.length ? (
                    <SubNav key={item.umid} icon={<img src={item.icon || getDefaultIcon(item.sysid, item.umid.substr(1)) || require('@/styles/img/menu-default.png')} style={{width: '22px'}} alt=""/>} label={<span style={{color: '#333', marginLeft: '8px'}}>{item.text}</span>}>
                      {
                        item.children.map((item, index) => (
                          <Item key={item.umid}>{item.text}</Item>
                        ))
                      }
                    </SubNav>) : (<Item key={item.umid} icon={<img src={item.icon || getDefaultIcon(item.sysid, item.umid.substr(1)) || require('@/styles/img/menu-default.png')} style={{width: '22px'}} alt=""/>}><span style={{color: '#333', marginLeft: '8px'}}>{item.text}</span></Item>)
                })
              }
            </Nav>
          </div>
          <div className="right-content">
            {/* <Topnav currentNavList={this.currentNavList}></Topnav> */}
            <div className="top-nav">
              {
              }
              <div className="cells" >
                <div className="inner">
                  {
                   currentNavList.map((item, index) => (
                    <li className={item.val === selected ? 'selected' : ''} key={index} onClick={()=>clickTopNav(item)}>
                    <span className="cell-name">{item.name}</span>
                    <Icon style={{paddingLeft:2}} type="error" size={"xs"} onClick={()=>removeTop(item)}/>
                  </li>
                    ))
                  }
                </div>
              </div>
              {
              }
            </div>
            <div className="child">
               {getChildrenRouter()}
            </div>
          </div>
        </div>

      </div>
    );

  return (
    <div>
      {LoginStore.menutype === 'L' && leftApp}
      {LoginStore.menutype === 'T' && topApp}
      {LoginStore.menutype !== 'L' && LoginStore.menutype !== 'T' && tabApp}
    </div>);
});

export default withRouter(injectIntl(MdiPage));

