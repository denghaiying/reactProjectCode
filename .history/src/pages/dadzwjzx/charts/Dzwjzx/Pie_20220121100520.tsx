import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/charts';

const DemoPie = (props) => {
  debugger
  const data = [
    {
      type: '总数',
      value: props?.data?.zsl,
    },
    {
      type: '失败数',
      value: props?.data?.sbl,
    },
    {
      type: '正常数',
      value: props?.data?.zcl,
    },
    {
      type: '电子文件数量',
      value: props?.data?.fjs,
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
