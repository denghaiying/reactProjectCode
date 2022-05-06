import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import SysStore from '@/stores/system/SysStore';
import './index.less';
import fetch from '../../../utils/fetch';

import search from './assets/icon_search.png';
import hunyindengji from './assets/img_hunyindengji.png';
import dushengzinv from './assets/img_dushengzinv.png';
import zhaogong from './assets/img_zhaogong.png';
import zhiqinghuihu from './assets/img_zhiqinghuihu.png';
import shanlin from './assets/img_shanlin.png';
import zaishengyu from './assets/img_zaishengyu.png';
import fangchan from './assets/img_fangchan.png';
import tuiwujunren from './assets/img_tuiwujunren.png';
import util from '../../../utils/util';
import { history } from 'umi';
import { runFunc } from '@/utils/menuUtils';

const Dzyls = observer((props) => {
  const store = useLocalStore(() => ({
    keyparams: '',
    dzylsData: [],
    sytitle: util.getLStorage('sysname'),
    async queryDzylssy() {
      const response = await fetch.get(
        `/api/eps/control/main/dzylssy/queryForList?lx=1`,
      );
      if (response.status === 200) {
        var sjData = [];
        if (response.data?.length > 0) {
          for (var i = 0; i < response.data?.length; i++) {
            var ysj = response.data[i];
            let newKey = {};
            newKey.name = ysj.dakmc;
            if (ysj.tph === 'img01') {
              newKey.img = hunyindengji;
            }
            if (ysj.tph === 'img02') {
              newKey.img = dushengzinv;
            }
            if (ysj.tph === 'img03') {
              newKey.img = zhaogong;
            }
            if (ysj.tph === 'img04') {
              newKey.img = zhiqinghuihu;
            }
            if (ysj.tph === 'img05') {
              newKey.img = shanlin;
            }
            if (ysj.tph === 'img06') {
              newKey.img = zaishengyu;
            }
            if (ysj.tph === 'img07') {
              newKey.img = fangchan;
            }
            if (ysj.tph === 'img08') {
              newKey.img = tuiwujunren;
            }
            sjData.push(newKey);
          }
          this.dzylsData = sjData;
        }
      }
    },
  }));

  const onkeyChange = (e) => {
    console.log(e.target.value);
    store.keyparams = e.target.value;
  };

  const doSearch = () => {
    util.setSStorage('dwids', SysStore.getCurrentCmp().id);
    util.setSStorage('keyword', store.keyparams);
    util.setSStorage('dakType', '');
    console.log('keyword:' + store.keyparams);
    console.log('keywordxxx:' + util.getSStorage('keyword'));
    var searchType = '*';
    const params = {
      dw: SysStore.getCurrentCmp().id,
      searchValue: store.keyparams,
      searchType: searchType,
      umid:  'DALY045',
      umname: '全文检索',
      path:'/runRfunc/epsSearch'
    };
    runFunc(params);
    //window.top.parent.runFunc('DALY045', params);
  };

  const dodaSearch = (e) => {
    util.setSStorage('dwids', SysStore.getCurrentCmp().id);
    util.setSStorage('keyword', store.keyparams);
    util.setSStorage('dakType', e);
    var searchType = '*';
    const params = {
      dw: SysStore.getCurrentCmp().id,
      searchValue: store.keyparams,
      searchType: searchType,
      dakType: e,
    };
    window.top.parent.runFunc('DALY045', params);
  };

  useEffect(() => {
    store.queryDzylssy();
  }, []);

  return (
    <div className="main-page">
      <div className="title">
        <p className="top-title">{store.sytitle}</p>
        <p>
          <span style={{ marginRight: 85 }}>
            查档人：{SysStore.getCurrentUser().yhmc}
          </span>
          <span>查档账号：{SysStore.getCurrentUser().bh}</span>
        </p>
      </div>
      <div className="search">
        <input type="text" onChange={onkeyChange}></input>
        <div className="search-btn" onClick={doSearch}>
          搜索<img src={search}></img>
        </div>
      </div>
      <div className="line"></div>
      <div className="group">
        {store.dzylsData.map((item) => (
          <div
            key={item.name}
            className="card-item"
            onClick={() => dodaSearch(item.name)}
          >
            <img src={item.img}></img>
            <div className="bottom">
              <p>
                <span className="bold">{item.name}</span>档案
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
export default Dzyls;
