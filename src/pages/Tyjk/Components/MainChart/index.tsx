import React, { useState,useEffect } from 'react';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { observer, } from 'mobx-react'
import PieChart from './pieChart'
import DemoBar from './demoBar';
import chartService from './chartService'




const { Statistic } = StatisticCard;
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
  useEffect(()=>{
    chartService.findAll({'jkpzid':props.jkpzid}).then(res=>{ 
      if(res.success && res.results){
        setData(res.results)
      }
    });
  },[props.jkpzid])
  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        title="数据概览"
        extra={dateFormat("YYYY-mm-dd WWW", new Date())}
        split={responsive ? 'horizontal' : 'vertical'}
        headerBordered
        bordered
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: '总数量',
                  value: data.zl,
                  // description: <Statistic title="较本月平均流量" value="8.04%" trend="down" />,
                 
                }}
                // chart={
                //   <ColumnChart height={"50px"}/>
                // }
              />
              <StatisticCard
                statistic={{
                  title: '未同步',
                  value: data.wtb,
                  // description: <Statistic title="较去年" value="8.04%" trend="up" />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '成功',
                  value: data.cg,
                  // description: <Statistic title="较去年" value="8.04%" trend="up" />,
                }}
              />
             
              <StatisticCard
                statistic={{
                  title: '失败',
                  value: data.sb,
                }}
              /> 
              <StatisticCard
                statistic={{
                  title: '处理中',
                  value: data.clz,
                }}
              /> 

            </ProCard>


          </ProCard>

          <ProCard split="vertical">
            <StatisticCard
              title=""
              chart={
                <DemoBar jkpzid={props.jkpzid}/>
              }
            />
            <StatisticCard
              title=""
              chart={
                <PieChart jkpzid={props.jkpzid}/>
              }
            />
          </ProCard>
        </ProCard>

      </ProCard>
    </RcResizeObserver>
  );
});