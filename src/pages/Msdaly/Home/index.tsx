import React, { useEffect } from 'react';
import './index.less';
import { Calendar, Select, Radio, Input, Button, Table } from 'antd';
import { useModel, useIntl, history } from 'umi';
import { observer, useLocalObservable } from 'mobx-react';
import * as echarts from 'echarts';
// 引入饼状图\线形图、柱状图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import SysStore from '@/stores/system/SysStore';
import fetch from '../../../utils/fetch';
import bianyan from './assets/img/icon_bianyan.png';
import todo from './assets/img/icon_todo.png';
import tongji from './assets/img/icon_tongji.png';
import ChartL1 from './echarts/chart-l-1';
import ChartL2 from './echarts/chart-l-2';
import ChartL3 from './echarts/chart-l-3';
import { runFunc } from '@/utils/menuUtils';
const { Option } = Select;

const newHome = observer((props) => {
  const HomeStore = useLocalObservable(() => ({
    dshdata: [],
    dshloading: true,
    dczdata: [],
    dczloading: true,
    async getDczData() {
      const params = { params: {} };
      const res = await fetch.get(
        `/api/eps/e9msdaly/lasqd/dczlist/${SysStore.getCurrentCmp().id}`,
        params,
      );
      if (res.status == 200) {
        this.dczdata = res.data;
        this.dczloading = false;
      } else {
        this.dczloading = false;
      }
    },
    async getDshData() {
      const params = { params: {} };
      const res = await fetch.get(
        `/api/eps/e9msdaly/lasqd/dshlist/${SysStore.getCurrentCmp().id}`,
        params,
      );
      if (res.status == 200) {
        this.dshdata = res.data;
        this.dshloading = false;
      } else {
        this.dshloading = false;
      }
    },
    async setChartLeft1(myChart) {
      const params = { params: {} };
      const pmgnData = [];
      const response = await fetch.get(
        `/api/eps/e9msdaly/lasqd/findMydtj/${SysStore.getCurrentCmp().id}`,
        params,
      );
      debugger;
      if (response && response.status === 200) {
        pmgnData.push(response.data);
        ChartL1.series[0].data = pmgnData;
        myChart.setOption(ChartL1, true);
      } else {
        myChart.setOption(ChartL1);
      }
    },
    async setChartLeft2(myChart) {
      const params = { params: {} };
      const response = await fetch.get(
        `/api/eps/e9msdaly/lasqd/findDalxtj/${SysStore.getCurrentCmp().id}`,
        params,
      );
      if (response && response.status === 200) {
        if (response && response.data.length > 0) {
          const dalxData = [];
          response.data.forEach((item) => {
            dalxData.push(item.name);
          });
          ChartL2.series[0].data = response.data;
          ChartL2.legend.data = dalxData;
          myChart.setOption(ChartL2, true);
        } else {
          myChart.setOption(ChartL2);
        }
      } else {
        myChart.setOption(ChartL2);
      }
    },
    async setChartLeft3(myChart) {
      const dayData = [];
      const slsqData = [];
      const cdclData = [];
      const response = await fetch.get(
        `/api/eps/e9msdaly/lasqd/findlyqktj/${SysStore.getCurrentCmp().id}`,
      );
      if (response && response.status === 200) {
        if (response && response.data.length > 0) {
          response.data.forEach((item) => {
            dayData.push(item.day);
            slsqData.push(item.slsq);
            cdclData.push(item.cdcl);
          });
          ChartL3.series[0].data = slsqData;
          ChartL3.series[1].data = cdclData;
          ChartL3.xAxis[0].data = dayData;
          myChart.setOption(ChartL3, true);
        } else {
          myChart.setOption(ChartL3);
        }
      } else {
        myChart.setOption(ChartL3);
      }
    },
  }));
  useEffect(() => {
    HomeStore.getDshData();
    HomeStore.getDczData();
    doChartLeft1();
    doChartLeft2();
    doChartLeft3();
  }, []);
  // 左上,满意度统计
  const doChartLeft1 = () => {
    const myChart = echarts.init(document.getElementById('chart_left_1'));
    HomeStore.setChartLeft1(myChart);
  };
  // 左中,档案种类统计
  const doChartLeft2 = () => {
    const myChart = echarts.init(document.getElementById('chart_left_2'));
    HomeStore.setChartLeft2(myChart);
  };
  // 左下,利用情况统计
  const doChartLeft3 = () => {
    const myChart = echarts.init(document.getElementById('chart_left_3'));
    HomeStore.setChartLeft3(myChart);
  };
  // 带参打开受理申请
  const openCdslsq = (dalx) => {
    // const params = { dalx: dalx, umname: "受理申请" }
    // debugger
    // history.push({ pathname: '/runRfunc/cdslsq', query: params })
    const params = { umname: '受理申请', path: '/runRfunc/cdslsq' };
    onAddTab(params);
  };
  // 打开待审核业务
  const openCddsh = () => {
    const params = { umname: '待审核业务', path: '/runRfunc/cddsh' };
    onAddTab(params);
  };
  const openTmCddsh = (tmid) => {
    const params = { umname: '待审核业务', path: '/runRfunc/cddsh', id: tmid };
    onAddTab(params);
  };
  //  打开待出证业务
  const openCddcz = () => {
    const params = { umname: '待出证业务', path: '/runRfunc/cddcz' };
    onAddTab(params);
  };
  const openTmCddcz = (tmid) => {
    const params = { umname: '待出证业务', path: '/runRfunc/cddcz', id: tmid };
    onAddTab(params);
  };
  const onAddTab = (params) => {
    debugger;
    console.log(top.mainStore);
    if (top.mainStore) {
      runFunc(params);
      return;
    }
    // top.mainStore.addTab(params, params.key, params);
    // return;
  };
  const dshcolumns = [
    {
      title: '查档档案馆',
      dataIndex: 'cdgmc',
      width: '150px',
      key: 'cdgmc',
    },
    {
      title: '受理流水号',
      dataIndex: 'id',
      width: '100px',
      key: 'id',
    },
    {
      title: '受理时间',
      dataIndex: 'jdsj',
      width: '150px',
      key: 'jdsj',
    },
    {
      title: '受理档案馆',
      dataIndex: 'sldagmc',
      width: '150px',
      key: 'sldagmc',
    },
    {
      title: '受理人',
      dataIndex: 'jdr',
      width: '150px',
      key: 'jdr',
    },
    {
      title: '办理状态',
      dataIndex: 'status',
      width: '80px',
      key: 'status',
      render: (text, record, index) => {
        if (text === 0) {
          return '待受理申请';
        }
        if (text === 3) {
          return '待审核';
        }
        if (text === 4) {
          return '待出证';
        }
        if (text === 7) {
          return '完成';
        }
      },
    },
    {
      title: '操作',
      dataIndex: '',
      width: '80px',
      key: 'opt',
      render: (_, record) => {
        return (
          <span>
            <a
              href="javascript:;"
              onClick={(event) => {
                event.nativeEvent.stopImmediatePropagation();
                event.stopPropagation();
                openTmCddsh(record.id);
              }}
              style={{
                marginRight: 8,
              }}
            >
              待审核
            </a>
          </span>
        );
      },
    },
  ];
  const dczcolumns = [
    {
      title: '查档档案馆',
      dataIndex: 'cdgmc',
      width: '150px',
      key: 'cdgmc',
    },
    {
      title: '受理流水号',
      dataIndex: 'id',
      width: '100px',
      key: 'id',
    },
    {
      title: '受理时间',
      dataIndex: 'jdsj',
      width: '150px',
      key: 'jdsj',
    },
    {
      title: '受理档案馆',
      dataIndex: 'sldagmc',
      width: '150px',
      key: 'sldagmc',
    },
    {
      title: '受理人',
      dataIndex: 'jdr',
      width: '150px',
      key: 'jdr',
    },
    {
      title: '办理状态',
      dataIndex: 'status',
      width: '80px',
      key: 'status',
      render: (text, record, index) => {
        if (text === 0) {
          return '待受理申请';
        }
        if (text === 1) {
          return '退回待处理';
        }
        if (text === 3) {
          return '待审核';
        }
        if (text === 4) {
          return '待出证';
        }
        if (text === 7) {
          return '完成';
        }
      },
    },
    {
      title: '操作',
      dataIndex: '',
      width: '80px',
      key: 'opt',
      render: (_, record) => {
        return (
          <span>
            <a
              href="javascript:;"
              onClick={(event) => {
                event.nativeEvent.stopImmediatePropagation();
                event.stopPropagation();
                openTmCddcz(record.id);
              }}
              style={{
                marginRight: 8,
              }}
            >
              待出证
            </a>
          </span>
        );
      },
    },
  ];
  // end **************

  return (
    <div className="home-page">
      <div className="center">
        <div className="part part4">
          <div className="head">
            <span className="head-left">
              <img
                src={bianyan}
                className="icon-label"
                alt=""
                style={{ marginRight: 10 }}
              />
              <span>受理申请</span>
            </span>
            <span className="right-link" onClick={() => openCdslsq('')}>
              {'< 进入 >'}
            </span>
          </div>
          <div className="inner-row">
            <a className="marg" href="#" onClick={() => openCdslsq('婚姻档案')}>
              <span className="icon"></span>
            </a>
            <a
              className="licld"
              href="#"
              onClick={() => openCdslsq('复退军人档案')}
            >
              <span className="icon"></span>
            </a>
            <a
              className="yng"
              href="#"
              onClick={() => openCdslsq('干部介绍信档案')}
            >
              <span className="icon"></span>
            </a>
            {/* <a className="plus">
              <span className="icon"></span>
            </a> */}
          </div>
        </div>
        <div className="part part5">
          <div className="head">
            <span className="head-left">
              <img src={todo} alt="" style={{ marginRight: 10 }} />
              <span>待审核业务</span>
            </span>
            <span className="right-link" onClick={() => openCddsh()}>
              {'< 更多 >'}
            </span>
          </div>
          <div className="content">
            <Table
              bordered
              columns={dshcolumns}
              dataSource={HomeStore.dshdata}
              pagination={false}
              className="record-bottomtable"
              loading={HomeStore.dshloading}
              expandable={{ defaultExpandAllRows: true }}
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    event.nativeEvent.stopImmediatePropagation();
                    event.stopPropagation();
                    console.log(record);
                  },
                };
              }}
            />
          </div>
        </div>
        <div className="part part6">
          <div className="head">
            <span className="head-left">
              <img src={todo} alt="" style={{ marginRight: 10 }} />
              <span>待出证业务</span>
            </span>
            <span className="right-link" onClick={() => openCddcz()}>
              {'< 更多 >'}
            </span>
          </div>
          <div className="content">
            <Table
              bordered
              columns={dczcolumns}
              dataSource={HomeStore.dczdata}
              pagination={false}
              className="record-bottomtable"
              loading={HomeStore.dczloading}
              expandable={{ defaultExpandAllRows: true }}
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    event.nativeEvent.stopImmediatePropagation();
                    event.stopPropagation();
                    console.log(record);
                  },
                };
              }}
            />
          </div>
        </div>
      </div>
      <div className="right">
        <div className="part part2">
          <div className="head">
            <span className="head-left">
              <img src={tongji} alt="" style={{ marginRight: 10 }} />
              <span>满意度统计</span>
            </span>
          </div>
          <div className="inner">
            <div id="chart_left_1" style={{ height: '300px' }} />
          </div>
        </div>
        <div className="part part8">
          <div className="head">
            <span className="head-left">
              <img src={tongji} alt="" style={{ marginRight: 10 }} />
              <span>档案种类统计</span>
            </span>
          </div>
          <div className="content">
            <div id="chart_left_2" style={{ height: '400px' }} />
          </div>
        </div>
        <div className="part part9">
          <div className="head">
            <span className="head-left">
              <img src={tongji} alt="" style={{ marginRight: 10 }} />
              <span>利用情况统计</span>
            </span>
          </div>
          <div className="content">
            <div id="chart_left_3" style={{ height: '420px' }} />
          </div>
        </div>
      </div>
    </div>
  );
});
export default newHome;
