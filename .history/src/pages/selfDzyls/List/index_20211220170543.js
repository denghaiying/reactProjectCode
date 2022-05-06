import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Pagination } from 'antd';
import { history } from 'umi';
import Header from '../components/header';
import Technology from '../components/technology';
import LeftMenu from '../components/leftMenu';
import style from './index.less';
import danweijeishao from '../assets/images/icon_danweijeishao.png';
import zuzhijiagou from '../assets/images/icon_zuzhijiagou.png';
import renyuaninxi from '../assets/images/icon_renyuaninxi.png';
import zhengfugongkai from '../assets/images/icon_zhengfugongkai.png';
import gongzuodongtai from '../assets/images/icon_gongzuodongtai.png';
import gongshigonggao from '../assets/images/icon_gongshigonggao.png';
import leftstyle from './leftindex.less';
import { runFunc } from '@/utils/menuUtils';


const List = observer((props) => {
  const store = useLocalStore(() => ({
    lists: [],
    active: 1,
    menus: [
      { id: 1, name: '单位介绍', icon: danweijeishao },
      { id: 2, name: '组织架构', icon: zuzhijiagou },
      { id: 3, name: '人员信息', icon: renyuaninxi },
      { id: 4, name: '政府公开', icon: zhengfugongkai },
      { id: 5, name: '工作动态', icon: gongzuodongtai },
      { id: 6, name: '公示公告', icon: gongshigonggao },
    ],
    async findaddress() {
      const response = await fetch.post(`/api/streamingapi/content/findForPage?pageno=1&pagesize=20&lxtype=dwjs`);
      debugger
    },
  }));


  const jump = (item) => {
    console.log(item);
    history.push(`/runRfunc/detail?id=${item.id}`);
  }

  const renderInfo =() => {
    return store.lists.map((item) => {
      return (
        <div
          className={`${style['common-line']}`}
          key={item.id}
          onClick={() => jump(item)}
        >
          <div className={`${style['det']}`}>
            <div className={`${style['name']}`}>{item.title}</div>
            <div className={`${style['time']}`}>{item.time}</div>
          </div>
        </div>
      );
    });
  }

  const renderMenu=() => {
 //   const { menus, active } = this.state;
    return store.menus.map((item) => {
      return (
        <div
          key={item.id}
      //    onClick={this.handleClick.bind(this, item)}
          className={
            store.active === item.id
              ? `${leftstyle['menu-list-det']} ${leftstyle['active']}`
              : `${leftstyle['menu-list-det']}`
          }
        >
          <img src={item.icon} />
          <span>{item.name}</span>
        </div>
      );
    });
  }

  useEffect(() => {
  //  store.findaddress();
  }, []);


  return (
    <div className={`${style['list-content']}`}>
        <Header />
        <div className={`${style['list-body']}`}>
          <div className={`${leftstyle['left-menu']}`}>{renderMenu()}</div>
          <div className={`${style['list-table']}`}>
            <div className={`${style['title']}`}>公示公告</div>
            <div className={`${style['info']}`}>{renderInfo()}</div>
            <div className={`${style['pagination']}`}>
              <Pagination defaultCurrent={1} total={50} />
              <span className={`${style['total']}`}>共50页</span>
            </div>
          </div>
        </div>
        <Technology />
      </div>
  );
});
export default List;
