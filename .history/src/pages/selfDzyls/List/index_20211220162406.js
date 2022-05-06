import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Pagination } from 'antd';
import { history } from 'umi';
import Header from '../components/header';
import Technology from '../components/technology';
import LeftMenu from '../components/leftMenu';
import style from './index.less';

import { runFunc } from '@/utils/menuUtils';

const List = observer((props) => {
  const store = useLocalStore(() => ({
    lists: [],
    async findaddress() {
      const response = await fetch.post(`/api/streamingapi/content/findaddress`);
      this.city=response.data;
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

  useEffect(() => {
    store.findaddress();
  }, []);


  return (
    <div className={`${style['list-content']}`}>
        <Header />
        <div className={`${style['list-body']}`}>
          <LeftMenu />
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
