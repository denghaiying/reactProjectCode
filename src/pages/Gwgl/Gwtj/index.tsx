import React from 'react';
import { useEffect } from 'react';
import './index.less';
import * as echarts from 'echarts';
import { observer } from 'mobx-react';
import { DatePicker, Button, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useLocalStore } from 'mobx-react';

const { RangePicker } = DatePicker;
const Gwtj = observer(() => {
  const store = useLocalStore(() => ({
    async didMount() {
      let columnDom = document.getElementById('app');
      let columnDoma = document.getElementById('appa');
      let columnDomab = document.getElementById('appab');
      let app = echarts.init(columnDom);
      let appa = echarts.init(columnDoma);
      let appab = echarts.init(columnDomab);
      let option = {
        title: {
          text: '公文统计',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World'],
        },
        series: [
          {
            name: '发文',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230],
          },
          {
            name: '收文',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807],
          },
        ],
      };
      let optiona = {
        title: {
          text: '发文统计',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230],
          },
          {
            name: '2012',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807],
          },
        ],
      };
      let optionab = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ['Evaporation', 'Precipitation', 'Temperature'],
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow',
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Precipitation',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} ml',
            },
          },
          {
            type: 'value',
            name: 'Temperature',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} °C',
            },
          },
        ],
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml';
              },
            },
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4,
              3.3,
            ],
          },
          {
            name: 'Precipitation',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml';
              },
            },
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
              2.3,
            ],
          },
          {
            name: 'Temperature',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' °C';
              },
            },
            data: [
              2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,
            ],
          },
        ],
      };
      app.setOption(option);
      appa.setOption(optiona);
      appab.setOption(optionab);
    },
  }));

  useEffect(() => {
    store.didMount();
  }, []);

  return (
    <>
      <div className="tjiBox">
        {/* 顶部标题 */}
        <div className="tjititle">
          <p>发文统计</p>
        </div>
        {/* 中间内容部分 */}
        <div className="tjizj">
          {/* 中间按钮居中 */}
          <div className="tjibtnBox">
            {/* 两排按钮 */}
            <div className="tjibtnBoxBox">
              {/* 第一排 */}
              <div className="tjbtnaboxa">
                {/* 前方文字 */}
                <div className="fawendata">
                  <p>发文日期：</p>
                </div>
                {/* 后面按钮 */}
                <div className="fawenanniu">
                  <Button className="fwanniu">全部</Button>
                  <Button className="fwanniu">今天</Button>
                  <Button className="fwanniu">本周</Button>
                  <Button className="fwanniu">本月</Button>
                  <Button className="fwanniu">上个月</Button>
                  <Button className="fwanniu">本季</Button>
                  <Button className="fwanniu">本年</Button>
                  <Button className="fwanniu">上一年</Button>
                  <Space className="fwanniua" direction="vertical" size={12}>
                    <RangePicker className="fwanniuaa" />
                  </Space>
                </div>
              </div>
              {/* 第二排 */}
              <div className="tjbtnaboxb">
                <div className="fawendata">
                  <p>发文部门：</p>
                </div>
                {/* 后面按钮 */}
                <div className="fawenanniu">
                  <Button className="fwanniu">总部</Button>
                  <Button className="fwanniu">分部</Button>
                  <Button className="fwanniu">部门</Button>
                  <div className="aniua">
                    <Input
                      className="fwanniuas"
                      suffix={
                        <SearchOutlined
                          className="dsadsadsa"
                          style={{ color: 'rgba(0,0,0,.45)' }}
                        />
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 分割线 */}
          <div className="tjifgx"></div>
          {/* 下方柱状图居中 */}
          <div className="tjibtnBoxa">
            {/* 前两个 */}
            <div className="tjizBoxa">
              {/* 第一排第一个 */}
              <div className="tjizBoxadyg">
                <div
                  id="app"
                  style={{
                    width: 500,
                    height: 210,
                    marginTop: 20,
                    marginLeft: 40,
                  }}
                ></div>
              </div>

              <div className="tjizBoxadeg">
                <div
                  id="appa"
                  style={{
                    width: 500,
                    height: 210,
                    marginTop: 20,
                    marginLeft: 40,
                  }}
                ></div>
              </div>
            </div>
            {/* 底部 */}
            <div className="tjizBoxb">
              <div
                id="appab"
                style={{
                  width: 1200,
                  height: 230,
                  marginTop: 40,
                  marginLeft: 30,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Gwtj;
