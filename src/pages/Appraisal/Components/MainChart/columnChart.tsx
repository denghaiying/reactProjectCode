import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';

const DemoColumn: React.FC = (props) => {
  var data = [
    {
      type: '一文一件',
      sales: 38,
    },
    {
      type: '案卷',
      sales: 38,
    },
    {
      type: '卷内',
      sales: 38,
    },
  ];
  var config = {
    data: data,
    xField: 'type',
    yField: 'sales',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: { alias: '类别' },
      sales: { alias: '销售额' },
    },
  };
  return <Column height={100}  {...config} />;
};

export default DemoColumn;