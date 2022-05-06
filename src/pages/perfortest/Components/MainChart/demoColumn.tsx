
import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react";
import { Column } from '@ant-design/charts';
import chartService from './chartService'


const DemoColumn: React.FC = () => {
  const [data, setData]= useState<Array<{}>>([]);
  useEffect(()=>{
    chartService.findAllSxtj({}).then(res=>{ 
      if(res.code==="1"){
        if(res.data){
          let  zjkData = res.data.map(o => ({ '类型':  o.lx, '数量':  o.SL, 'name':o.ZT}));
            setData(zjkData);
            console.log(zjkData);
        }
      }
    });
  },[])

    var data1 = [
    {
      name: 'London',
      类型: 'Jan.',
      数量: 18.9,
    },
    {
      name: 'London',
      类型: 'Feb.',
      数量: 28.8,
    },
    {
      name: 'Berlin',
      类型: 'Jan.',
      数量: 12.4,
    },
    {
      name: 'Berlin',
      类型: 'Feb.',
      数量: 23.2,
    }
  ];
 var config = {
    data: data,
    isGroup: true,
    xField: '类型',
    yField: '数量',
    seriesField: 'name',
    columnStyle: {
      radius: [10, 10],
    },
  };

 return <Column {...config} />;
};

export default DemoColumn;