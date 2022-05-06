
import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react";
import { Bar, measureTextWidth } from '@ant-design/charts';
import chartService from './chartService'


const DemoBar = observer((props) => {
  const [data, setData]= useState<Array<{}>>([]);
  useEffect(()=>{
    chartService.findAll({'jkpzid':props.jkpzid}).then(res=>{ 
      if(res.success && res.total>0){
        var a=[];
        a.push({'type':'未同步','数量':res.results.wtb})
        a.push({'type':'成功','数量':res.results.cg})
        a.push({'type':'失败','数量':res.results.sb})
        a.push({'type':'处理中','数量':res.results.clz})
        setData(a);
      }
      console.log(data);
    });
  },[props.jkpzid])

  var config = {
    data: data,
    xField: '数量',
    yField: 'type',
    legend: { position: 'top-left' },
    barBackground: { style: { fill: 'rgba(0,0,0,0.1)' } },
    interactions: [
      {
        type: 'active-region',
        enable: false,
      },
    ],
  };

  return (
    <>
        <Bar {...config} />
    </>
  );
})

export default DemoBar;