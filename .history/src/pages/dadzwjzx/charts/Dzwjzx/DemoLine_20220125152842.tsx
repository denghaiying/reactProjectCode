import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
import tableService from './tableService'
import SysStore from '@/stores/system/SysStore';

const DemoLine = () => {
  const [data, setData]= useState<Array<{}>>([]);
  useEffect(()=>{
    tableService.querydzwjLine({dwid:SysStore.getCurrentUser().dwid}).then(res=>{
      if(res.success){
        if(res.results){
          let  zjkData = res.results.map(o => ({ 'nd':  o.nd, 'value':  o.sl, 'name':o.zt}));
            setData(zjkData);
            console.log(zjkData);
        }
      }
    });
  },[])

  const config = {
    data: data,
    xField: 'nd',
    yField: 'value',
    seriesField: 'name',
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {
        formatter: (v) => `${(v / 10e8).toFixed(1)} B`,
      },
    },
  };
  return <Line {...config} />;
};
export default DemoLine;
