import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';
import { Radio, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import util from '../../../utils/util';
import { history } from 'umi';
import SysStore from '@/stores/system/SysStore';

import lydj from './assets/img/icon_lydj.png'; //利用登记
import daly from './assets/img/icon_daly.png'; //档案利用
import dlyqktj from './assets/img/icon_lyqktj.png'; //利用情况统计
import hyda from './assets/img/icon_hyda.png'; //婚姻档案
import dszn from './assets/img/icon_dszn.png'; //独生子女
import zqda from './assets/img/icon_zqda.png'; //知青档案
import xzda from './assets/img/icon_xzda.png'; //新增档案
import fetch from '../../../utils/fetch';
import { runFunc } from '@/utils/menuUtils';

const Dalysy = observer((props) => {
  const [vmcdata, setVmcdata] = useState([]);

  const [vsjdata, setVsjdata] = useState([]);

  const [vlymdtjdata, setVlymdtjdata] = useState([]);
  const store = useLocalStore(() => ({
    radio: 1,
    keyparams: '',
    lymdtjdata: [],
    mcdata: [],
    sjdata: [],
    daylsyData: [],
    async queryDzylssy() {
      const response = await fetch.get(
        `/api/eps/control/main/dzylssy/queryForList?lx=2`,
      );
      if (response.status === 200) {
        var sjData = [];
        if (response.data?.length > 0) {
          for (var i = 0; i < response.data?.length; i++) {
            var ysj = response.data[i];
            let newKey = {};
            newKey.dakid = ysj.dakid;
            newKey.name = ysj.dakmc;
            if (ysj.tph === 'img01') {
              newKey.img = hyda;
            }
            if (ysj.tph === 'img02') {
              newKey.img = dszn;
            }
            if (ysj.tph === 'img04') {
              newKey.img = zqda;
            }

            sjData.push(newKey);
          }
          this.daylsyData = sjData;
        }
      }
    },
    async dalysycdnrtj() {
      const response = await fetch.get(
        `/api/eps/control/main/daly/dalysycdnrtj`,
      );
      console.log('dalysycdnrtj', response);
      if (response.status === 200) {
        var sjd = [];
        var mcda = [];
        debugger;
        if (response.data?.results?.length > 0) {
          for (var i = 0; i < response.data?.results?.length; i++) {
            var ysj = response.data.results[i];
            mcda.push(ysj.DAK_MC);
            sjd.push(ysj.LYCS);
          }
          this.mcdata = mcda;
          this.sjdata = sjd;
          setVmcdata(mcda);
          setVsjdata(sjd);
        }
        console.log('mcdata', this.mcdata);
        console.log('sjdata', this.sjdata);
      }
      componentDidMount();
    },
    async dalysylymdtj() {
      const response = await fetch.get(
        `/api/eps/control/main/daly/dalysylymdtj`,
      );
      console.log('dalysylymdtj', response);
      if (response.status === 200) {
        var sjData = [];
        if (response.data?.results?.length > 0) {
          for (var i = 0; i < response.data?.results?.length; i++) {
            var ysj = response.data.results[i];
            let newKey = {};
            newKey.name = ysj.DALYDJ_LYMD;
            newKey.value = ysj.LYCS;
            sjData.push(newKey);
          }
          this.lymdtjdata = sjData;
        }
        console.log('lymdtjdata', this.lymdtjdata);
      }
      componentDidMount();
    },
  }));

  const componentDidMount = () => {
    let columnDom = document.getElementById('columnChart');
    let pieDom = document.getElementById('pieChart');
    let columnChart = echarts.init(columnDom);
    let pieChart = echarts.init(pieDom);
    let option = {
      xAxis: {
        type: 'category',
        data: store.mcdata,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: store.sjdata,
          type: 'bar',
          barWidth: 16,
          itemStyle: {
            normal: {
              barBorderRadius: [10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#ba7ef3',
                },
                {
                  offset: 1,
                  color: '#965df2',
                },
              ]),
            },
          },
        },
      ],
    };
    let pieOption = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'right',
      },
      color: ['#F46472', '#F9D875', '#007BFF'],
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: store.lymdtjdata,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    columnChart.setOption(option);
    pieChart.setOption(pieOption);
  };

  const onchange = (e) => {
    store.radio = e.target.value;
  };

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
    if (store.radio == 2) {
      searchType = 'tm';
    }
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

  const openclickfunc = (e) => {
    window.top.parent.runFunc(e);
  };

  const dodaSearch = async (e) => {
    const dak = await fetch.post('/eps/control/main/dak/queryForId?id=' + e);
    const params = {
      umid: 'DALY001',
      umname: `${dak.data.mc}【档案利用】`,
      bmc: dak.data.mbc,
      dakid: e,
      lx: dak.data.lx,
      wzlk: 'N',
      type: 'K',
      mc: dak.data.mc,
      title: dak.data.bh + '|' + dak.data.mc,
      tmzt: 4,
    };
    console.log('params:' + params);
    history.push({
      pathname: `/runRfunc/archManage/${e}/4`,
      query: params,
    });
  };

  useEffect(() => {
    store.queryDzylssy();
    store.dalysycdnrtj();
    store.dalysylymdtj();
  }, []);

  return (
    <div className="main-lishui">
      <div className="part">
        <p className="title">操作功能</p>
        <div className="group">
          <li className="cell" onClick={() => openclickfunc('DADT0002')}>
            <img src={lydj} />
            <span>利用登记</span>
          </li>
          <li className="cell" onClick={() => openclickfunc('DALY001')}>
            <img src={daly} />
            <span>档案利用</span>
          </li>
          <li className="cell" onClick={() => openclickfunc('DATJ050')}>
            <img src={dlyqktj} />
            <span>利用情况统计</span>
          </li>
        </div>
      </div>
      <div className="part">
        <p className="title">快速查档</p>
        <div className="group">
          {store.daylsyData.map((item) => (
            <li
              key={item.dakid}
              className="cell"
              onClick={() => dodaSearch(item.dakid)}
            >
              <img src={item.img}></img>
              <span>{item.name}</span>
            </li>
          ))}
        </div>
      </div>
      <div className="part">
        <p className="title" style={{ marginBottom: 30 }}>
          全文检索
        </p>
        <Radio.Group value={store.radio} onChange={onchange}>
          <Radio value={1}>条目检索</Radio>
          <Radio value={2}>全文检索</Radio>
        </Radio.Group>
        <div className="search-content">
          <Input placeholder="在此区域输入域名" onChange={onkeyChange} />
          <Button type="primary" shape="round" onClick={doSearch}>
            <SearchOutlined />
            搜索
          </Button>
        </div>
      </div>
      <div className="part">
        <p className="title">查档内容统计</p>
        <div id="columnChart" style={{ height: 300 }}></div>
      </div>
      <div className="part">
        <p className="title">利用目的统计</p>
        <div id="pieChart" style={{ height: 300 }}></div>
      </div>
    </div>
  );
});
export default Dalysy;
