const option = {
  title: {
    text: '',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    data: ['项目数量','项目组数量','工序数量'],
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      itemStyle: {
        normal: {
          color: '#d14a61', // 折点颜色
        },
      },
      name: '项目数量',
      type: 'line',
      data: [],
    },
    {
      itemStyle: {
        normal: {
          color: '#5793f3', // 折点颜色
        },
      },
      name: '项目组数量',
      type: 'line',
      data: [],
    },
    {
      itemStyle: {
        normal: {
          color: '#10c322', // 折点颜色
        },
      },
      name: '工序数量',
      type: 'line',
      data: [],
    },
  ],
};

export default option;
