import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Pagination,Table } from 'antd';
import { history } from 'umi';
import Header from '../components/header';
import Technology from '../components/technology';
import LeftMenu from '../components/leftMenu';
import style from './index.less';
import { runFunc } from '@/utils/menuUtils';
import fetch from '../../../utils/fetch';
import axios from 'axios';


const Detail = observer((props) => {
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
      { id: 6, name: '公示公告', icon: gongshigonggao },
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


  const menusclick = async (item) => {
    console.log(item);
    debugger
    store.titlename=item.name;
    var xxzt="";
    switch(item.id){
      case 1: xxzt='dwjs';break;
      case 2: xxzt='zzjg';break;
      case 3: xxzt='rrxx';break;
      case 4: xxzt='zfgk';break;
      case 5: xxzt='gzdt';break;
      case 6: xxzt='gsgg';break;
    }
    const res = await ListService.findByKey("",1,10,{lxtype:xxzt});
    store.lists=res.list;
  }


  useEffect(() => {
    store.findaddress();
  }, []);


  return (
    <div className={`${style['detail-content']}`}>
        <Header />
        <div className={`${style['detail-body']}`}>
          <div className={`${style['detail-table']}`}>
            <div className={`${style['title']}`}>单位介绍单位介绍标题</div>
            <div className={`${style['banner']}`}>
              <img src="" alt="图片区域,暂无没放" />
            </div>
            <div
              className={`${style['rich-content']}`}
              dangerouslySetInnerHTML={{ __html: 'xxx' }}
            />
          </div>
        </div>
        <Technology />
      </div>
  );
});
export default Detail;
