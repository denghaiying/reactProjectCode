import React, { useState, useEffect } from 'react';
import ProCard, { StatisticCard }  from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { observer, } from 'mobx-react'
import PieChart from './pieChart'
import DemoBar from './demoBar';
import DemoFunnel from './demoFunnel';
import DemoColumn from './demoColumn';
import { Avatar,Form, DatePicker, Button } from 'antd';
import moment, { isMoment } from 'moment';
import chartService from './chartService'

const { Statistic } = StatisticCard;
const { RangePicker } = DatePicker;
/*
        * 若文档中已有命名dateFormat，可用dFormat()调用
        * 年(Y) 可用1-4个占位符
        * 月(m)、日(d)、小时(H)、分(M)、秒(S) 可用1-2个占位符
        * 星期(W) 可用1-3个占位符
        * 季度(q为阿拉伯数字，Q为中文数字)可用1或4个占位符
        *
        * let date = new Date()
        * dateFormat("YYYY-mm-dd HH:MM:SS", date)           2020-02-09 14:04:23
        * dateFormat("YYYY-mm-dd HH:MM:SS Q", date)         2020-02-09 14:09:03 一
        * dateFormat("YYYY-mm-dd HH:MM:SS WWW", date)       2020-02-09 14:45:12 星期日
        * dateFormat("YYYY-mm-dd HH:MM:SS QQQQ", date)      2020-02-09 14:09:36 第一季度
        * dateFormat("YYYY-mm-dd HH:MM:SS WWW QQQQ", date)  2020-02-09 14:46:12 星期日 第一季度
    */
  function dateFormat(format,date){
    let we = date.getDay();                                 // 星期
    let qut = Math.floor((date.getMonth()+3)/3).toString(); // 季度
    const opt = {
        "Y+":date.getFullYear().toString(),                 // 年
        "m+":(date.getMonth()+1).toString(),                // 月(月份从0开始，要+1)
        "d+":date.getDate().toString(),                     // 日
        "H+":date.getHours().toString(),                    // 时
        "M+":date.getMinutes().toString(),                  // 分
        "S+":date.getSeconds().toString(),                  // 秒
        "q+":qut, // 季度
    };
    const week = {      // 中文数字 (星期)
        "0":"日",
        "1":"一",
        "2":"二",
        "3":"三",
        "4":"四",
        "5":"五",
        "6":"六"
    };
    const quarter = {   // 中文数字（季度）
        "1" : "一",
        "2" : "二",
        "3" : "三",
        "4" : "四",
    };
    if(/(W+)/.test(format)){
        format = format.replace(RegExp.$1,(RegExp.$1.length >1 ? (RegExp.$1.length >2 ? '星期'+week[we] : '周'+week[we]) : week[we]))
    };
    if (/(Q+)/.test(format)) {
        // 输入一个Q，只输出一个中文数字，输入4个Q，则拼接上字符串
        format = format.replace(RegExp.$1,(RegExp.$1.length == 4 ? '第'+quarter[qut]+'季度' : quarter[qut]));
    };
    for(let k in opt){
        let r = new RegExp("("+k+")").exec(format);
        if(r){
            // 若输入的长度不为1，则前面补零
            format = format.replace(r[1],(RegExp.$1.length == 1 ? opt[k] : opt[k].padStart(RegExp.$1.length,'0')))
        }
    };
    return format;
  };




export default observer((props) => {
  const [responsive, setResponsive] = useState(false);
  const [data,setData]=useState({});
  const [params, setYParams] = useState({});
  const [form] = Form.useForm();
  useEffect(()=>{
    chartService.findAll().then(res=>{
      if(res.code==="1"){
        setData(res)
      }
    });
    //form.setFields({});
  },[])

  const doSearchAction = (formData) => {
    const { datebe } = formData;
    const dateb = datebe && datebe[0];
    const datee = datebe && datebe[1];
    const params = {};
    if (dateb && isMoment(dateb)) {
      params.dateb = dateb.format("YYYY-MM-DD");
    }
    if (datee && isMoment(datee)) {
      params.datee = datee.format("YYYY-MM-DD");
    }
    setYParams(params);
    chartService.findAll(params).then(res=>{
      if(res.code==="1"){
        setData(res)
      }
    });
  };

  return (
    <>
    <div style={{marginLeft: "10px"}}>
      <Form
      onFinish={(formData) => doSearchAction(formData)}
      layout={"inline"}
      form={form}
      >
        <Form.Item name="datebe">
          <RangePicker />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType={"submit"}>查询</Button>
        </Form.Item>
      </Form>
    </div>  
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard style={{ marginTop: 8 }} extra={dateFormat("YYYY-mm-dd WWW", new Date())} bordered headerBordered gutter={6} wrap title="数据概览">
        <ProCard style={{backgroundColor:'#bae7ff' }} title="移交单位数量" colSpan={{ xs: 18, sm: 16, md: 25, lg: 8, xl: 6 }} layout="center" bordered>
          {data.yjdws}
        </ProCard>
        <ProCard style={{backgroundColor:'#b5f5ec' }}title="移交卷数量" colSpan={{ xs: 18, sm: 16, md: 25, lg: 8, xl: 6 }} layout="center" bordered>
          {data.yjwjs}
        </ProCard>
        <ProCard style={{backgroundColor:'#b5f5ec' }} title="移交卷内数量" colSpan={{ xs: 18, sm: 16, md: 12, lg: 8, xl: 6 }} layout="center" bordered>
          {data.yjajs}
        </ProCard>
        <ProCard style={{backgroundColor:'#fffb8f' }} title="移交原文大小" colSpan={{ xs: 18, sm: 16, md: 12, lg: 25, xl: 6 }} layout="center" bordered>
          {data.yjywsize}
        </ProCard>
        <ProCard style={{backgroundColor:'#bae7ff' }}  title="接收单位数量" colSpan={{ xs: 25, sm: 30, md: 30, lg: 8, xl: 6 }} layout="center" bordered>
          {data.jsdws}
        </ProCard>
        <ProCard  style={{backgroundColor:'#b5f5ec' }} title="接收卷数量" colSpan={{ xs: 18, sm: 16, md: 12, lg: 8, xl: 6 }} layout="center" bordered>
          {data.jswjs}
        </ProCard>
        <ProCard  style={{backgroundColor:'#b5f5ec' }} title="接收卷内数量" colSpan={{ xs: 18, sm: 16, md: 12, lg: 8, xl: 6}} layout="center" bordered>
          {data.jsajs}
        </ProCard>
        <ProCard   style={{backgroundColor:'#fffb8f' }}  title="接收原文大小" colSpan={{ xs: 18, sm: 16, md: 12, lg: 8, xl: 6 }} layout="center" bordered>
          {data.jsywsize}
        </ProCard>
      </ProCard>
      <ProCard style={{ marginTop: 8 }} gutter={8} title="数据图表">
        <ProCard layout="center" bordered>
          <PieChart datasj={params}/>
        </ProCard>
         <ProCard layout="center" bordered>
          <DemoColumn datasj={params}/>
        </ProCard>
      </ProCard>
    </RcResizeObserver>
    </>
  );
});
