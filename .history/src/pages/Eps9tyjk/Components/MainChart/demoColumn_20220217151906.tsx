
import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react";
import { Column } from '@ant-design/charts';
import chartService from './chartService'


const DemoColumn = observer((props) => {
  const [data, setData]= useState<Array<{type:string;value:string}>>([]);
  const [zl, setZL]= useState('');
  useEffect(()=>{
    chartService.findAllSumtj().then(res=>{
      if(res.code==="1"){
        if(res.data){
          let  zjkData = res.data?.map(o => ({ '类型':  o.lx, '数量':  o.sl, 'name':o.name}));
            setData(zjkData);
            console.log(zjkData);
        }
      }
    });
  },[])
  useEffect(()=>{
    chartService.findAllSumtj(props.datasj).then(res=>{
      if(res.code==="1"){
        if(res.data){
          let  zjkData = res.data?.map(o => ({ '类型':  o.lx, '数量':  o.sl, 'name':o.name}));
            setData(zjkData);
            console.log(zjkData);
        }
      }
    });
  },[props.datasj])


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

  return (
    <>
        <Column {...config} />
    </>
  );
})

export default DemoColumn;
