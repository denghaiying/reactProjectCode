import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';
import fetch from '../../../utils/fetch';
import dbxx from '../../../styles/assets/img/icon_db.png'
import jstj from '../../../styles/assets/img/icon_js.png'
import lytj from '../../../styles/assets/img/icon_lytj.png'
import ybxx from '../../../styles/assets/img/icon_ybxx.png'
import { useIntl } from 'umi';
import moment from 'moment';
import * as echarts from 'echarts';
import { runFunc } from '@/utils/menuUtils';
//var xzpkList=[];
const newHome = observer((props) => {
  const [vmcdata, setVmcdata] = useState([]);

  const [vsjdata, setVsjdata] = useState([]);

  const store = useLocalStore(() => ({
    radio: 1,
    keyparams: '',
    lymdtjdata: [],
    mcdata: [],
    sjdata: [],
    daylsyData: [],
    dbList:[],
    dbsize:0,
    ybList:[],
    ybsize:0,
    async dbquery() {
      const dburl = '/api/eps/workflow/dbsw/queryForPage?page=1&start=0&limit=10';
      const response = await fetch.post(dburl);
      this.dbList = [];
      if (response && response.status === 200) {
        this.dbList = response.data?.results;
        this.dbsize = response.data?.total;
      }
    },
    async ybquery() {
      const dburl = '/api/eps/workflow/dbsw/queryForPage?page=1&start=0&limit=10&ybzt=Y';
      const response = await fetch.post(dburl);
      this.ybList = [];
      if (response && response.status === 200) {
        this.ybList = response.data?.results;
        this.ybsize = response.data?.total;
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


  const intl = useIntl();
  const formatMessage = intl.formatMessage;

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

  const opendb=() =>{
    // RgjhomeStore.opendb();
     const params = {
       umid:  'WORKFLOW0002',
       umname: '待办事务',
       path:'/runRfunc/dbsw'
     };
     runFunc(params);
   }

   const handleSw=(record) =>{
    const params = {
      umid:  record.umid,
      umname: record.wfname,
      wfinst:record.wfinst,
      path:`/runRfunc/${record.gnurl}`
    };
    runFunc(params);
  }

  useEffect(() => {
    store.dbquery();
    store.ybquery();
    store.dalysycdnrtj();
    store.dalysylymdtj();
  }, []);



  // end **************

  return (
    <div className='newHome-page'>
    <div className='newHome-body'>
      <div className='common-line'>
        <div className='common-b'>
          <div className='title'>
            <img src={dbxx} alt=""/>
            <span className='val'>待办信息</span>
            <span className='num'>{store.dbsize}</span>
          </div>
          <div className='content'>
              {store.dbList && store.dbList.map(item => (
                    <div className='common-lines'>
                      <a href="javascript:;"  className='words' onClick={() => handleSw(item)}>{item.title ? item.title.substring(0, 15):item.title}</a>
                      <div className='time'>{moment(item.pbegin).format('YYYY-MM-DD')}</div>
                    </div>
                ))
              }
          </div>
        </div>
        <div className='common-b'>
          <div className='title'>
            <img src={ybxx} alt=""/>
            <span className='val'>已办信息</span>
            <span className='num'>{store.ybsize}</span>
          </div>
          <div className='content'>
          {store.ybList && store.ybList.map(item => (
                    <div className='common-lines'>
                      <a href="javascript:;"   className='words'  onClick={() => handleSw(item)}>{item.title ? item.title.substring(0, 15):item.title}</a>
                      <div className='time'>{moment(item.pbegin).format('YYYY-MM-DD')}</div>
                    </div>
                ))
              }
          </div>
        </div>
      </div>
      <div className='common-line'>
        <div className='common-b'>
          <div className='title'>
            <img src={lytj} alt=""/>
            <span className='val'>利用目的统计</span>
          </div>
          <div id="pieChart" className='content' style={{ height: 320 }}></div>
        </div>
        <div className='common-b'>
          <div className='title'>
            <img src={jstj} alt=""/>
            <span className='val'>查档内容统计</span>
          </div>
          <div id="columnChart" className='content' style={{ height: 320 }}></div>
        </div>
      </div>
    </div>
  </div>

  );
});
export default newHome;
