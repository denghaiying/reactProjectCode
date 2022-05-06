import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/charts';
import DajsService from './service/DajsService';

const DemoPie = (props) => {
  const [data, setData]= useState<Array<{}>>([]);
  useEffect(()=>{
    DajsService.qureydajstjPie({}).then(res=>{
      debugger
      if(res.code==="1"){
        if(res.data){
          let  zjkData = res.data.map(o => ({ '类型':  o.lx, '数量':  o.SL, 'name':o.ZT}));
            setData(zjkData);
            console.log(zjkData);
        }
      }
    });
  },[])

  const data = [
    {
      type: '开放总数量',
      value: props?.data?.KFZSL,
    },
    {
      type: '控制总数量',
      value: props?.data?.KZZSL,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};

export default DemoPie;
