
import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react";
import { Bar, measureTextWidth } from '@ant-design/charts';
import chartService from './chartService'


const DemoBar = observer((props) => {
  const [data, setData]= useState<Array<{}>>([]);
  const [zl, setZL]= useState('');
  useEffect(()=>{
    chartService.findAll({}).then(res=>{
      if(res.code==="1"){
        var a=[];
        a.push({'type':'通过数','数量':res.tgzl})
        a.push({'type':'未通过数','数量':res.wtgzl})
        setZL(res.tgzl+res.wtgzl);
        setData(a);
      }
    });
  },[])

   var config = {
    appendPadding: 10,
    data: data,
    angleField: '数量',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: zl,
      },
    },
  };

  return (
    <>
        <Bar {...config} />
    </>
  );
})

export default DemoBar;
