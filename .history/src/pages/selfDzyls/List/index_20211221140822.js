import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Pagination,Table } from 'antd';
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
import fetch from '../../../utils/fetch';
import axios from 'axios';
import ListService from './service/ListService';


const List = observer((props) => {
  const store = useLocalStore(() => ({
    lists: [],
    active: 1,
    titlename:'单位介绍',
    menus: [
      { id: 1, name: '单位介绍', icon: danweijeishao },
      { id: 2, name: '组织架构', icon: zuzhijiagou },
      { id: 3, name: '人员信息', icon: renyuaninxi },
      { id: 4, name: '政府公开', icon: zhengfugongkai },
      { id: 5, name: '工作动态', icon: gongzuodongtai },
      { id: 6, name: '通知公告', icon: gongshigonggao },
    ],
    columns: [
      {
        title: '',
        dataIndex: 'contenttitle',
        align: 'center',
      },
      {
        title: '',
        dataIndex: 'contentwhsj',
        align: 'center',
        width: 260,
      },
    ],
    async findaddress() {
      const res = await ListService.findByKey("",1,10,{lxtype:'dwjs'});
      this.lists=res.list;
    },
  }));


  const jump = (item) => {
    debugger
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
            <div className={`${style['name']}`}>{item.contenttitle}</div>
            <div className={`${style['time']}`}>{item.contentwhsj}</div>
          </div>
        </div>
      );
    });
  }

  const menusclick = async (item) => {
    console.log(item);
    debugger
    store.titlename=item.name;
    var xxzt="";
    switch(item.id){
      case 1: xxzt='dwjs';break;
      case 2: xxzt='zhjg';break;
      case 3: xxzt='rrxx';break;
      case 4: xxzt='zfgk';break;
      case 5: xxzt='gzdt';break;
      case 6: xxzt='tzgg';break;
    }
    const res = await ListService.findByKey("",1,10,{lxtype:xxzt});
    store.lists=res.list;
  }

  const renderMenu=() => {
 //   const { menus, active } = this.state;
    return store.menus.map((item) => {
      return (
        <div
          key={item.id}
          onClick={() =>menusclick(item)}
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
    store.findaddress();
  }, []);


  return (
    <div className={`${style['list-content']}`}>
        <Header />
        <div className={`${style['list-body']}`}>
          <div className={`${leftstyle['left-menu']}`}>{renderMenu()}</div>
          <div className={`${style['list-table']}`}>
            <div className={`${style['title']}`}>{store.titlename}</div>

            <Table
              columns={store.columns}
              dataSource={store.lists}
           //   className={`${style['table']}`}
              pagination={{ pageSize: 8 }}
              onRow={(record) => {
                return {
                  onDoubleClick: () => jump(record),
                };
              }}
            />
          <div className={`${style['info']}`}> </div>
          </div>
        </div>
        <Technology />
      </div>
  );
});
export default List;
