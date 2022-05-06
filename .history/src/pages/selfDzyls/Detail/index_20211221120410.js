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
    titlename:'',
    contentDesc:'',
    async findxx() {
      debugger
      const res = await fetch.post(`/api/streamingapi/content/findId?id=${props.location.query.id}`);
        debugger
      this.titlename=res.data.contenttitle;
      this.contentDesc=res.data.contentcontentDesc;
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
    debugger
    store.findxx();
  }, []);


  return (
    <div className={`${style['detail-content']}`}>
        <Header />
        <div className={`${style['detail-body']}`}>
          <div className={`${style['detail-table']}`}>
            <div className={`${style['title']}`}>{store.titlename}</div>
            <div
              className={`${style['rich-content']}`}
              dangerouslySetInnerHTML={{ __html: store.contentDesc}}
            />
          </div>
        </div>
        <Technology />
      </div>
  );
});
export default Detail;
