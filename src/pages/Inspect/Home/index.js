import React, { useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { injectIntl } from 'react-intl';
import IceContainer from '@icedesign/container';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import HomeStore from '../../../stores/inspect/HomeStore';
import './index.scss';

const Home = observer(props => {
  const { intl: { formatMessage } } = props;

  // 页面初始化
  useEffect(() => {
    HomeStore.reSetHglChartOption();
    HomeStore.reSetJcsOption();
    HomeStore.reSetBzjcOption();
    HomeStore.queryJb();
    HomeStore.queryZb();
  }, []);
  const option = '00';
  const hglChartOption = {
    //     backgroundColor: '#1b1b1b',
    title: {
      left: 'center',
      text: '本月合格率',
    },
    tooltip: {
      formatter: '{a} <br/>{c} {b}',
    },
    series: [{
      name: '原文',
      type: 'gauge',
      z: 3,
      min: 0,
      max: 100,
      splitNumber: 10,
      radius: '80%',
      pointer: {
        // 分隔线
        shadowColor: '#1b1b1b', // 默认透明
        shadowBlur: 5,
      },
      axisLine: {
        // 坐标轴线
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: [
            [0.6, 'red'],
            [0.8, '#f8d50cfd'],
            [1, 'lime'],
          ], // [[0.20, '#ff4500'],[0.80, '#1e90ff'],[1, 'lime']],
          width: 3,
          shadowColor: '#1b1b1b', // 默认透明
          shadowBlur: 10,
        },
      },
      axisTick: {
        // 坐标轴小标记
        length: 15, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: 'auto',
          shadowColor: '#1b1b1b', // 默认透明
          shadowBlur: 10,
        },
      },
      splitLine: {
        // 分隔线
        length: 20, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle（详见lineStyle）控制线条样式
          color: 'auto',
        },
      },
      axisLabel: {
        // 坐标轴小标记
        textStyle: {
          // 属性lineStyle控制线条样式
          fontWeight: 'bolder',
          color: '#1b1b1b',
          shadowColor: '#1b1b1b', // 默认透明
          shadowBlur: 10,
        },
      },
      title: {
        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: 'bolder',
        fontSize: 16,
        fontStyle: 'italic',
      },
      detail: {
        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        formatter (value) {
          value = (`${value}`).split('.');
          value.length < 2 && value.push(option);
          return (
            `${value[0]
            }.${(value[1] + option).slice(0, 2)}`
          );
        },
        fontWeight: 'bolder',
        borderRadius: 3,
        backgroundColor: '#444',
        borderColor: '#aaa',
        shadowBlur: 5,
        shadowColor: '#333',
        shadowOffsetX: 0,
        shadowOffsetY: 3,
        borderWidth: 1,
        textBorderColor: '#000',
        textBorderWidth: 2,
        textShadowColor: '#fff',
        textShadowOffsetX: 0,
        textShadowOffsetY: 0,
        fontFamily: 'Arial',
        fontSize: 20,
        width: 60,
        color: '#eee',
        rich: {},
      },
      data: [{
        value: HomeStore.hgldatalist,
        name: '原文（%）',
      }],
    }],
  };

  const jcsChartOption = {
    title: {
      left: 'center',
      text: '本月检测申请单',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    series: [{
      name: '本月检测申请',
      type: 'pie',
      selectedMode: 'single',
      radius: '70%',
      label: {
        normal: {
          formatter: '{b}: {c}',
          position: 'inner',
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      data: HomeStore.data2,
    }],
  };

  const bzjcChartOption = {
    title: {
      left: 'center',
      text: '本周检测统计',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      data: HomeStore.reSetBzjcdata,
      type: 'line',
      smooth: true,
    }],
  };


  return (
    <div className="workpage">
      <ContainerTitle />
      <table
        className="tjtbale"
        cellSpacing="0px"
        v-loading="jbLoading"
        element-loading-text="简报加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        cellPadding="0px"
      >
        <tr>
          <td rowSpan="5" className="wd15 br">
            <span className="wd15span">简报</span>
          </td>
          <td >
            <span > </span>
          </td>
          <td colSpan="2">
            <span className="wd10span">新增检测（</span>
            <span className="tmbtxz">条目</span>
            <span>|</span>
            <span className="ywbtxz">原文</span>
            <span className="wd10span">）</span>
          </td>
          <td colSpan="2">
            <span className="wd10span">合格总数（</span>
            <span className="tmbthg">条目</span>
            <span>|</span>
            <span className="tmbthg">原文</span>
            <span className="wd10span">）</span>
          </td>
          <td colSpan="2">
            <span className="wd10span">不合格总数（</span>
            <span className="tmbtbh">条目</span>
            <span>|</span>
            <span className="tmbtbh">原文</span>
            <span className="wd10span" >）</span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="wd10span">本年度</span>
          </td>
          <td className="bb br2">
            <span className="tmxz">{HomeStore.jb.xztm_nd}</span>
          </td>
          <td className="bb bl2">
            <span className="ywxz">{HomeStore.jb.xzyw_nd}</span>
          </td>
          <td className="bb br2">
            <span className="tmhg">{HomeStore.jb.hgtm_nd}</span>
          </td>
          <td className="bb bl2">
            <span className="ywhg">{HomeStore.jb.hgyw_nd}</span>
          </td>
          <td className="bb br2">
            <span className="tmbh">{HomeStore.jb.bhtm_nd}</span>
          </td>
          <td className="bb bl2">
            <span className="ywbh">{HomeStore.jb.bhyw_nd}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="wd10span">本季度</span>
          </td>
          <td className="bb br2">
            <span className="tmxz">{HomeStore.jb.xztm_jd}</span>
          </td>
          <td className="bb bl2">
            <span className="ywxz">{HomeStore.jb.xzyw_jd}</span>
          </td>
          <td className="bb br2">
            <span className="tmhg">{HomeStore.jb.hgtm_jd}</span>
          </td>
          <td className="bb bl2">
            <span className="ywhg">{HomeStore.jb.hgyw_jd}</span>
          </td>
          <td className="bb br2">
            <span className="tmbh">{HomeStore.jb.bhtm_jd}</span>
          </td>
          <td className="bb bl2">
            <span className="ywbh">{HomeStore.jb.bhyw_jd}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="wd10span">本&nbsp;&nbsp;月</span>
          </td>
          <td className="bb br2">
            <span className="tmxz">{HomeStore.jb.xztm_yd}</span>
          </td>
          <td className="bb bl2">
            <span className="ywxz">{HomeStore.jb.xzyw_yd}</span>
          </td>
          <td className="bb br2">
            <span className="tmhg">{HomeStore.jb.hgtm_yd}</span>
          </td>
          <td className="bb bl2">
            <span className="ywhg">{HomeStore.jb.hgyw_yd}</span>
          </td>
          <td className="bb br2">
            <span className="tmbh">{HomeStore.jb.bhtm_yd}</span>
          </td>
          <td className="bb bl2">
            <span className="ywbh">{HomeStore.jb.bhyw_yd}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="wd10span">本&nbsp;&nbsp;周</span>
          </td>
          <td className="bb br2">
            <span className="tmxz">{HomeStore.jb.xztm_bz}</span>
          </td>
          <td className="bb bl2">
            <span className="ywxz">{HomeStore.jb.xzyw_bz}</span>
          </td>
          <td className="bb br2">
            <span className="tmhg">{HomeStore.jb.hgtm_bz}</span>
          </td>
          <td className="bb bl2">
            <span className="ywhg">{HomeStore.jb.hgyw_bz}</span>
          </td>
          <td className="bb br2">
            <span className="tmbh">{HomeStore.jb.bhtm_bz}</span>
          </td>
          <td className="bb bl2">
            <span className="ywbh">{HomeStore.jb.bhyw_bz}</span>
          </td>
        </tr>
      </table>
      <table
        className="zbtbale"
        cellPadding="0px"
        cellSpacing="0px"
        v-loading="zbLoading"
        element-loading-text="指标加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <tr>
          <td rowSpan="3" className="wd15 br">
            <span>指标</span>
          </td>
          <td>
            <span > </span>
          </td>
          <td>
            <span className="wd10span">年度检测数</span>
          </td>
          <td>
            <span className="wd10span">合格率</span>
          </td>
          <td>
            <span className="wd10span">本周检测数</span>
          </td>
          <td>
            <span className="wd10span">合格率</span>
          </td>
        </tr>
        <tr>
          <td className="wd10">
            <span>条目</span>
          </td>
          <td>
            <span className="tmsl">{HomeStore.zb.tmsl_zs}</span>
          </td>
          <td>
            <span className="tmhg">{HomeStore.zb.tmhg_zs}%</span>
          </td>
          <td>
            <span className="tmsl">{HomeStore.zb.tmsl_bz}</span>
          </td>
          <td>
            <span className="tmhg">{HomeStore.zb.tmhg_bz}%</span>
          </td>
        </tr>
        <tr>
          <td className="wd10">
            <span>原文</span>
          </td>
          <td>
            <span className="ywsl">{HomeStore.zb.ywsl_zs}</span>
          </td>
          <td>
            <span className="ywhg">{HomeStore.zb.ywhg_zs}%</span>
          </td>
          <td>
            <span className="ywsl">{HomeStore.zb.ywsl_bz}</span>
          </td>
          <td>
            <span className="ywhg">{HomeStore.zb.ywhg_bz}%</span>
          </td>
        </tr>
      </table>
      <div className="echarts">
        <div style={{ height: '100%', width: '34%', display: 'inline', float: 'left' }}>
          <ReactEcharts style={{ height: '100%' }} option={hglChartOption} />
        </div>
        <div style={{ height: '100%', width: '33%', display: 'inline', float: 'left' }}>
          <ReactEcharts style={{ height: '100%' }} option={jcsChartOption} />
        </div>
        <div style={{ height: '100%', width: '33%', display: 'inline', float: 'right' }}>
          <ReactEcharts style={{ height: '100%' }} option={bzjcChartOption} />
        </div>
      </div>
    </div >
  );
});

export default injectIntl(Home);
