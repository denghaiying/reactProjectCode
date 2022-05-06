
import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react";
import { Funnel } from '@ant-design/charts';
import chartService from './chartService'


const DemoFunnel  : React.FC = () => {
  const [data, setData]= useState<Array<{}>>([]);
  useEffect(()=>{
    chartService.findAll({}).then(res=>{
      debugger
      if(res.code==="1"){
        var a=[];
        a.push({'stage':'总数','number':res.zl})
        if(res.cgzl>res.sbzl){
          a.push({'stage':'成功数','number':res.cgzl})
          a.push({'stage':'失败数','number':res.sbzl})
        }else{
          a.push({'stage':'失败数','number':res.sbzl})
          a.push({'stage':'成功数','number':res.cgzl})
        }
        setData(a);
      }
    });
  },[])

 var config = {
    data: data,
    xField: 'stage',
    yField: 'number',
    legend: false,
  };

return <Funnel {...config} />;
};

export default DemoFunnel;
