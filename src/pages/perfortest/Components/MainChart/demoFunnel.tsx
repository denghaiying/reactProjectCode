
import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react";
import { Funnel } from '@ant-design/charts';
import chartService from './chartService'


const DemoFunnel  : React.FC = () => {
  const [data, setData]= useState<Array<{}>>([]);
  useEffect(()=>{
    chartService.findAll({}).then(res=>{
      if(res.code==="1"){
        var a=[];
        a.push({'stage':'总数','number':res.zl})
        if(res.tgzl>res.wtgzl){
          a.push({'stage':'通过数','number':res.tgzl})
          a.push({'stage':'未通过数','number':res.wtgzl})
        }else{
          a.push({'stage':'未通过数','number':res.wtgzl})
          a.push({'stage':'通过数','number':res.tgzl})
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
