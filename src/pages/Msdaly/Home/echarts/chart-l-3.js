const option = {
  color: ['#4cabce', '#006699'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    textStyle: {
      fontSize: 10,
    },
    data: ['受理申请', '查档处理'],
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: [
        '11月1日',
        '11月2日',
        '11月3日',
        '11月4日',
        '11月5日',
        '11月6日',
        '11月7日',
      ],
      axisLabel: {
        formatter(name) {
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
      name: '受理申请',
      type: 'bar',
      itemStyle: {
        normal: {
          barBorderRadius: [11, 11, 0, 0],
          color: '#65BBFC',
        },
      },
      barWidth: '10',
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: '查档处理',
      type: 'bar',
      itemStyle: {
        normal: {
          barBorderRadius: [11, 11, 0, 0],
          color: '#775DD0',
        },
      },
      barWidth: '10',
      data: [0, 0, 0, 0, 0, 0, 0],
    },
  ],
};

export default option;
