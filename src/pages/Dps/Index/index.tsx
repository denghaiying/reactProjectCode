import React, { useEffect } from 'react';
import './index.less';
import { Table, Row, Col, DatePicker, Button, Card } from 'antd';
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
import fetch from '../../../utils/fetch';
import bianyan from './assets/img/icon_bianyan.png';
import todo from './assets/img/icon_todo.png';
import tongji from './assets/img/icon_tongji.png';
import xmxqChart from './echarts/xmxqChart';
import Chartsxm from './echarts/XmCharts';
import { runInAction } from 'mobx';
import { Tab } from '@alifd/next';
import moment from 'moment';
import cookie from 'react-cookies';

const Index = observer((props) => {
  const d = moment().format('YYYY-MM-DD');

  const IndexStore = useLocalObservable(() => ({
    worktaskData: [],
    rwData: [],
    sytxmData: [],
    sytxclData: [],
    sytxzlData: [],
    rwloading: true,
    date: '',
    tabKey: 'week',
    workdata: [],
    selectWorkData: [],
    processData: [],
    workcttData: [],
    async findWroktaskData(myChart) {
      const res = await fetch.get('/api/eps/dps/worktask/list/');
      var wc = 0;
      var wwc = 0;
      if (res.status == 200) {
        this.worktaskData = res.data;
        for (var i = 0; i < this.worktaskData.length; i++) {
          if (this.worktaskData[i].etime != null) {
            wc++;
          } else {
            wwc++;
          }
        }
        var zs = [
          { value: wc, name: '完成项目' },
          { value: wwc, name: '未完成项目' },
        ];
        xmxqChart.series[0].data = zs;
        myChart.setOption(xmxqChart, true);
      }
    },

    async findrwData() {
      const params = { params: {} };
      const res = await fetch.get('/api/eps/dps/worktask/syrwxq', params);
      if (res.status == 200) {
        this.rwData = res.data;
        this.rwloading = false;
      }
    },

    async syfindZs() {
      const params = { params: {} };
      const res = await fetch.get('/api/eps/dps/workload/syfindzs', params);
      if (res.status == 200) {
        this.sytxmData = res.data[0].txsm;
        this.sytxclData = res.data[1].txsm;
        this.sytxzlData = res.data[2].txsm;
      }
    },

    async findWorkdata() {
      const response = await fetch.get('/api/eps/dps/work/list/');
      if (response.status === 200) {
        if (response.data.length > 0) {
          this.workdata = response.data.map(
            (item: { code: any; name: any }) => ({
              value: item.code,
              label: item.name,
            }),
          );
          this.selectWorkData = this.workdata;
        }
      }
    },

    async findxm(myChart, params) {
      const response = await fetch.get(`/eps/dps/project/findxm/`, { params });
      if (response && response.status === 200) {
        runInAction(() => {
          Chartsxm.xAxis[0].data = [];
          Chartsxm.xAxis[0].data = response.data.dateList;
          Chartsxm.series[0].data = [];
          Chartsxm.series[0].data = response.data.typeOne;
          Chartsxm.series[1].data = [];
          Chartsxm.series[1].data = response.data.typeTwo;
          Chartsxm.series[2].data = [];
          Chartsxm.series[2].data = response.data.typeThree;
          myChart.setOption(Chartsxm, true);
        });
      }
    },
  }));
  useEffect(() => {
    xmxq();
    IndexStore.findrwData();
    IndexStore.syfindZs();
    IndexStore.findWorkdata();
    getDate();
  }, []);

  const xmxq = () => {
    const myChart = echarts.init(document.getElementById('xmxq'));
    IndexStore.findWroktaskData(myChart);
  };
  const tabs = [
    { tab: '周', key: 'week' },
    { tab: '月', key: 'month' },
    { tab: '年', key: 'year' },
  ];

  //禁用日期
  const disabledDate = function (date) {
    return date.valueOf() > moment().valueOf();
  };
  //选择日期
  const onChange = (value) => {
    IndexStore.date = moment(value).format('YYYY-MM-DD');
    getDate();
  };
  //查询
  const getDate = () => {
    Allxmdata();
  };
  //查询图表数据
  const Allxmdata = () => {
    IndexStore.date = IndexStore.date === '' ? d : IndexStore.date;
    const record = {
      selectDate: IndexStore.date,
      type: IndexStore.tabKey == 'week' ? 'week' : IndexStore.tabKey,
    };
    const dom = document.getElementById('allxmdata');
    if (dom) {
      const myChart = echarts.init(dom);
      IndexStore.findxm(myChart, record);
    }
  };
  //切换时间tab
  const changeTab = (value) => {
    IndexStore.tabKey = value.key;
    IndexStore.date = IndexStore.date === '' ? d : IndexStore.date;
    const record = {
      selectDate: IndexStore.date,
      type: value.key,
    };
    const dom = document.getElementById('allxmdata');
    if (dom) {
      const myChart = echarts.init(dom);
      IndexStore.findxm(myChart, record);
    }
    getDate();
  };
  const rwcolumns = [
    {
      title: '项目名称',
      dataIndex: 'xmmc',
      width: '150px',
      key: 'xmmc',
    },
    {
      title: '任务总数',
      dataIndex: 'rwzs',
      width: '150px',
      key: 'rwzs',
    },
    {
      title: '已完成任务数',
      dataIndex: 'ywcrws',
      width: '150px',
      key: 'ywcrws',
    },
    {
      title: '任务总份数',
      dataIndex: 'rwzfs',
      width: '150px',
      key: 'rwzfs',
    },
    {
      title: '已完成任务总份数',
      dataIndex: 'yrwzfs',
      width: '150px',
      key: 'yrwzfs',
    },
  ];
  const onOpenClick = () => {
    const Linuxurl = 'Application:';
    const params =
      'ip=' +
      location.hostname +
      '&port=' +
      location.port +
      '&token=' +
      cookie.load('ssotoken');
    console.log(Linuxurl + params);
    window.location.href = Linuxurl + params;
  };

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
              <span>简报</span>
            </span>
          </div>
          <div className="inner-row">
            <div className="part2">
              <Row justify="space-around" style={{ paddingTop: 40 }}>
                <Col span={6}>
                  <div className="innerCardOne">
                    <div className="radius">{IndexStore.sytxmData}</div>
                    <div className="subTitle" onClick={onOpenClick}>
                      图像扫描总数
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="innerCardTwo">
                    <div className="radius">{IndexStore.sytxclData}</div>
                    <div className="subTitle">图像处理总数</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="innerCardThree">
                    <div className="radius">{IndexStore.sytxzlData}</div>
                    <div className="subTitle">图像著录总数</div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="part part5">
          <div className="head">
            <span className="head-left">
              <img src={todo} alt="" style={{ marginRight: 10 }} />
              <span>任务进度</span>
            </span>
          </div>
          <div className="content">
            <Table
              pagination={{ pageSize: 15, size: 'small' }}
              columns={rwcolumns}
              dataSource={IndexStore.rwData}
              className="record-bottomtable"
              loading={IndexStore.rwloading}
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
        <div className="part part3">
          <div className="head">
            <span className="head-left">
              <Row>
                <Col>
                  <img src={tongji} alt="" style={{ marginRight: 10 }} />
                </Col>
                <Col>
                  <span>项目简报</span>
                </Col>
                <Col span={5}>
                  <DatePicker
                    size="small"
                    defaultValue={moment()}
                    disabledDate={disabledDate}
                    onChange={onChange}
                    allowClear={false}
                    style={{ width: '90px' }}
                    suffixIcon=""
                    placeholder={'请选择日期'}
                  />
                </Col>
                <Col span={9} style={{ marginLeft: 20 }}>
                  <Tab shape="text" size="small">
                    {tabs.map((item) => (
                      <Tab.Item
                        key={item.key}
                        title={item.tab}
                        onClick={() => changeTab(item)}
                      />
                    ))}
                  </Tab>
                </Col>
              </Row>
            </span>
          </div>
          <div className="inner">
            <div style={{ height: '280px' }} id="allxmdata" />
          </div>
        </div>
        <div className="part part8">
          <div className="head">
            <span className="head-left">
              <img src={tongji} alt="" style={{ marginRight: 10 }} />
              <span>项目详情</span>
            </span>
          </div>
          <div className="content">
            <div id="xmxq" style={{ height: '400px' }} />
          </div>
        </div>
      </div>
    </div>
  );
});
export default Index;
