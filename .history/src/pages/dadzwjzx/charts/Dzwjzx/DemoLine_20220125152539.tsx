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
        // 数值格式化为千分位
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
  };
  return <Line {...config} />;
};
export default DemoLine;
