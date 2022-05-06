import echarts from 'echarts';


const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: [
        'DOC', 'EXCEL', 'PPT', 'PPT', 'TXT',
      ],
      axisLabel: {
        formatter (name) {
          if (name.length < 8) {
            return `${name}`;
          }
          const str = `${name.substring(0, 7)}...`;
          return `${str}`;
        },
        fontSize: 10,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      minInterval: 1,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#DDDDDD',
          heigth: 1,
          type: 'solid',
          opacity: '0.8',
        },
      },
      splitArea: {
        show: false,
      },
      axisLabel: {
        fontSize: 10,
      },
    },
  ],
  series: [
    {
      name: '上传个数',
      type: 'bar',
      itemStyle: {
        normal: {
          barBorderRadius: [11, 11, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#45FCBE',
          }, {
            offset: 1,
            color: '#01D990',
          }]),
        },
      },
      barWidth: '22',
      barCategoryGap: '20%',
      barGap: '70%',
      data: [
        32, 33, 30, 28, 25,
      ],
    },
  ],
};

export default option;
