import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/charts';
import zlyjjsService from './service/YjjsService';

const DemoPie = (props) => {
  const [data, setData] = useState<Array<{}>>([]);
  useEffect(() => {
    zlyjjsService.qureydajstjPie({}).then((res) => {
      if (res) {
        let zjkData = res?.map((o) => ({ type: o.ZT, value: o.SL }));
        setData(zjkData);
        console.log(zjkData);
      }
    });
  }, []);

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
