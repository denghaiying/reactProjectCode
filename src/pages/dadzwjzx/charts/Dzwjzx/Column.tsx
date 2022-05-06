import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/charts';
import tableService from './tableService'
import SysStore from '@/stores/system/SysStore';

const DemoColumn = () => {
  const [data, setData]= useState<Array<{}>>([]);
  useEffect(()=>{
    tableService.querydzwjColumn({dwid:SysStore.getCurrentUser().dwid}).then(res=>{ 
      if(res.success){
        if(res.results){
          let  zjkData = res.results.map(o => ({ '类型':  o.lx, '数量':  o.sl, 'name':o.zt}));
            setData(zjkData);
            console.log(zjkData);
        }
      }
    });
  },[])

  const config = {
    data: data,
    isGroup: true,
    xField: '类型',
    yField: '数量',
    seriesField: 'name',
    columnStyle: {
      radius: [10, 10,10,10],
    },
  };
  return <Column {...config} />;
};
export default DemoColumn;
