
import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react";
import { Pie, measureTextWidth } from '@ant-design/charts';
import chartService from './chartService'


const DemoPie = observer((props) => {
  const [data, setData]= useState<Array<{type:string;value:string}>>([]);
  const [zl, setZL]= useState('');
  useEffect(()=>{
    chartService.findAll({}).then(res=>{
       if(res.code==="1"){
        var a=[];
        a.push({'type':'通过数','value':res.tgzl})
        a.push({'type':'未通过数','value':res.wtgzl})
        setZL(res.tgzl+res.wtgzl);
        setData(a);
      }
    });
  },[])

  const renderStatistic = (containerWidth, text, style) => {
    var _measureTextWidth = (0, measureTextWidth)(text, style),
      textWidth = _measureTextWidth.width,
      textHeight = _measureTextWidth.height;
    var R = containerWidth / 2;
    var scale = 1;
    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
        ),
        1,
      );
    }
    var textStyleStr = 'width:'.concat(containerWidth, 'px;');
    return '<div style="'
      .concat(textStyleStr, ';font-size:')
      .concat(scale, 'em;line-height:')
      .concat(scale < 1 ? 1 : 'inherit', ';">')
      .concat(text, '</div>');
  }


  var config = {
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: zl,
      },
    },
  };

  return (
    <>
        <Pie {...config} />
    </>
  );
})

export default DemoPie;
