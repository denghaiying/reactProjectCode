import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/charts';
import DajsService from './service/DajsService';

const DemoColumn = () => {
  const [data, setData] = useState<Array<{}>>([]);
  useEffect(() => {
    DajsService.qureydajstjColumn({}).then((res) => {
      if (res) {
        let zjkData = res?.map((o) => ({
          年度: o.YDNAME,
          数量: o.SL,
          name: o.YDNAME,
        }));
        setData(zjkData);
        console.log(zjkData);
      }
    });
  }, []);

  const config = {
    data,
    isGroup: true,
    xField: '年度',
    yField: '数量',
    seriesField: 'name',

    /** 设置颜色 */
    //color: ['#1ca9e6', '#f88c24'],

    /** 设置间距 */
    // marginRatio: 0.1,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'middle', 'bottom'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: 'interval-adjust-position',
        }, // 数据标签防遮挡
        {
          type: 'interval-hide-overlap',
        }, // 数据标签文颜色自动调整
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  return <Column {...config} />;
};
export default DemoColumn;
